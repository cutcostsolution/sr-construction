import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowUpRight, MapPin, Calendar, Building } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { ConsultationCTA } from "@/components/SiteLayout";
import ImageSlideshow from "@/components/ImageSlideshow";

export default function ProjectDetail() {
  const { slug = "" } = useParams();
  const query = trpc.public.project.useQuery({ slug });

  if (query.isLoading) {
    return (
      <section className="section-dark" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="page-loading">Loading project...</div>
      </section>
    );
  }

  if (!query.data) {
    return (
      <section className="section-dark" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 5vw" }}>
        <div style={{ textAlign: "center" }}>
          <h1 className="display-md" style={{ marginBottom: 16 }}>Project not found</h1>
          <Link to="/projects" className="btn btn-outline">
            <ArrowLeft size={16} /> Back to projects
          </Link>
        </div>
      </section>
    );
  }

  const p = query.data;

  return (
    <>
      {/* Hero */}
      <section
        style={{
          minHeight: "70vh",
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
            backgroundImage: `url(${p.image || "/assets/project-duplex.webp"})`,
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
          <Link to="/projects" style={{ fontSize: 12, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
            <ArrowLeft size={14} /> All Projects
          </Link>
          <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
            {p.category}
          </span>
          <h1 className="display-lg" style={{ maxWidth: 800, marginBottom: 24 }}>
            {p.title}
          </h1>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={14} /> {p.location}
            </span>
            <span style={{ fontSize: 13, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 6 }}>
              <Building size={14} /> {p.status}
            </span>
            {p.stat && (
              <span style={{ fontSize: 13, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 6 }}>
                <Calendar size={14} /> {p.stat}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Narrative */}
      <section className="section-dark section-pad">
        <div className="container">
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
              The Case Study
            </span>
            <h2 className="heading-lg" style={{ marginBottom: 24 }}>About This Project</h2>
            <p className="body-lg" style={{ fontSize: 18, lineHeight: 1.8 }}>
              {p.description || p.summary}
            </p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section-void-soft section-pad" style={{ paddingTop: 0 }}>
        <div className="container">
          <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 24, textAlign: "center" }}>
            Project Gallery
          </span>
          <ImageSlideshow images={[p.image, ...(p.gallery || [])].filter(Boolean)} altPrefix={p.title} />
        </div>
      </section>

      {/* CTA */}
      <section className="section-dark section-pad-sm" style={{ borderTop: "1px solid var(--line-dark)", textAlign: "center" }}>
        <div className="container">
          <h2 className="display-md" style={{ marginBottom: 16 }}>
            Have a similar project in mind?
          </h2>
          <p className="body-lg" style={{ maxWidth: 500, margin: "0 auto 32px" }}>
            Let's discuss how we can bring your vision to life with the same precision and care.
          </p>
          <Link to="/consultation" className="btn btn-primary">
            Book Your Consultation <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      <ConsultationCTA title="Let's define your project properly." />
    </>
  );
}
