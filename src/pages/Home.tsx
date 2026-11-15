import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { ArrowUpRight, TrendingUp, ShieldCheck, Target, Gem } from "lucide-react";
import { usePage } from "@/lib/site";
import { trpc } from "@/providers/trpc";
import { ConsultationCTA } from "@/components/SiteLayout";

function imgFallback(e: React.SyntheticEvent<HTMLImageElement>) {
  (e.target as HTMLImageElement).src = "/assets/hero-structure.jpg";
}

export default function Home() {
  const { page } = usePage("home");
  const heroRef = useRef<HTMLElement>(null);
  const servicesQ = trpc.public.services.useQuery();
  const projectsQ = trpc.public.projects.useQuery({ limit: 3 });

  const fallbackServices = [
    { id: 1, slug: "design-build-construction", category: "Full-Cycle Delivery", name: "Design & Build Construction", image: "/assets/hero-duplex.jpg", summary: "Architecture, engineering and construction coordinated under one accountable team." },
    { id: 2, slug: "structural-steel-roof-trusses", category: "Structural Engineering", name: "Structural Steel & Roof Trusses", image: "/assets/service-steel.webp", summary: "In-house steel fabrication for roof trusses, frames, balustrades and gatehouses." },
    { id: 3, slug: "reinforced-concrete-superstructure", category: "Structural Engineering", name: "Reinforced Concrete & Superstructure", image: "/assets/service-concrete.jpg", summary: "Precise formwork, reinforcement, columns, beams and suspended concrete slabs." },
    { id: 4, slug: "foundations-ground-engineering", category: "Civil Works", name: "Foundations & Ground Engineering", image: "/assets/service-foundation.jpg", summary: "Ground beams, raft foundations, retaining walls and difficult-site stabilisation." },
  ];
  const fallbackProjects = [
    { id: 1, slug: "twin-residential-apartments-port-harcourt", title: "Twin 2-Storey Residential Apartments", category: "Residential", location: "Sars Road, Port Harcourt", image: "/assets/project-apartments-wide.webp", status: "completed" },
    { id: 2, slug: "executive-luxury-duplex", title: "Executive 6-Bedroom Luxury Duplex", category: "Residential", location: "Port Harcourt & Delta State", image: "/assets/project-duplex-complete.webp", status: "completed" },
    { id: 3, slug: "hospitality-complex-asaba", title: "Hospitality & Recreational Development", category: "Hospitality & Recreation", location: "Asaba, Delta State", image: "/assets/project-asaba.webp", status: "completed" },
  ];
  const displayServices = (servicesQ.data?.length ? servicesQ.data : fallbackServices).slice(0, 4);
  const displayProjects = (projectsQ.data?.length ? projectsQ.data : fallbackProjects).slice(0, 3);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const handleScroll = () => {
      const y = window.scrollY;
      const bg = el.querySelector(".hero-bg") as HTMLElement;
      if (bg) bg.style.transform = `translateY(${y * 0.3}px) scale(1.05)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const principles = [
    { icon: ShieldCheck, title: "Structural Integrity", body: "Every joint, pour and connection is executed to engineering specification with clear inspection records." },
    { icon: Target, title: "Delivery Discipline", body: "Milestones, materials and communication are tracked so projects stay coordinated and avoid avoidable surprises." },
    { icon: Gem, title: "Material Quality", body: "We source and verify concrete grades, reinforcement standards and finishing materials before they reach the site." },
    { icon: TrendingUp, title: "Clear Communication", body: "Progress, decisions and changes are reported so clients understand what is happening, why and what comes next." },
  ];

  return (
    <>
      {/* ===== HERO ===== */}
      <section ref={heroRef} style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
        <div className="hero-bg" style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${page.heroImage || "/assets/hero-duplex.jpg"})`,
          backgroundSize: "cover", backgroundPosition: "center",
          transform: "scale(1.05)",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(10,10,15,0.88) 0%, rgba(10,10,15,0.5) 100%)" }} />
        <div className="container hero-pad" style={{ position: "relative", zIndex: 2, padding: "140px 5vw 100px" }}>
          <div className="grid-split" style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: 80, alignItems: "center" }}>
            <div>
              <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 20 }}>
                {page.kicker || "Full-cycle construction · Across Nigeria"}
              </span>
              <h1 className="display-xl" style={{ marginBottom: 24, lineHeight: 1.05 }}>
                {page.title || "We build with certainty."}
              </h1>
              <p className="body-lg" style={{ fontSize: 18, marginBottom: 36, maxWidth: 560, color: "var(--text-dim)" }}>
                {page.body || "From the first drawing to the final handover, SR Construction brings engineering, site execution and accountable project delivery into one clear process."}
              </p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <Link to="/consultation" className="btn btn-primary">
                  Book a Consultation <ArrowUpRight size={16} />
                </Link>
                <Link to="/projects" className="btn btn-outline">
                  See Our Work <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
            <div
              style={{
                background: "rgba(245,240,232,0.06)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(245,240,232,0.12)",
                borderRadius: "var(--radius-xl)",
                padding: "clamp(32px, 4vw, 48px)",
              }}
            >
              <p className="caption" style={{ color: "var(--accent)", marginBottom: 16 }}>Quick Snapshot</p>
              <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
                {[
                  { label: "Projects Delivered", value: page.statsProjects || "50+" },
                  { label: "Years Building", value: page.statsYears || "12+" },
                  { label: "States Covered", value: page.statsStates || "6" },
                  { label: "Field Staff", value: page.statsTeam || "80+" },
                ].map((s) => (
                  <div key={s.label}>
                    <strong className="stat-number" style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--text)", display: "block" }}>{s.value}</strong>
                    <span style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <div style={{ background: "var(--void)", borderTop: "1px solid var(--line-dark)", borderBottom: "1px solid var(--line-dark)", padding: "16px 0", overflow: "hidden" }}>
        <div className="marquee-track" style={{ display: "flex", gap: 48, whiteSpace: "nowrap" }}>
          {["STRUCTURAL ENGINEERING", "DESIGN & BUILD", "CONCRETE & SUPERSTRUCTURE", "STEEL FABRICATION", "FOUNDATIONS", "DRAINAGE & PAVING", "PROJECT MANAGEMENT", "QUALITY CONTROL"].map((t) => (
            <span key={t} style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 500 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ===== PRINCIPLES ===== */}
      <section className="section-cream section-pad" style={{ background: "var(--cream)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 60px" }}>
            <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
              {page.principlesKicker || "The SR Standard"}
            </span>
            <h2 className="display-md" style={{ color: "var(--ink)" }}>
              {page.principlesTitle || "Built on four principles"}
            </h2>
          </div>
          <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {principles.map((p) => (
              <div
                key={p.title}
                style={{
                  padding: "clamp(28px, 3vw, 40px)",
                  background: "var(--warm-white)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--line)",
                  textAlign: "left",
                }}
              >
                <p.icon size={28} style={{ color: "var(--accent)", marginBottom: 20 }} />
                <h3 className="heading-md" style={{ fontSize: 18, marginBottom: 12, color: "var(--ink)" }}>{p.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--stone)" }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES PREVIEW ===== */}
      <section className="section-dark section-pad">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
            <div>
              <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>What We Do</span>
              <h2 className="display-md">Built properly from the ground up.</h2>
            </div>
            <Link to="/services" className="btn btn-outline">All Services <ArrowUpRight size={16} /></Link>
          </div>
          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {displayServices.map((s) => (
              <Link key={s.id} to={`/services/${s.slug}`} className="service-reveal" style={{
                display: "block", background: "var(--void-soft)", borderRadius: "var(--radius-lg)", border: "1px solid var(--line-dark)", overflow: "hidden",
                textDecoration: "none", color: "inherit", transition: "all 0.4s ease",
              }}>
                <div style={{ height: 220, overflow: "hidden" }}>
                  <img src={s.image || "/assets/hero-structure.jpg"} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }} onError={imgFallback} />
                </div>
                <div style={{ padding: "28px 32px" }}>
                  <p style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{s.category}</p>
                  <h3 className="heading-md" style={{ fontSize: 20, marginBottom: 10 }}>{s.name}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-dim)" }}>{s.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROJECTS ===== */}
      <section className="section-dark section-pad" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
            <div>
              <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>Selected Work</span>
              <h2 className="display-md">Proof, built in full view.</h2>
            </div>
            <Link to="/projects" className="btn btn-outline">All Projects <ArrowUpRight size={16} /></Link>
          </div>
          <div className="grid-3 project-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {displayProjects.map((p, i) => (
              <Link key={p.id} to={`/projects/${p.slug}`} className="project-reveal" style={{
                display: "block", position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--line-dark)",
                textDecoration: "none", color: "inherit",
                aspectRatio: i === 0 ? "1/1" : "3/4", gridColumn: i === 0 ? "span 2" : "span 1", gridRow: i === 0 ? "span 2" : "span 1",
              }}>
                <img src={p.image || "/assets/hero-structure.jpg"} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }} onError={imgFallback} />
                <div className="project-overlay" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,15,0.85), transparent 60%)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 32 }}>
                  <p style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{p.category} · {p.location}</p>
                  <h3 className="heading-md" style={{ fontSize: 20 }}>{p.title}</h3>
                  {p.status === "ongoing" && (
                    <span style={{ display: "inline-block", marginTop: 8, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent)", border: "1px solid var(--accent)", padding: "4px 10px", borderRadius: 20 }}>Ongoing</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOUNDER TEASER ===== */}
      <section className="section-cream section-pad" style={{ background: "var(--cream)" }}>
        <div className="container">
          <div className="grid-asym" style={{ display: "grid", gridTemplateColumns: "0.42fr 1fr", gap: 80, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <img src="/assets/founder.jpg" alt="Emmanuel Andrew Nwosu" style={{ width: "100%", borderRadius: "var(--radius-xl)", objectFit: "cover", aspectRatio: "3/4" }} onError={imgFallback} />
              <div className="float-badge" style={{
                position: "absolute", bottom: -20, right: -20,
                background: "var(--warm-white)", border: "1px solid var(--line)",
                borderRadius: "var(--radius-lg)", padding: "24px 28px", maxWidth: 220,
              }}>
                <p className="caption" style={{ color: "var(--accent)", marginBottom: 4 }}>Founder</p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--ink)" }}>Emmanuel Andrew Nwosu</p>
                <p style={{ fontSize: 12, color: "var(--stone)", marginTop: 4 }}>Managing Director</p>
              </div>
            </div>
            <div>
              <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>Leadership</span>
              <h2 className="display-md" style={{ marginBottom: 20, color: "var(--ink)" }}>Engineering, discipline and clear communication.</h2>
              <p className="body-lg" style={{ marginBottom: 28, color: "var(--stone)" }}>
                Emmanuel Andrew Nwosu leads SR Construction with a clear conviction: clients should not have to choose between ambitious design and disciplined execution. His approach puts sound engineering, visible accountability and practical communication at the centre of every project.
              </p>
              <Link to="/founder" className="btn btn-outline" style={{ color: "var(--ink)", borderColor: "var(--line)" }}>
                Meet the Founder <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== METRICS ===== */}
      <section className="section-dark section-pad">
        <div className="container">
          <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {[
              { label: "Projects Delivered", value: page.statsProjects || "50+" },
              { label: "Years Building", value: page.statsYears || "12+" },
              { label: "States Covered", value: page.statsStates || "6" },
              { label: "Field Staff", value: page.statsTeam || "80+" },
            ].map((s) => (
              <div key={s.label} className="metric-reveal" style={{ textAlign: "center", padding: "clamp(32px, 4vw, 48px)", background: "var(--void-soft)", borderRadius: "var(--radius-lg)", border: "1px solid var(--line-dark)" }}>
                <strong className="stat-number" style={{ fontFamily: "var(--font-display)", fontSize: 42, color: "var(--text)", display: "block", marginBottom: 8 }}>{s.value}</strong>
                <span style={{ fontSize: 12, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}
