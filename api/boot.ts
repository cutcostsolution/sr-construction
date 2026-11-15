import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { log } from "./lib/logger";
import { handleClientLog } from "./lib/clientlog";
import { REQUEST_ID_HEADER, runWithRequestId } from "./lib/requestcontext";
import { getDb } from "./queries/connection";
import { mediaFiles, settings, pageContent, services, projects, blogPosts, users } from "../db/schema";
import { eq, count } from "drizzle-orm";
import bcrypt from "bcryptjs";

const app = new Hono<{ Bindings: HttpBindings }>();

// One middleware for both halves of request observability, because they need the
// same scope and the same id:
//   - G3 correlation: mint a request id, echo it on the response header (what the
//     browser logger reads), and run the rest of the request inside it so every
//     server log line carries it.
//   - G4 access log: one line per request with method/path/status/duration, so
//     "who called what and how long did it take" is answerable. Until now only
//     failures were logged at all, and success left no trace.
// /api/log is skipped: it is the browser's log sink, and an access line per
// POSTed batch would be self-amplifying noise in the very file it writes.
app.use("*", async (c, next) => {
  const requestId = crypto.randomUUID();
  if (c.req.path === "/api/log") {
    await next();
    return;
  }
  const start = Date.now();
  await runWithRequestId(requestId, async () => {
    await next();
    // Set the header AFTER next(): the tRPC route hands Hono a raw Response
    // built by fetchRequestHandler, which carries its own headers, so a
    // c.header() called before dispatch is dropped on that path. Setting it on
    // the resolved c.res covers every route, including the tRPC one.
    c.res.headers.set(REQUEST_ID_HEADER, requestId);
    // Only /api/* is logged. In production serveStaticFiles() registers a
    // catch-all AFTER this middleware, so a page load pulls in every asset as
    // its own request — logging those would bury the API calls the agent reads
    // this file for, and inflate the log for no diagnostic gain.
    if (!c.req.path.startsWith("/api/")) return;
    log.info("request", {
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      durationMs: Date.now() - start,
    });
  });
});

// Scoped to the tRPC route, NOT global: on the dev server (@hono/vite-dev-server)
// a global bodyLimit breaks bodyless requests. Hono's bodyLimit reads any truthy
// request stream to the end and then rebuilds the Request with `new Request(raw,
// { body, duplex: "half" })`; the dev server's Response/Request class makes that
// rebuild throw `TypeError: Cannot read private member #state ...`, so every
// bodyless request (DELETE/PATCH on the app's own REST routes) 500s at dispatch.
// /api/log keeps its own 64KB caps in lib/clientlog.ts, so it needs no middleware.
// Security headers on every response.
app.use("*", async (c, next) => {
  await next();
  c.res.headers.set("X-Content-Type-Options", "nosniff");
  c.res.headers.set("X-Frame-Options", "DENY");
  c.res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  c.res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  c.res.headers.set("X-XSS-Protection", "1; mode=block");
  c.res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
});

// CORS: only allow same-origin and admin preview.
app.use("*", async (c, next) => {
  const origin = c.req.header("origin");
  const host = c.req.header("host") || "";
  if (origin && !origin.includes(host) && !origin.includes("onrender.com") && !origin.includes("localhost")) {
    return c.json({ error: "CORS blocked" }, 403);
  }
  if (origin) {
    c.res.headers.set("Access-Control-Allow-Origin", origin);
    c.res.headers.set("Access-Control-Allow-Credentials", "true");
    c.res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    c.res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }
  if (c.req.method === "OPTIONS") return c.body(null, 204);
  await next();
});

// Login brute-force guard: 10 attempts per IP per 10 minutes.
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
app.use("/api/trpc/auth.login", async (c, next) => {
  const ip = c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const rec = loginAttempts.get(ip);
  if (rec && rec.resetAt > now && rec.count >= 10) {
    return c.json(
      [{ error: { json: { message: "Too many sign-in attempts — wait a few minutes and try again.", code: -32029, data: { code: "TOO_MANY_REQUESTS", httpStatus: 429 } } } }],
      429,
    );
  }
  if (!rec || rec.resetAt <= now) loginAttempts.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
  else rec.count++;
  if (loginAttempts.size > 5000) {
    for (const [k, v] of loginAttempts) if (v.resetAt <= now) loginAttempts.delete(k);
  }
  await next();
});

