import { usePage } from "@/lib/site";
import { MapPin } from "lucide-react";
import { ConsultationCTA } from "@/components/SiteLayout";

function imgFallback(e: React.SyntheticEvent<HTMLImageElement>) {
  (e.target as HTMLImageElement).src = "/assets/hero-structure.jpg";
}

export default function About() {
  const { page } = usePage("about");

  const values = [
    { title: "Integrity", body: "We say what we mean and deliver what we promise. No hidden costs, no compromised materials." },
    { title: "Discipline", body: "Timelines are commitments, not suggestions. Every phase is planned, tracked and executed with precision." },
    { title: "Ingenuity", body: "We solve problems before they become delays. Smart planning prevents expensive corrections." },
    { title: "Care", body: "We treat every property as if it were our own. Every detail matters." },
  ];

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero-fullbleed" style={{ minHeight: "70vh", justifyContent: "center" }}>
        <div className="hero-bg loaded" style={{ backgroundImage: `url(${page.heroImage || "/assets/hero-building.jpg"})` }} />
        <div className="hero-overlay" />
        <div className="hero-content" style={{ textAlign: "center", paddingTop: "160px" }}>
          <span className="hero-kicker">{page.kicker || "About SR Construction"}</span>
          <h1 className="hero-title" style={{ maxWidth: 900, margin: "0 auto 24px" }}>
            One team.<br />
            <span className="hero-accent">One accountable</span> standard.
          </h1>
          <p className="hero-body" style={{ maxWidth: 600, margin: "0 auto" }}>
            {page.body || "SR Construction is a Nigerian construction and engineering company operating from Port Harcourt and delivering projects across Nigeria."}
          </p>
        </div>
      </section>

      {/* ===== QUOTE ===== */}
      <section className="section-dark section-pad-sm" style={{ textAlign: "center" }}>
        <div className="container-narrow">
          <blockquote className="display-md" style={{ fontStyle: "italic" }}>
            "{page.quote || "We don't subcontract accountability. When SR Construction signs a contract, the delivery promise is ours."}"
          </blockquote>
          <div style={{ width: 60, height: 2, background: "var(--accent)", margin: "32px auto 0" }} />
        </div>
      </section>

      {/* ===== STORY (CREAM) ===== */}
      <section className="section-cream section-pad">
        <div className="container">
          <div className="grid-split">
            <div>
              <img
                src={page.image || "/assets/project-apartments-wide.webp"}
                alt="SR Construction site work"
                style={{ width: "100%", borderRadius: "var(--radius-xl)", aspectRatio: "4/5", objectFit: "cover" }}
                onError={imgFallback}
              />
            </div>
            <div>
              <span className="caption">Our Approach</span>
              <h2 className="display-md" style={{ margin: "16px 0 20px", color: "var(--ink)" }}>
                {page.storyTitle || "Built around the work, not the noise."}
              </h2>
              <p className="body-lg" style={{ marginBottom: 20, color: "var(--stone)" }}>
                {page.storyBody || "We keep the brief, the technical decisions, the materials and the site work connected. Clients know what has been done, what comes next and who is responsible."}
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--stone)" }}>
                From the first site assessment to the final handover, every decision is documented, every milestone is tracked and every client is kept informed. That is the SR Construction difference — not just building structures, but building trust through transparency and technical excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="section-dark section-pad">
        <div className="container">
          <div className="section-header">
            <span className="caption">{page.valuesKicker || "Guiding Principles"}</span>
            <h2 className="display-md">{page.valuesTitle || "Values that shape every decision"}</h2>
          </div>
          <div className="grid-4">
            {values.map((v) => (
              <div
                key={v.title}
                style={{
                  padding: "36px",
                  background: "var(--void-soft)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--line-dark)",
                }}
              >
                <h3 className="heading-md" style={{ marginBottom: 14 }}>{v.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-dim)" }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LOCATION (CREAM) ===== */}
      <section className="section-cream section-pad">
        <div className="container">
          <div className="section-header">
            <span className="caption">Our Reach</span>
            <h2 className="display-md" style={{ color: "var(--ink)" }}>
              {page.locationTitle || "Operations Across Nigeria"}
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            {(page.locations || "Port Harcourt · Lagos · Abuja · Asaba · Owerri · Uyo").split(" · ").map((loc) => (
              <span
                key={loc}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "12px 20px", background: "var(--warm-white)",
                  borderRadius: "var(--radius-md)", border: "1px solid var(--line)",
                  fontSize: 14, color: "var(--ink)", fontWeight: 500,
                }}
              >
                <MapPin size={15} style={{ color: "var(--accent)" }} /> {loc}
              </span>
            ))}
          </div>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}
