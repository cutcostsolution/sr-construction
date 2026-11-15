import { usePage } from "@/lib/site";
import { ConsultationCTA } from "@/components/SiteLayout";

function imgFallback(e: React.SyntheticEvent<HTMLImageElement>) {
  (e.target as HTMLImageElement).src = "/assets/hero-structure.jpg";
}

export default function Founder() {
  const { page } = usePage("founder");

  const values = [
    { title: "Engineering", body: "Every structural decision is grounded in engineering principles. We do not improvise with safety." },
    { title: "Discipline", body: "Project timelines are sacred. Milestones are tracked daily and communicated honestly." },
    { title: "Communication", body: "Clients deserve to know what is happening, what has changed and what comes next." },
    { title: "Excellence", body: "Good enough is not good enough. Every detail is inspected before handover." },
  ];

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero-fullbleed" style={{ minHeight: "80vh", justifyContent: "center" }}>
        <div className="hero-bg loaded" style={{ backgroundImage: `url(${page.heroImage || "/assets/hero-duplex.jpg"})` }} />
        <div className="hero-overlay" />
        <div className="hero-content" style={{ paddingTop: "160px" }}>
          <span className="hero-kicker">{page.kicker || "Leadership"}</span>
          <h1 className="hero-title" style={{ maxWidth: 900 }}>
            Engineering,<br />
            <span className="hero-accent">discipline</span> and<br />
            clear communication.
          </h1>
          <p className="hero-body" style={{ maxWidth: 540 }}>
            {page.body || "Emmanuel Andrew Nwosu leads SR Construction with a simple conviction: clients should not have to choose between ambitious design and disciplined execution."}
          </p>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <section className="section-cream section-pad">
        <div className="container">
          <div className="grid-split">
            <div>
              <img
                src={page.image || "/assets/founder.jpg"}
                alt="Emmanuel Andrew Nwosu"
                style={{ width: "100%", borderRadius: "var(--radius-xl)", aspectRatio: "3/4", objectFit: "cover" }}
                onError={imgFallback}
              />
              <div style={{ marginTop: 20, padding: 24, background: "var(--warm-white)", borderRadius: "var(--radius-lg)", border: "1px solid var(--line)" }}>
                <strong style={{ fontSize: 18, display: "block", marginBottom: 6 }}>Emmanuel Andrew Nwosu</strong>
                <span style={{ fontSize: 14, color: "var(--stone)", display: "block" }}>Managing Director, SR Construction Ltd.</span>
                <span style={{ fontSize: 12, color: "var(--muted)", marginTop: 8, display: "block" }}>{page.credentials || "RC: 7682579"}</span>
              </div>
            </div>
            <div>
              <span className="caption">The Founder</span>
              <h2 className="display-md" style={{ margin: "16px 0 20px", color: "var(--ink)" }}>
                {page.storyTitle || "Building trust, one project at a time."}
              </h2>
              <p className="body-lg" style={{ marginBottom: 20, color: "var(--stone)" }}>
                {page.storyBody || "With over a decade in the Nigerian construction industry, Emmanuel Andrew Nwosu has built SR Construction from a single-site operation into a multi-project engineering firm delivering across six states."}
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--stone)", marginBottom: 20 }}>
                His philosophy is straightforward: every structure must be engineered correctly, every timeline must be honoured, and every client must understand what is happening on their site. This approach has earned SR Construction repeat business from residential developers, hospitality operators and institutional clients across the Niger Delta and beyond.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--stone)" }}>
                Under his leadership, the company has maintained a zero-compromise stance on material quality and structural safety. Every project is personally reviewed at key milestones to ensure the engineering specification is met and the client brief is honoured.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="section-dark section-pad">
        <div className="container">
          <div className="section-header">
            <span className="caption">{page.valuesKicker || "Leadership Values"}</span>
            <h2 className="display-md">{page.valuesTitle || "Four values that guide every decision."}</h2>
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

      <ConsultationCTA />
    </>
  );
}