// Upload rate limiter: 20 uploads per IP per hour.
const uploadAttempts = new Map<string, { count: number; resetAt: number }>();
app.use("/api/trpc/admin.uploadMedia", async (c, next) => {
  const ip = c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const rec = uploadAttempts.get(ip);
  if (rec && rec.resetAt > now && rec.count >= 20) {
    return c.json(
      [{ error: { json: { message: "Upload limit reached — wait an hour and try again.", code: -32029, data: { code: "TOO_MANY_REQUESTS", httpStatus: 429 } } } }],
      429,
    );
  }
  if (!rec || rec.resetAt <= now) uploadAttempts.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
  else rec.count++;
  if (uploadAttempts.size > 5000) {
    for (const [k, v] of uploadAttempts) if (v.resetAt <= now) uploadAttempts.delete(k);
  }
  await next();
});

app.use("/api/trpc/*", bodyLimit({ maxSize: 50 * 1024 * 1024 }));
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
// Browser-side log sink (see lib/clientlog.ts). Must be registered before the
// /api/* 404 catch-all below. bodyLimit guards it too: lib/clientlog.ts caps the
// body itself, but only AFTER Hono has read it into memory, and this route sits
// on the public preview URL — the cap has to bite before the read.
app.post(
  "/api/log",
  bodyLimit({ maxSize: 64 * 1024, onError: (c) => c.body(null, 413) }),
  handleClientLog,
);

// Serve uploaded media files directly from the database
app.get("/api/media", async (c) => {
  const key = c.req.query("key");
  if (!key) return c.json({ error: "Missing key" }, 400);
  const db = getDb();
  const [row] = await db.select({ content: mediaFiles.content, contentType: mediaFiles.contentType }).from(mediaFiles).where(eq(mediaFiles.key, key)).limit(1);
  if (!row?.content) return c.json({ error: "Not Found" }, 404);
  const buf = Buffer.from(row.content, "base64");
  c.header("Content-Type", row.contentType || "application/octet-stream");
  c.header("Cache-Control", "no-cache, no-store, must-revalidate");
  return c.body(buf);
});

app.get("/health", (c) => c.json({ status: "ok", time: new Date().toISOString() }));

app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

// Unhandled request errors must reach /tmp/kimi-logs/app.log, not just stdout:
// that file is what the building agent reads when a preview 500s, and without
// this the log looks clean while the request actually failed. Response stays a
// generic 500 (no stack leaked to the caller); the detail goes to the log only.
app.onError((err, c) => {
  log.error("unhandled request error", {
    method: c.req.method,
    path: c.req.path,
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  });
  return c.json({ error: "Internal Server Error" }, 500);
});

