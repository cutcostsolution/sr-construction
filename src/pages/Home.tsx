import { useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, ArrowRight, TrendingUp, ShieldCheck, Target, Gem, HardHat, Ruler, Clock, Award } from "lucide-react";
import { usePage } from "@/lib/site";
import { trpc } from "@/providers/trpc";
import { ConsultationCTA } from "@/components/SiteLayout";

function imgFallback(e: React.SyntheticEvent<HTMLImageElement>) {
  (e.target as HTMLImageElement).src = "/assets/hero-structure.jpg";
}

export default function Home() {
  const { page } = usePage("home");
  const servicesQ = trpc.public.services.useQuery();
  const projectsQ = trpc.public.projects.useQuery({ limit: 3 });
  const [heroLoaded, setHeroLoaded] = useState(false);

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

  return (
    <>
      {/* ===== FULL-BLEED HERO ===== */}
      <section className="hero-fullbleed">
        <div
          className={`hero-bg ${heroLoaded ? "loaded" : ""}`}
          style={{ backgroundImage: `url(${page.heroImage || "/assets/hero-building.jpg"})` }}
        />
        <img
          src={page.heroImage || "/assets/hero-building.jpg"}
          alt=""
          style={{ display: "none" }}
          onLoad={() => setHeroLoaded(true)}
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-kicker">Full-cycle construction across Nigeria</span>
          <h1 className="hero-title">
            Engineering<br />
            <span className="hero-accent">certainty.</span><br />
            Building the future.
          </h1>
          <p className="hero-body">
            From the first drawing to the final handover, SR Construction brings engineering,
            site execution and accountable project delivery into one clear process.
          </p>
          <div className="hero-actions">
            <Link to="/consultation" className="btn btn-primary btn-lg">
              Book a Consultation <ArrowUpRight size={18} />
            </Link>
            <Link to="/projects" className="btn btn-outline btn-lg">
              View Our Work <ArrowRight size={18} />
            </Link>
          </div>

          <div className="hero-stats">
            {[
              { icon: HardHat, value: page.statsProjects || "50+", label: "Projects Delivered" },
              { icon: Clock, value: page.statsYears || "12+", label: "Years Building" },
              { icon: Ruler, value: page.statsStates || "6", label: "States Covered" },
              { icon: Award, value: page.statsTeam || "80+", label: "Field Staff" },
            ].map((s) => (
              <div key={s.label} className="hero-stat-card">
                <s.icon size={22} style={{ color: "var(--accent)", marginBottom: 10 }} />
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MARQUEE STRIP ===== */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {["STRUCTURAL ENGINEERING", "DESIGN & BUILD", "CONCRETE & SUPERSTRUCTURE", "STEEL FABRICATION", "FOUNDATIONS", "DRAINAGE & PAVING", "PROJECT MANAGEMENT", "QUALITY CONTROL", "STRUCTURAL ENGINEERING", "DESIGN & BUILD", "CONCRETE & SUPERSTRUCTURE", "STEEL FABRICATION"].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      {/* ===== PRINCIPLES (CREAM) ===== */}
      <section className="section-cream section-pad">
        <div className="container">
          <div className="section-header">
            <span className="caption">The SR Standard</span>
            <h2 className="display-md">Built on four principles</h2>
          </div>
          <div className="grid-4">
            {[
              { icon: ShieldCheck, title: "Structural Integrity", body: "Every joint, pour and connection is executed to engineering specification with clear inspection records." },
              { icon: Target, title: "Delivery Discipline", body: "Milestones, materials and communication are tracked so projects stay coordinated and avoid surprises." },
              { icon: Gem, title: "Material Quality", body: "We source and verify concrete grades, reinforcement standards and finishing materials before they reach the site." },
              { icon: TrendingUp, title: "Clear Communication", body: "Progress, decisions and changes are reported so clients understand what is happening and what comes next." },
            ].map((p) => (
              <div key={p.title} className="principle-card">
                <p.icon size={28} style={{ color: "var(--accent)" }} />
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES PREVIEW (DARK) ===== */}
      <section className="section-dark section-pad">
        <div className="container">
          <div className="section-header-row">
            <div>
              <span className="caption">What We Do</span>
              <h2 className="display-md">Built properly from the ground up.</h2>
            </div>
            <Link to="/services" className="btn btn-outline">All Services <ArrowUpRight size={16} /></Link>
          </div>
          <div className="grid-2">
            {displayServices.map((s) => (
              <Link key={s.id} to={`/services/${s.slug}`} className="service-reveal">
                <div className="service-img-wrap">
                  <img src={s.image || "/assets/hero-structure.jpg"} alt={s.name} onError={imgFallback} />
                </div>
                <div className="service-body">
                  <span className="service-category">{s.category}</span>
                  <h3>{s.name}</h3>
                  <p>{s.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROJECTS (DARK) ===== */}
      <section className="section-dark section-pad" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header-row">
            <div>
              <span className="caption">Selected Work</span>
              <h2 className="display-md">Proof, built in full view.</h2>
            </div>
            <Link to="/projects" className="btn btn-outline">All Projects <ArrowUpRight size={16} /></Link>
          </div>
          <div className="project-grid">
            {displayProjects.map((p, i) => (
              <Link
                key={p.id}
                to={`/projects/${p.slug}`}
                className={`project-item ${i === 0 ? "project-featured" : ""}`}
              >
                <img src={p.image || "/assets/hero-structure.jpg"} alt={p.title} onError={imgFallback} />
                <div className="project-info">
                  <span className="project-meta">{p.category} · {p.location}</span>
                  <h3>{p.title}</h3>
                  {p.status === "ongoing" && <span className="project-badge">Ongoing</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOUNDER TEASER (CREAM) ===== */}
      <section className="section-cream section-pad">
        <div className="container">
          <div className="founder-teaser">
            <div className="founder-img">
              <img src="/assets/founder.jpg" alt="Emmanuel Andrew Nwosu" onError={imgFallback} />
              <div className="founder-badge">
                <span className="caption">Founder</span>
                <strong>Emmanuel Andrew Nwosu</strong>
                <span>Managing Director</span>
              </div>
            </div>
            <div className="founder-text">
              <span className="caption">Leadership</span>
              <h2 className="display-md">Engineering, discipline and clear communication.</h2>
              <p className="body-lg">
                Emmanuel Andrew Nwosu leads SR Construction with a clear conviction: clients should not have to choose between ambitious design and disciplined execution. His approach puts sound engineering, visible accountability and practical communication at the centre of every project.
              </p>
              <Link to="/founder" className="btn btn-outline-dark">
                Meet the Founder <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== METRICS STRIP ===== */}
      <section className="section-metrics">
        <div className="container">
          <div className="metrics-row">
            {[
              { value: page.statsProjects || "50+", label: "Projects Delivered" },
              { value: page.statsYears || "12+", label: "Years Building" },
              { value: page.statsStates || "6", label: "States Covered" },
              { value: page.statsTeam || "80+", label: "Field Staff" },
            ].map((s) => (
              <div key={s.label} className="metric-item">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}
