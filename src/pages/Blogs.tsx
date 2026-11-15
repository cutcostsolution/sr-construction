import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Calendar } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { trpc } from "@/providers/trpc";
import { usePage } from "@/lib/site";
import { ConsultationCTA } from "@/components/SiteLayout";

gsap.registerPlugin(ScrollTrigger);

export default function Blogs() {
  const { page } = usePage("blogs");
  const posts = trpc.public.blogs.useQuery();
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".blogs-hero-text", { y: 50, opacity: 0, duration: 1, ease: "power3.out", delay: 0.2 });
      gsap.from(".blog-card", {
        y: 50, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: gridRef.current, start: "top 80%" },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ===== HERO: MINIMAL ===== */}
      <section ref={heroRef} className="section-dark hero-pad-sm" style={{ padding: "160px 5vw 60px" }}>
        <div className="container blogs-hero-text" style={{ textAlign: "center", maxWidth: 800 }}>
          <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
            {page.kicker || "Insights & Guides"}
          </span>
          <h1 className="display-lg" style={{ marginBottom: 20 }}>
            {page.title || "Knowledge That Builds"}
          </h1>
          <p className="body-lg" style={{ fontSize: 18 }}>
            {page.body || "Practical insights for property owners, investors and construction professionals across Nigeria."}
          </p>
        </div>
      </section>

      {/* ===== BLOG GRID: EDITORIAL ===== */}
      <section ref={gridRef} className="section-dark section-pad" style={{ paddingTop: 40 }}>
        <div className="container">
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {(posts.data ?? []).map((post, i) => (
              <Link
                key={post.id}
                to={`/blogs/${post.slug}`}
                style={{
                  display: "block",
                  background: "var(--void-soft)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  border: "1px solid var(--line-dark)",
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                className="blog-card"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--line-accent)";
                  e.currentTarget.style.transform = "translateY(-8px)";
                  const img = e.currentTarget.querySelector("img") as HTMLElement;
                  if (img) img.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--line-dark)";
                  e.currentTarget.style.transform = "translateY(0)";
                  const img = e.currentTarget.querySelector("img") as HTMLElement;
                  if (img) img.style.transform = "scale(1)";
                }}
              >
                <div style={{ overflow: "hidden", height: 220 }}>
                  <img
                    src={post.coverImage || "/assets/blog-default.jpg"}
                    alt={post.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                </div>
                <div style={{ padding: 28 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <Calendar size={12} style={{ color: "var(--text-faint)" }} />
                    <span style={{ fontSize: 12, color: "var(--text-faint)" }}>
                      {new Date(post.publishedAt).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                  </div>
                  <h3 className="heading-md" style={{ fontSize: 18, marginBottom: 12, lineHeight: 1.3 }}>
                    {post.title}
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-dim)", marginBottom: 16 }}>
                    {post.summary}
                  </p>
                  <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 6 }}>
                    Read More <ArrowUpRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {posts.data?.length === 0 && (
            <div style={{ textAlign: "center", padding: 80, color: "var(--text-faint)" }}>
              <p>No articles published yet. Check back soon.</p>
            </div>
          )}
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}
