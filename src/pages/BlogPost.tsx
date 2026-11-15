import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowUpRight, Calendar, Clock } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { dateText } from "@/lib/site";
import { ConsultationCTA } from "@/components/SiteLayout";

export default function BlogPost() {
  const { slug = "" } = useParams();
  const query = trpc.public.post.useQuery({ slug });

  if (query.isLoading) {
    return (
      <section className="section-dark" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="page-loading">Loading article...</div>
      </section>
    );
  }

  if (!query.data) {
    return (
      <section className="section-dark" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 5vw" }}>
        <div style={{ textAlign: "center" }}>
          <h1 className="display-md" style={{ marginBottom: 16 }}>Article not found</h1>
          <Link to="/blogs" className="btn btn-outline">
            <ArrowLeft size={16} /> Back to insights
          </Link>
        </div>
      </section>
    );
  }

  const post = query.data;

  return (
    <>
      {/* Hero */}
      <section
        style={{
          minHeight: "60vh",
          position: "relative",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${post.image || "/assets/blog-default.jpg"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.5) 60%, rgba(10,10,15,0.3) 100%)",
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 2, padding: "160px 5vw 80px" }}>
          <Link to="/blogs" style={{ fontSize: 12, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
            <ArrowLeft size={14} /> All Insights
          </Link>
          <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
            {post.category}
          </span>
          <h1 className="display-lg" style={{ maxWidth: 900, marginBottom: 24 }}>
            {post.title}
          </h1>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 6 }}>
              <Calendar size={14} /> {dateText(post.publishedAt)}
            </span>
            <span style={{ fontSize: 13, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 6 }}>
              <Clock size={14} /> {post.readTime}
            </span>
          </div>
        </div>
      </section>

      {/* Body */}
      <article className="section-dark section-pad">
        <div className="container">
          <div style={{ maxWidth: 750, margin: "0 auto" }}>
            <p className="body-lg" style={{ fontSize: 20, lineHeight: 1.8, color: "var(--text-dim)", marginBottom: 40, fontStyle: "italic" }}>
              {post.excerpt}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {post.body.split("\n").filter(Boolean).map((paragraph, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: i % 2 === 1 && paragraph.length < 80 ? 22 : 17,
                    lineHeight: 1.8,
                    color: i % 2 === 1 && paragraph.length < 80 ? "var(--text)" : "var(--text-dim)",
                    fontFamily: i % 2 === 1 && paragraph.length < 80 ? "var(--font-display)" : "var(--font-body)",
                    fontWeight: i % 2 === 1 && paragraph.length < 80 ? 600 : 400,
                    margin: 0,
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <div style={{ marginTop: 60, paddingTop: 40, borderTop: "1px solid var(--line-dark)" }}>
              <Link to="/consultation" className="btn btn-primary">
                Discuss Your Project <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </article>

      <ConsultationCTA />
    </>
  );
}
