import { useState } from "react";
import { Link } from "react-router";
import { usePage } from "@/lib/site";
import { trpc } from "@/providers/trpc";
import { ConsultationCTA } from "@/components/SiteLayout";

function imgFallback(e: React.SyntheticEvent<HTMLImageElement>) {
  (e.target as HTMLImageElement).src = "/assets/hero-structure.jpg";
}

export default function Projects() {
  const { page } = usePage("projects");
  const projects = trpc.public.projects.useQuery();

  const fallbackProjects = [
    { id: 1, slug: "twin-residential-apartments-port-harcourt", title: "Twin 2-Storey Residential Apartments", category: "Residential", location: "Sars Road, Port Harcourt", image: "/assets/project-apartments-wide.webp", status: "completed", gallery: [] },
    { id: 2, slug: "executive-luxury-duplex", title: "Executive 6-Bedroom Luxury Duplex", category: "Residential", location: "Port Harcourt & Delta State", image: "/assets/project-duplex-complete.webp", status: "completed", gallery: [] },
    { id: 3, slug: "hospitality-complex-asaba", title: "Hospitality & Recreational Development", category: "Hospitality & Recreation", location: "Asaba, Delta State", image: "/assets/project-asaba.webp", status: "completed", gallery: [] },
  ];
  const displayProjects = projects.data?.length ? projects.data : fallbackProjects;

  const [filter, setFilter] = useState("All");
  const categories = ["All", ...new Set(displayProjects.map((p) => p.category))];
  const filtered = filter === "All" ? displayProjects : displayProjects.filter((p) => p.category === filter);

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero-fullbleed" style={{ minHeight: "70vh", justifyContent: "center" }}>
        <div className="hero-bg loaded" style={{ backgroundImage: `url(${page.heroImage || "/assets/hero-structure.jpg"})` }} />
        <div className="hero-overlay" />
        <div className="hero-content" style={{ textAlign: "center", paddingTop: "160px" }}>
          <span className="hero-kicker">{page.kicker || "Our Portfolio"}</span>
          <h1 className="hero-title" style={{ maxWidth: 900, margin: "0 auto 24px" }}>
            Work that<br />
            <span className="hero-accent">speaks</span> for itself.
          </h1>
          <p className="hero-body" style={{ maxWidth: 560, margin: "0 auto" }}>
            {page.body || "Every project is a partnership. Browse our completed and ongoing builds across Nigeria."}
          </p>
        </div>
      </section>

      {/* ===== FILTERS + GRID ===== */}
      <section className="section-dark section-pad">
        <div className="container">
          <div className="section-header-row">
            <div>
              <span className="caption">Browse by Category</span>
              <h2 className="display-md">{displayProjects.length} Projects Delivered</h2>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 48 }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className="btn"
                style={{
                  background: filter === cat ? "var(--accent)" : "transparent",
                  color: filter === cat ? "white" : "var(--text-dim)",
                  border: "1px solid",
                  borderColor: filter === cat ? "var(--accent)" : "var(--line-dark)",
                  padding: "10px 20px",
                  fontSize: 11,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="project-grid">
            {filtered.map((p, i) => (
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

      <ConsultationCTA />
    </>
  );
}
