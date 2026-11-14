import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Images, SlidersHorizontal } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { usePage } from "@/lib/site";
import { ConsultationCTA } from "@/components/SiteLayout";
import { Empty } from "@/components/SiteUI";

export default function Projects() {
  const { page } = usePage("projects");
  const query = trpc.public.projects.useQuery();
  const [filter, setFilter] = useState("All");
  const categories = useMemo(() => ["All", ...new Set((query.data ?? []).map((p) => p.category))], [query.data]);
  const visible = (query.data ?? []).filter((p) => filter === "All" || p.category === filter);
  return <>
    {/* ===== PROJECTS HERO — SPLIT: TEXT + IMAGE ===== */}
    <section className="projects-hero">
      <div>
        <span className="eyebrow">Portfolio</span>
        <h1>{page.title}</h1>
        <p>{page.body}</p>
        <Link to="/consultation" className="button">Book Your Consultation <ArrowUpRight /></Link>
      </div>
      <img src={page.heroImage} alt="SR Construction project" />
    </section>

    {/* ===== FILTER + GRID ===== */}
    <section style={{ padding: "40px 5vw 80px", maxWidth: 1300, margin: "0 auto" }}>
      <div className="filter-bar">
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}><SlidersHorizontal size={16} /> Filter by sector</span>
        <div className="filter-pills">{categories.map((c) => <button className={filter === c ? "active" : ""} onClick={() => setFilter(c)} key={c}>{c}</button>)}</div>
        <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: "auto" }}>{visible.length} project{visible.length !== 1 ? "s" : ""} shown</span>
      </div>
      <div className="project-grid">
        {visible.map((p) => {
          const galleryCount = (p.gallery?.length || 0) + 1;
          return (
            <Link key={p.id} to={`/projects/${p.slug}`} className="project-card">
              <div style={{ position: "relative" }}>
                <img src={p.image} alt={p.title} />
                {galleryCount > 1 && <span style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.6)", color: "white", padding: "6px 12px", borderRadius: 100, fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}><Images size={13} /> {galleryCount} photos</span>}
              </div>
              <div className="project-copy">
                <div className="micro">{p.category} · {p.location}</div>
                <h3>{p.title}</h3>
                <span className="project-status">{p.status}</span>
              </div>
            </Link>
          );
        })}
      </div>
      {!query.isLoading && visible.length === 0 && <Empty title="No projects in this category yet" body="Choose another sector or contact us to discuss our current work." />}
    </section>

    <ConsultationCTA title="Your project could be next." body="Let's understand the site, the ambition and the standard you want to achieve." />
  </>;
}
