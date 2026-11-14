import "dotenv/config";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb } from "../api/queries/connection";
import { settings, pageContent, services, projects, blogPosts, users } from "./schema";

const SETTINGS = [
  ["brand.phone", "0707 112 2510", "brand"],
  ["brand.whatsapp", "2347071122510", "brand"],
  ["brand.email", "info@srconstructions.ng", "brand"],
  ["brand.address", "Bics Mall, 61 Olusegun-Obasanjo Road, Port Harcourt", "brand"],
  ["brand.registration", "RC: 7682579", "brand"],
  ["consultation.mode", "free", "consultation"],
  ["consultation.fee", "0", "consultation"],
  ["payment.bank_name", "SunTrust Bank", "payment"],
  ["payment.account_name", "Spark Realty And Construction Ltd", "payment"],
  ["payment.account_number", "0025929213", "payment"],
];

const PAGES: Record<string, Record<string, string>> = {
  home: {
    kicker: "Full-cycle construction · Across Nigeria",
    title: "We build with certainty.",
    body: "From the first drawing to the final handover, SR Construction brings engineering, site execution and accountable project delivery into one clear process.",
    heroImage: "/assets/hero-duplex.jpg",
    introTitle: "Quality you can see. Control you can feel.",
    introBody: "We coordinate design, engineering, materials and skilled site work around one standard: build it properly, communicate clearly and deliver without avoidable surprises.",
    image: "/assets/hero-structure.jpg",
    ctaTitle: "Your project deserves a clear, confident start.",
    ctaBody: "Book a consultation and speak directly with our project team. We will review your site, scope and timeline, then give you a practical roadmap with real numbers — no vague promises, no hidden steps.",
  },
  about: {
    kicker: "About SR Construction", title: "One team. One accountable standard.",
    body: "SR Construction is a Nigerian construction and engineering company operating from Port Harcourt and delivering projects across Nigeria.",
    heroImage: "/assets/hero-building.jpg",
    storyTitle: "Built around the work, not the noise.",
    storyBody: "We keep the brief, the technical decisions, the materials and the site work connected. Clients know what has been done, what comes next and who is responsible. That is how we protect quality, speed and trust from foundation to handover.",
    image: "/assets/project-apartments-wide.webp",
  },
  founder: {
    kicker: "The Founder", title: "Emmanuel Andrew Nwosu",
    role: "Founder & Managing Director, SR Construction",
    body: "Emmanuel Andrew Nwosu leads SR Construction with a clear conviction: clients should not have to choose between ambitious design and disciplined execution. His approach puts sound engineering, visible accountability and practical communication at the centre of every project.",
    quote: "A good build is not only about the finished structure. It is about the confidence the client has throughout the process.",
    photo: "/assets/founder.jpg", heroImage: "/assets/hero-structure.jpg",
    website: "", linkedin: "", x: "",
  },
  services: { kicker: "Our Services", title: "Built properly from the ground up.", body: "Technical expertise, careful coordination and reliable site execution for residential, commercial and specialist projects.", heroImage: "/assets/service-concrete.jpg" },
  projects: { kicker: "Selected Work", title: "Proof, built in full view.", body: "Explore a selection of residential and hospitality projects delivered with close attention to structure, finish and function.", heroImage: "/assets/project-apartments-wide.webp" },
  network: { kicker: "Our Network", title: "Good work needs the right people.", body: "We welcome capable suppliers, vendors, artisans and built-environment professionals who share our commitment to quality and dependable delivery.", heroImage: "/assets/service-steel.webp" },
  contact: { kicker: "Contact SR Construction", title: "Let’s talk about what comes next.", body: "Share your project, question or partnership idea. Your message goes directly to our admin team for review and response.", heroImage: "/assets/handoff.jpg" },
  consultation: { kicker: "Book Your Consultation", title: "Get clarity before you commit.", body: "A 30-minute focused conversation with our project team. We will understand your site, scope and priorities, then give you a clear next step — whether that is a formal proposal, a site visit or a detailed scope review.", heroImage: "/assets/hero-foundation.jpg" },
  blogs: { kicker: "Insights & Guides", title: "Build with better information.", body: "Practical notes on construction decisions, project planning and delivery in Nigeria.", heroImage: "/assets/project-interior.webp" },
};

