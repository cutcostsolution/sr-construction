import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Image } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { trpc } from "@/providers/trpc";
import { usePage } from "@/lib/site";
import { ConsultationCTA } from "@/components/SiteLayout";

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const { page } = usePage("projects");
  const projects = trpc.public.projects.useQuery();
  const [filter, setFilter] = useState("All");
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const categories = ["All", ...(projects.data ? [...new Set(projects.data.map((p) => p.category))] : [])];
  const filtered = filter === "All" ? (projects.data ?? []) : (projects.data ?? []).filter((p) => p.category === filter);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".projects-hero-text", { y: 60, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.2 });
      gsap.from(".project-item", {
        y: 60, opacity: 0, duration: 0.9, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: gridRef.current, start: "top 80%" },
      });
    });
    return () => ctx.revert();
  }, [filtered]);

  return (
    <>
      {/* ===== HERO: SPLIT WITH IMAGE ===== */}
      <section ref={heroRef} className="section-dark" style={{ padding: "160px 5vw 80px" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div className="projects-hero-text">
              <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 20 }}>
                {page.kicker || "Our Portfolio"}
              </span>
              <h1 className="display-lg" style={{ marginBottom: 24 }}>
                {page.title || "Work That Speaks"}
              </h1>
              <span className="accent-line" style={{ marginBottom: 28 }} />
              <p className="body-lg" style={{ maxWidth: 480, fontSize: 18 }}>
                {page.body || "Every project is a partnership. Browse our completed and ongoing builds across Nigeria."}
              </p>
            </div>
            <div style={{ position: "relative" }}>
              <img
                src="/assets/project-duplex-complete.webp"
                alt="Featured project"
                style={{
                  width: "100%",
                  height: 450,
                  objectFit: "cover",
                  borderRadius: "var(--radius-xl)",
                  border: "1px solid var(--line-dark)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: -20,
                  left: -20,
                  background: "var(--void-soft)",
                  border: "1px solid var(--line-dark)",
                  borderRadius: "var(--radius-lg)",
                  padding: "24px 28px",
                }}
              >
                <strong style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--text)", display: "block" }}>
                  {projects.data?.length || 0}
                </strong>
                <span style={{ fontSize: 12, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Projects
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FILTER BAR ===== */}
      <section className="section-dark section-pad-sm" style={{ paddingBottom: 40 }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-faint)", fontWeight: 500 }}>
              Filter:
            </span>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  style={{
                    background: filter === cat ? "var(--accent)" : "transparent",
                    color: filter === cat ? "var(--cream)" : "var(--text-dim)",
                    border: `1px solid ${filter === cat ? "var(--accent)" : "var(--line-dark)"}`,
                    padding: "10px 24px",
                    borderRadius: "var(--radius-full)",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROJECTS GRID: CINEMATIC ===== */}
      <section ref={gridRef} className="section-dark section-pad" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {filtered.map((p, i) => (
              <Link
                key={p.id}
                to={`/projects/${p.slug}`}
                className="project-item"
                style={{
                  display: "block",
                  gridColumn: i === 0 ? "span 2" : undefined,
                  gridRow: i === 0 ? "span 2" : undefined,
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  border: "1px solid var(--line-dark)",
                  position: "relative",
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  aspectRatio: i === 0 ? "16/10" : "4/5",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--line-accent)";
                  const overlay = e.currentTarget.querySelector(".project-overlay") as HTMLElement;
                  if (overlay) overlay.style.opacity = "1";
                  const img = e.currentTarget.querySelector("img") as HTMLElement;
                  if (img) img.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--line-dark)";
                  const overlay = e.currentTarget.querySelector(".project-overlay") as HTMLElement;
                  if (overlay) overlay.style.opacity = "0";
                  const img = e.currentTarget.querySelector("img") as HTMLElement;
                  if (img) img.style.transform = "scale(1)";
                }}
              >
                <img
                  src={p.coverImage || "/assets/project-duplex.webp"}
                  alt={p.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
                <div
                  className="project-overlay"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.3) 50%, transparent 100%)",
                    opacity: i === 0 ? 1 : 0,
                    transition: "opacity 0.5s ease",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: 32,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span
                      style={{
                        fontSize: 10,
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        color: "var(--accent)",
                        fontWeight: 600,
                      }}
                    >
                      {p.category}
                    </span>
                    {p.galleryCount > 0 && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-faint)" }}>
                        <Image size={12} /> {p.galleryCount}
                      </span>
                    )}
                  </div>
                  <h3 className="heading-md" style={{ fontSize: i === 0 ? 28 : 20, marginBottom: 8 }}>
                    {p.title}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span
                      style={{
                        fontSize: 10,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--text-faint)",
                      }}
                    >
                      {p.location}
                    </span>
                    <span style={{ width: 3, height: 3, background: "var(--text-faint)", borderRadius: "50%" }} />
                    <span
                      style={{
                        fontSize: 10,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: p.status === "Completed" ? "var(--gold)" : "var(--accent)",
                      }}
                    >
                      {p.status}
                    </span>
                  </div>
                  <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-faint)" }}>
                    View Project <ArrowUpRight size={14} />
                  </div>
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