// ─── AUTO-SEED: populate database on first startup ───
async function autoSeed() {
  try {
    const db = getDb();
    const [svc] = await db.select({ n: count() }).from(services);
    if (svc.n > 0) { log.info("auto-seed: database already has data, skipping"); return; }

    log.info("auto-seed: database empty, seeding...");

    // Settings
    const settingRows = [
      { key: "brand.phone", value: "0707 112 2510", category: "brand" },
      { key: "brand.whatsapp", value: "2347071122510", category: "brand" },
      { key: "brand.email", value: "info@srconstructions.ng", category: "brand" },
      { key: "brand.address", value: "Bics Mall, 61 Olusegun-Obasanjo Road, Port Harcourt", category: "brand" },
      { key: "brand.registration", value: "RC: 7682579", category: "brand" },
      { key: "consultation.mode", value: "free", category: "consultation" },
      { key: "consultation.fee", value: "0", category: "consultation" },
      { key: "payment.bank_name", value: "SunTrust Bank", category: "payment" },
      { key: "payment.account_name", value: "Spark Realty And Construction Ltd", category: "payment" },
      { key: "payment.account_number", value: "0025929213", category: "payment" },
    ];
    for (const s of settingRows) await db.insert(settings).values(s);

    // Page content
    const pages: Record<string, Record<string, string>> = {
      home: {
        kicker: "Full-cycle construction · Across Nigeria",
        title: "We build with certainty.",
        body: "From the first drawing to the final handover, SR Construction brings engineering, site execution and accountable project delivery into one clear process.",
        heroImage: "/assets/hero-duplex.jpg",
        statsProjects: "50+", statsYears: "12+", statsStates: "6", statsTeam: "80+",
        principlesKicker: "The SR Standard", principlesTitle: "Built on four principles",
      },
      about: {
        kicker: "About SR Construction",
        title: "One team. One accountable standard.",
        body: "SR Construction is a Nigerian construction and engineering company operating from Port Harcourt and delivering projects across Nigeria.",
        quote: "We don't subcontract accountability. When SR Construction signs a contract, the delivery promise is ours.",
        storyTitle: "Built around the work, not the noise.",
        storyBody: "We keep the brief, the technical decisions, the materials and the site work connected. Clients know what has been done, what comes next and who is responsible.",
        valuesKicker: "Guiding Principles", valuesTitle: "What drives every decision",
        locationTitle: "Operations Across Nigeria",
        locations: "Port Harcourt · Lagos · Abuja · Asaba · Owerri · Uyo",
        image: "/assets/project-apartments-wide.webp",
      },
      founder: {
        kicker: "The Founder",
        title: "Engineering-First Leadership",
        body: "Built on years of hands-on site experience, SR Construction is led by someone who understands that buildings are only as good as the decisions made at ground level.",
      },
      services: {
        kicker: "What We Do",
        title: "Built properly from the ground up.",
        body: "From concept to completion, every service is designed to deliver certainty.",
      },
      projects: {
        kicker: "Our Portfolio",
        title: "Work That Speaks",
        body: "Every project is a partnership. Browse our completed and ongoing builds across Nigeria.",
      },
      network: {
        kicker: "Grow With Us",
        title: "Build Your Future With SR Construction",
        body: "We believe in building people as much as we believe in building structures. Whether you are a skilled artisan, a reliable supplier or a technical expert, SR Construction is your platform to grow, earn and leave a legacy.",
        heroImage: "/assets/hero-building.jpg",
      },
      consultation: {
        kicker: "Book a Consultation",
        title: "Let's talk about your project.",
        body: "Every great build starts with a clear conversation. Tell us about your site, your vision and your timeline, and we will show you the practical path forward.",
      },
      contact: {
        kicker: "Get in Touch",
        title: "Let's Build Something Lasting.",
        body: "Whether you have a project brief, a site to assess or a question about how we work, we are here to respond.",
      },
    };
    for (const [page, content] of Object.entries(pages)) {
      await db.insert(pageContent).values({ page, content });
    }

    // Services
    const svcRows = [
      { name: "Design & Build Construction", slug: "design-build-construction", category: "Full-Cycle Delivery", summary: "Architecture, engineering and construction coordinated under one accountable team.", description: "Our Design & Build service covers the entire project lifecycle from architectural drawings through structural engineering to final handover. A single point of accountability means no blame-shifting between design and build teams.", features: JSON.stringify(["Single-point accountability", "Coordinated design & engineering", "Fixed-price options", "Real-time progress tracking"]), image: "/assets/hero-duplex.jpg", isPublished: true },
      { name: "Structural Steel & Roof Trusses", slug: "structural-steel-roof-trusses", category: "Structural Engineering", summary: "In-house steel fabrication for roof trusses, frames, balustrades and gatehouses.", description: "Our in-house steel workshop produces roof trusses, steel frames, balustrades and gatehouses to precise engineering specifications. Every weld is inspected and every piece is delivered ready for installation.", features: JSON.stringify(["In-house fabrication", "Engineering-certified welding", "Galvanised & painted finishes", "Delivery & installation included"]), image: "/assets/service-steel.webp", isPublished: true },
      { name: "Reinforced Concrete & Superstructure", slug: "reinforced-concrete-superstructure", category: "Structural Engineering", summary: "Precise formwork, reinforcement, columns, beams and suspended concrete slabs.", description: "From raft foundations to suspended floor slabs, our concrete team delivers structural elements that meet or exceed engineering specification. Reinforcement is cut, bent and placed under supervision.", features: JSON.stringify(["Concrete grade verification", "Rebar placement inspection", "Formwork quality control", "Curing & testing records"]), image: "/assets/service-concrete.jpg", isPublished: true },
      { name: "Foundations & Ground Engineering", slug: "foundations-ground-engineering", category: "Civil Works", summary: "Ground beams, raft foundations, retaining walls and difficult-site stabilisation.", description: "We assess soil conditions and design foundations that match the ground reality. From strip foundations on stable ground to raft foundations on difficult soil, our approach is technical and accountable.", features: JSON.stringify(["Soil testing & analysis", "Foundation design verification", "Groundwater management", "Slope stabilisation"]), image: "/assets/service-foundation.jpg", isPublished: true },
      { name: "Drainage, Paving & Perimeter Works", slug: "drainage-paving-perimeter-works", category: "Infrastructure", summary: "Practical external works that protect the property and complete the site.", description: "We install surface and sub-surface drainage, interlocking paving and perimeter walls that protect the building envelope and complete the site to a high standard.", features: JSON.stringify(["Surface & sub-surface drainage", "Interlocking paving", "Perimeter wall construction", "Landscape integration"]), image: "/assets/service-drainage.webp", isPublished: true },
      { name: "Sports Turf & Facility Construction", slug: "sports-turf-facility-construction", category: "Specialist Construction", summary: "Sports grounds delivered from sub-base civil works to turf and facility setup.", description: "From sub-base civil works through drainage, turf laying and facility construction, we deliver sports grounds that are playable, durable and properly engineered.", features: JSON.stringify(["Sub-base & drainage engineering", "Natural & artificial turf", "Fencing & floodlighting", "Facility buildings"]), image: "/assets/service-turf.jpg", isPublished: true },
    ];
    for (const s of svcRows) await db.insert(services).values(s);

    // Projects
    const projRows = [
      { title: "Twin 2-Storey Residential Apartments", slug: "twin-residential-apartments-port-harcourt", category: "Residential", location: "Sars Road, Port Harcourt", summary: "Two identical 2-storey residential buildings delivered from foundation to final finishes.", description: "A residential development project delivering two identical 2-storey buildings. The scope included foundation excavation, reinforced concrete structure, roofing, electrical and plumbing installations, tiling and external works.", image: "/assets/project-apartments-wide.webp", gallery: JSON.stringify(["/assets/project-apartments.webp", "/assets/project-apartments-wide.webp"]), stat: "2 buildings · 12 months", completionDate: "2024", status: "completed", isFeatured: true, isPublished: true },
      { title: "Executive 6-Bedroom Luxury Duplex", slug: "executive-luxury-duplex", category: "Residential", location: "Port Harcourt & Delta State", summary: "A premium 6-bedroom duplex with bespoke finishes and modern infrastructure.", description: "An executive residential project featuring 6 bedrooms, open-plan living spaces, modern kitchen, home office, swimming pool area and smart home infrastructure. Delivered with premium finishes throughout.", image: "/assets/project-duplex-complete.webp", gallery: JSON.stringify(["/assets/project-duplex-complete.webp", "/assets/project-duplex.webp"]), stat: "6 bedrooms · 18 months", completionDate: "2024", status: "completed", isFeatured: true, isPublished: true },
      { title: "Hospitality & Recreational Development", slug: "hospitality-complex-asaba", category: "Hospitality & Recreation", location: "Asaba, Delta State", summary: "A hospitality and recreational facility designed for community engagement.", description: "A mixed-use hospitality and recreational development in Asaba. The project includes event halls, outdoor recreational spaces, parking infrastructure and landscaping designed for community use.", image: "/assets/project-asaba.webp", gallery: JSON.stringify(["/assets/project-asaba.webp"]), stat: "Multi-facility · 24 months", completionDate: "2023", status: "completed", isFeatured: false, isPublished: true },
    ];
    for (const p of projRows) await db.insert(projects).values(p);

    // Blog posts
    const blogRows = [
      { title: "Why Accountability Matters in Nigerian Construction", slug: "why-accountability-matters", category: "Industry Insight", excerpt: "The difference between a project that finishes on time and one that drags on for years often comes down to one thing: who is actually accountable.", body: "In the Nigerian construction industry, accountability is not just a buzzword — it is the difference between a project that delivers and one that disappoints. When a single company takes responsibility for design, engineering and execution, there is no room for blame-shifting...", image: "/assets/hero-structure.jpg", readTime: "6 min read", isPublished: true },
      { title: "How to Choose the Right Foundation for Your Site", slug: "how-to-choose-the-right-foundation", category: "Technical Guide", excerpt: "Soil conditions vary dramatically across Nigeria. Choosing the wrong foundation type can add millions to your project cost.", body: "Nigeria's geological diversity means that a foundation design that works perfectly in Lagos may be completely inappropriate for Port Harcourt or Abuja. Understanding your soil conditions is the first step to choosing the right foundation...", image: "/assets/hero-foundation.jpg", readTime: "8 min read", isPublished: true },
      { title: "The Real Cost of Cheap Concrete", slug: "the-real-cost-of-cheap-concrete", category: "Industry Insight", excerpt: "Cutting costs on concrete grades might save money today, but the structural consequences can last decades.", body: "Concrete is the backbone of modern construction. Yet in Nigeria, the temptation to use lower-grade concrete to reduce immediate costs is a persistent problem. The consequences — structural weakness, cracking, water ingress — often appear years later when remediation is far more expensive...", image: "/assets/service-concrete.jpg", readTime: "5 min read", isPublished: true },
    ];
    for (const b of blogRows) await db.insert(blogPosts).values(b);

    // Default admin user
    const hash = await bcrypt.hash("SrAdmin2025!", 12);
    await db.insert(users).values({ email: "admin@srconstructions.ng", password: hash, name: "SR Admin", role: "admin" });

    log.info("auto-seed: complete — database populated");
  } catch (e) {
    log.error("auto-seed failed", { error: e instanceof Error ? e.message : String(e) });
  }
}

export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  log.info(`Starting SR Construction server on port ${port}...`);
  log.info(`NODE_ENV: ${process.env.NODE_ENV}`);
  log.info(`DATABASE_URL set: ${!!env.databaseUrl}`);
  log.info(`APP_SECRET set: ${!!env.appSecret}`);

  // Seed before starting server
  await autoSeed();

  serve({ fetch: app.fetch, port }, () => {
    log.info(`Server running on http://localhost:${port}/`);
  });
}