const SERVICES = [
  { name: "Design & Build Construction", slug: "design-build-construction", category: "Full-Cycle Delivery", summary: "Architecture, engineering and construction coordinated under one accountable team.", description: "From early scope and drawings to engineering, procurement and site delivery, we keep every part of the build connected. Clients have one clear point of responsibility from brief to handover.", capabilities: ["Scope and project planning", "Architectural and engineering coordination", "BOQ and procurement planning", "Turnkey construction and handover"], image: "/assets/hero-duplex.jpg", isPublished: true, sortOrder: 1 },
  { name: "Structural Steel & Roof Trusses", slug: "structural-steel-roof-trusses", category: "Structural Engineering", summary: "In-house steel fabrication for roof trusses, frames, balustrades and gatehouses.", description: "We fabricate and install structural steel components with close attention to measurements, connections, corrosion protection and the requirements of the wider build.", capabilities: ["Custom steel trusses", "High-yield structural steel", "Anti-rust priming", "Metal balustrades and frames"], image: "/assets/service-steel.webp", isPublished: true, sortOrder: 2 },
  { name: "Reinforced Concrete & Superstructure", slug: "reinforced-concrete-superstructure", category: "Structural Engineering", summary: "Precise formwork, reinforcement, columns, beams and suspended concrete slabs.", description: "Our superstructure work covers setting out, reinforcement placement, formwork, casting and alignment checks so that each stage supports the next.", capabilities: ["Column and beam execution", "Decking slab mesh and casting", "Timber formwork", "Vibrated concrete pours"], image: "/assets/service-concrete.jpg", isPublished: true, sortOrder: 3 },
  { name: "Foundations & Ground Engineering", slug: "foundations-ground-engineering", category: "Civil Works", summary: "Ground beams, raft foundations, retaining walls and difficult-site stabilisation.", description: "We approach foundation work from the actual site conditions, coordinating excavation, reinforcement, concrete works and the technical checks required for durable support.", capabilities: ["Ground excavation and beams", "Raft foundation casting", "Retaining walls", "Swamp-site stabilisation"], image: "/assets/service-foundation.jpg", isPublished: true, sortOrder: 4 },
  { name: "Drainage, Paving & Perimeter Works", slug: "drainage-paving-perimeter-works", category: "Infrastructure", summary: "Practical external works that protect the property and complete the site.", description: "We execute drainage channels, storm-water routes, perimeter blockwork, grading and interlock paving as part of a coordinated site-delivery plan.", capabilities: ["Concrete drainage channels", "Storm-water management", "Perimeter security blockwork", "Interlock driveway paving"], image: "/assets/service-drainage.webp", isPublished: true, sortOrder: 5 },
  { name: "Sports Turf & Facility Construction", slug: "sports-turf-facility-construction", category: "Specialist Construction", summary: "Sports grounds delivered from sub-base civil works to turf and facility setup.", description: "We build the layers beneath the playing surface as carefully as the visible finish, coordinating drainage, base preparation, shock pads, synthetic turf and supporting facilities.", capabilities: ["Sub-surface drainage", "Sub-base preparation", "Shock-pad underlayment", "Synthetic turf installation"], image: "/assets/service-turf.jpg", isPublished: true, sortOrder: 6 },
];

const PROJECTS = [
  { serviceSlug: "design-build-construction", title: "Twin 2-Storey Residential Apartments", slug: "twin-residential-apartments-port-harcourt", category: "Residential", location: "Sars Road, Port Harcourt", summary: "A twin residential development with twelve two-bedroom flats, a self-contained unit, gatehouse and store facility.", description: "This multi-unit development shows SR Construction’s full-cycle approach across structure, external works and residential finishing. Project photographs document the development from construction through its completed form.", image: "/assets/project-apartments-wide.webp", gallery: ["/assets/project-apartments-wide.webp", "/assets/project-apartments.webp", "/assets/hero-structure.jpg"], stat: "95% occupancy reported", completionDate: null, status: "completed" as const, isFeatured: true, isPublished: true },
  { serviceSlug: "design-build-construction", title: "Executive 6-Bedroom Luxury Duplex", slug: "executive-luxury-duplex", category: "Residential", location: "Port Harcourt & Delta State", summary: "An executive duplex development with a six-bedroom main building, private library and supporting accommodation.", description: "A high-specification private residence coordinated across structural work, architectural detailing and interior finishing. The project record reflects the relationship between the construction process and the final living spaces.", image: "/assets/project-duplex-complete.webp", gallery: ["/assets/project-duplex-complete.webp", "/assets/project-duplex.webp", "/assets/project-interior.webp"], stat: "60% occupancy in 10 months", completionDate: null, status: "completed" as const, isFeatured: true, isPublished: true },
  { serviceSlug: "sports-turf-facility-construction", title: "Hospitality & Recreational Development", slug: "hospitality-complex-asaba", category: "Hospitality & Recreation", location: "Asaba, Delta State", summary: "An integrated hospitality development with hotel accommodation, event spaces, recreation and supporting amenities.", description: "This development brings multiple uses into one coordinated site, including an 80-room hotel, event centre, sports complex, restaurant and bar, gym and swimming pool.", image: "/assets/project-asaba.webp", gallery: ["/assets/project-asaba.webp", "/assets/project-turf.webp", "/assets/hero-building.jpg"], stat: "100% occupancy reported", completionDate: null, status: "completed" as const, isFeatured: true, isPublished: true },
];

