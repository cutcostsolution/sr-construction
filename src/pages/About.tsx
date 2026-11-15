import { useEffect, useRef } from "react";
import { usePage } from "@/lib/site";
import { MapPin } from "lucide-react";
import { ConsultationCTA } from "@/components/SiteLayout";

function imgFallback(e: React.SyntheticEvent<HTMLImageElement>) {
  (e.target as HTMLImageElement).src = "/assets/hero-structure.jpg";
}

export default function About() {
  const { page } = usePage("about");
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const handleScroll = () => {
      const y = window.scrollY;
      const bg = el.querySelector(".hero-bg") as HTMLElement;
      if (bg) bg.style.transform = `translateY(${y * 0.3}px) scale(1.05)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const values = [
    { icon: "shield", title: "Integrity", body: "We say what we mean and deliver what we promise. No hidden costs, no compromised materials." },
    { icon: "clock", title: "Discipline", body: "Timelines are commitments, not suggestions. Every phase is planned, tracked and executed with precision." },
    { icon: "lightbulb", title: "Ingenuity", body: "We solve problems before they become delays. Smart planning prevents expensive corrections." },
    { icon: "heart", title: "Care", body: "We treat every property as if it were our own. Every detail matters." },
  ];

  return (
    <>
      {/* ===== HERO ===== */}
      <section ref={heroRef} style={{ minHeight: "70vh", position: "relative", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div className="hero-bg" style={{ position: "absolute", inset: 0, backgroundImage: `url(${page.heroImage || "/assets/hero-building.jpg"})`, backgroundSize: "cover", backgroundPosition: "center", transform: "scale(1.05)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(10,10,15,0.85) 0%, rgba(10,10,15,0.5) 100%)" }} />
        <div className="container about-hero-text hero-pad" style={{ position: "relative", zIndex: 2, padding: "160px 5vw 100px" }}>
          <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 20 }}>
            {page.kicker || "About SR Construction"}
          </span>
          <h1 className="display-lg" style={{ maxWidth: 800, marginBottom: 20 }}>
            {page.title || "One team. One accountable standard."}
          </h1>
          <p className="body-lg" style={{ maxWidth: 640, fontSize: 18, color: "var(--text-dim)" }}>
            {page.body || "SR Construction is a Nigerian construction and engineering company operating from Port Harcourt and delivering projects across Nigeria."}
          </p>
        </div>
      </section>

      {/* ===== QUOTE ===== */}
      <section className="section-dark section-pad-sm" style={{ textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <blockquote className="display-md" style={{ fontFamily: "var(--font-display)", lineHeight: 1.3 }}>
            "{page.quote || "We don't subcontract accountability. When SR Construction signs a contract, the delivery promise is ours."}"
          </blockquote>
          <div style={{ width: 60, height: 2, background: "var(--accent)", margin: "28px auto 0" }} />
        </div>
      </section>

      {/* ===== STORY ===== */}
      <section className="section-cream section-pad" style={{ background: "var(--cream)" }}>
        <div className="container">
          <div className="grid-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 100, alignItems: "center" }}>
            <div>
              <img src={page.image || "/assets/project-apartments-wide.webp"} alt="SR Construction site work" style={{ width: "100%", borderRadius: "var(--radius-xl)", aspectRatio: "4/5", objectFit: "cover" }} onError={imgFallback} />
            </div>
            <div>
              <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>Our Approach</span>
              <h2 className="display-md" style={{ marginBottom: 20, color: "var(--ink)" }}>
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
          <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 60px" }}>
            <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
              {page.valuesKicker || "Guiding Principles"}
            </span>
            <h2 className="display-md">
              {page.valuesTitle || "What drives every decision"}
            </h2>
          </div>
          <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {values.map((v) => (
              <div
                key={v.title}
                style={{
                  padding: "clamp(28px, 3vw, 40px)",
                  background: "var(--void-soft)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--line-dark)",
                  textAlign: "left",
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" style={{ marginBottom: 20 }}>
                  {v.icon === "shield" && <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></>}
                  {v.icon === "clock" && <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>}
                  {v.icon === "lightbulb" && <><path d="M9 18h6" /><path d="M10 22h4" /><path d="M15.09 14c.18-.9.27-1.48.27-2.23A5.23 5.23 0 0 0 10 6.5a5.23 5.23 0 0 0-5.36 5.27c0 .75.09 1.33.27 2.23" /><path d="M9 14l.5-3h5l.5 3" /></>}
                  {v.icon === "heart" && <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></>}
                </svg>
                <h3 className="heading-md" style={{ fontSize: 20, marginBottom: 12 }}>{v.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-dim)" }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LOCATION ===== */}
      <section className="section-cream section-pad" style={{ background: "var(--cream)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 40px" }}>
            <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>Our Reach</span>
            <h2 className="display-md" style={{ color: "var(--ink)" }}>
              {page.locationTitle || "Operations Across Nigeria"}
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            {(page.locations || "Port Harcourt · Lagos · Abuja · Asaba · Owerri · Uyo").split(" · ").map((loc) => (
              <span key={loc} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", background: "var(--warm-white)", borderRadius: "var(--radius-md)", border: "1px solid var(--line)", fontSize: 13, color: "var(--ink)" }}>
                <MapPin size={14} style={{ color: "var(--accent)" }} /> {loc}
              </span>
            ))}
          </div>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}
