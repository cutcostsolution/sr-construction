import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { ConsultationCTA } from "@/components/SiteLayout";

export default function ServiceDetail() {
  const { slug = "" } = useParams();
  const query = trpc.public.service.useQuery({ slug });

  if (query.isLoading) {
    return (
      <section className="section-dark" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="page-loading">Loading service...</div>
      </section>
    );
  }

  if (!query.data) {
    return (
      <section className="section-dark" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 5vw" }}>
        <div style={{ textAlign: "center" }}>
          <h1 className="display-md" style={{ marginBottom: 16 }}>Service not found</h1>
          <Link to="/services" className="btn btn-outline">
            <ArrowLeft size={16} /> Back to services
          </Link>
        </div>
      </section>
    );
  }

  const { service, projects } = query.data;

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
            backgroundImage: `url(${service.image || "/assets/service-foundation.jpg"})`,
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
          <Link to="/services" style={{ fontSize: 12, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
            <ArrowLeft size={14} /> All Services
          </Link>
          <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
            {service.category}
          </span>
          <h1 className="display-lg" style={{ maxWidth: 800, marginBottom: 24 }}>
            {service.name}
          </h1>
          <p className="body-lg" style={{ maxWidth: 600, fontSize: 18 }}>
            {service.summary}
          </p>
          <Link to="/consultation" className="btn btn-primary" style={{ marginTop: 32 }}>
            Discuss This Service <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      {/* Description */}
      <section className="section-dark section-pad">
        <div className="container">
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
              The Service
            </span>
            <h2 className="heading-lg" style={{ marginBottom: 24 }}>Technical work, clearly coordinated.</h2>
            <p className="body-lg" style={{ fontSize: 18, lineHeight: 1.8, marginBottom: 40 }}>
              {service.description}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {service.capabilities.map((c) => (
                <div key={c} style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, background: "var(--void-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--line-dark)" }}>
                  <Check size={18} style={{ color: "var(--accent)", flexShrink: 0 }} />
                  <span style={{ fontSize: 15, color: "var(--text-dim)" }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {projects.length > 0 && (
        <section className="section-void-soft section-pad">
          <div className="container">
            <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
              Related Case Studies
            </span>
            <h2 className="display-md" style={{ marginBottom: 40 }}>See the capability in practice.</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {projects.map((p) => (
                <Link
                  key={p.id}
                  to={`/projects/${p.slug}`}
                  style={{
                    display: "block",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    border: "1px solid var(--line-dark)",
                    transition: "all 0.4s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--line-accent)";
                    e.currentTarget.style.transform = "translateY(-6px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--line-dark)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ overflow: "hidden", height: 240 }}>
                    <img
                      src={p.coverImage || "/assets/project-duplex.webp"}
                      alt={p.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ padding: 24 }}>
                    <h3 className="heading-md" style={{ fontSize: 18, marginBottom: 8 }}>{p.title}</h3>
                    <span style={{ fontSize: 12, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{p.location}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ConsultationCTA
        title={`Planning ${service.name.toLowerCase()}?`}
        body="Share your site and project goals with us. We will help you establish the right scope and next step."
      />
    </>
  );
}