const POSTS = [
  { title: "How to Build a House in Nigeria from Abroad: A Safer, Documented Approach", slug: "build-house-nigeria-from-abroad", category: "Project Planning", excerpt: "A practical starting framework for diaspora clients who need clear scope, visible records and accountable site delivery.", body: "Building from another country requires more than trust. It requires a clear process.\n\nStart with a written scope\nConfirm the drawings, project inclusions, responsibilities and approval path before work begins. A detailed bill of quantities helps everyone discuss the same build.\n\nAgree how progress will be proved\nSet a reporting rhythm and define the photographs, videos, measurements and approvals expected at each milestone. Documentation should explain progress, not merely show activity.\n\nKeep changes visible\nWhen site conditions or design choices change, record the implication for cost and timing before proceeding. This protects both the client and the delivery team.\n\nUse the consultation to set the rules\nA useful first conversation covers location, project stage, decision-makers, communication and the evidence you expect throughout the build.", image: "/assets/project-apartments-wide.webp", readTime: "6 min read", isPublished: true },
  { title: "Raft Foundation vs. Strip Foundation: Start with the Ground", slug: "raft-foundation-vs-strip-foundation", category: "Engineering", excerpt: "Why foundation selection should follow site information and engineering judgment rather than a generic rule of thumb.", body: "The right foundation is not a style preference. It is a response to the ground, the structure and the loads involved.\n\nUnderstand the site first\nSoil conditions, water presence, nearby structures and proposed building loads all affect the engineering decision. Waterlogged or weak soils need particular care.\n\nCompare the structural behaviour\nA strip foundation supports loads through defined strips, while a raft spreads building loads across a larger area. Each requires appropriate design, reinforcement and concrete specification.\n\nDo not price an assumption\nA meaningful cost comparison depends on the actual design and site conditions. Early excavation or material estimates should not replace engineering review.\n\nDocument the execution\nSetting out, reinforcement, concrete placement and curing deserve close supervision and clear site records.", image: "/assets/service-foundation.jpg", readTime: "5 min read", isPublished: true },
  { title: "What a Useful Construction Consultation Should Cover", slug: "useful-construction-consultation", category: "Project Planning", excerpt: "The questions that turn an early conversation into a clear, practical next step for your project.", body: "A consultation should reduce uncertainty. It should not leave you with more vague ideas.\n\nDefine the project\nBe clear about the building type, location, current stage and intended use. Share available drawings or site information.\n\nIdentify the immediate decision\nYou may need a scope review, a technical assessment, a BOQ discussion or a delivery plan. Name the decision that matters now.\n\nDiscuss responsibilities\nClarify who owns design, approvals, procurement, site supervision and reporting. Gaps between responsibilities often become project delays.\n\nLeave with a next step\nThe outcome may be a site visit, document review, technical scope or a formal proposal. A good consultation makes that next step specific.", image: "/assets/hero-structure.jpg", readTime: "4 min read", isPublished: true },
];

async function seed() {
  const db = getDb();
  for (const [key, value, group] of SETTINGS) {
    await db.insert(settings).values({ key, value, group }).onDuplicateKeyUpdate({ set: { key } });
  }
  for (const [page, content] of Object.entries(PAGES)) {
    await db.insert(pageContent).values({ page, content }).onDuplicateKeyUpdate({ set: { page } });
  }
  for (const service of SERVICES) {
    await db.insert(services).values(service).onDuplicateKeyUpdate({ set: { slug: service.slug } });
  }
  for (const project of PROJECTS) {
    const [service] = await db.select().from(services).where(eq(services.slug, project.serviceSlug)).limit(1);
    const { serviceSlug: _serviceSlug, ...data } = project;
    await db.insert(projects).values({ ...data, serviceId: service.id }).onDuplicateKeyUpdate({ set: { slug: project.slug } });
  }
  for (const post of POSTS) {
    await db.insert(blogPosts).values(post).onDuplicateKeyUpdate({ set: { slug: post.slug } });
  }

  // Seed default admin user for password login
  const adminPassword = await bcrypt.hash("SrAdmin2025!", 12);
  await db.insert(users).values({
    name: "SR Admin",
    email: "admin@srconstructions.ng",
    passwordHash: adminPassword,
    role: "admin",
    adminRole: "super_admin",
    unionId: "local-admin",
  }).onDuplicateKeyUpdate({ set: { passwordHash: adminPassword, role: "admin", adminRole: "super_admin" } });

  console.log(`SR launch data ready: ${SERVICES.length} services, ${PROJECTS.length} projects, ${POSTS.length} articles.`);
  process.exit(0);
}

seed().catch((error) => { console.error(error); process.exit(1); });
