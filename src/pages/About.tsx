import { Link } from "react-router";
import { ArrowUpRight, Phone, Mail, MapPin } from "lucide-react";
import { usePage } from "@/lib/site";
import { ConsultationCTA } from "@/components/SiteLayout";

export default function About() {
  const { page, settings } = usePage("about");
  return <>
    {/* ===== ABOUT HERO — FULL IMAGE WITH BURGUNDY OVERLAY ===== */}
    <section className="about-hero">
      <img src={page.heroImage} alt="SR Construction team at work" />
      <div className="about-hero-inner">
        <span className="eyebrow light">Who We Are</span>
        <h1>{page.title}</h1>
        <p>{page.body}</p>
      </div>
    </section>

    {/* ===== STORY ===== */}
    <section className="about-story">
      <span className="eyebrow">Our Story</span>
      <h2>{page.storyTitle}</h2>
      <p>{page.storyBody}</p>
      <p style={{ marginTop: 20 }}>Our work spans private homes, multi-unit residential developments, commercial spaces, hospitality projects and specialist infrastructure. The common thread is a disciplined process and a team that stays accountable to the agreed outcome.</p>
    </section>

    {/* ===== VALUES ===== */}
    <section className="about-values">
      <div style={{ textAlign: "center", marginBottom: 50 }}>
        <span className="eyebrow">How We Work</span>
        <h2>Confidence comes from how the work is handled.</h2>
      </div>
      <div className="about-values-grid">
        {[
          ["01", "Scope before execution", "The brief, drawings, quantities and constraints are understood before work is allowed to drift."],
          ["02", "Close site supervision", "Progress is checked against the agreed work, not simply reported as activity."],
          ["03", "Technical coordination", "Design, engineering, materials, labour and specialist work move together."],
          ["04", "Documented decisions", "You have a clearer record of what changed, what was approved and what comes next."],
        ].map(([n, t, b]) => (
          <article key={n}>
            <span>{n}</span>
            <h3>{t}</h3>
            <p>{b}</p>
          </article>
        ))}
      </div>
    </section>

    {/* ===== LOCATION BAND ===== */}
    <section style={{ background: "var(--burgundy)", color: "var(--warm-white)", padding: "80px 5vw", textAlign: "center", margin: "0 4vw 60px", borderRadius: "var(--radius-xl)" }}>
      <span className="eyebrow light">Where to Find Us</span>
      <h2 style={{ color: "var(--warm-white)", margin: "20px 0 30px" }}>Based in Port Harcourt.<br />Ready to build across Nigeria.</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
        <p style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}><MapPin size={18} color="var(--gold)" /> {settings["brand.address"]}</p>
        <p style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}><Mail size={18} color="var(--gold)" /> {settings["brand.email"]}</p>
        <p style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}><Phone size={18} color="var(--gold)" /> {settings["brand.phone"]}</p>
      </div>
      <Link to="/consultation" className="button button-gold" style={{ marginTop: 30 }}>Book Your Consultation <ArrowUpRight /></Link>
    </section>

    <ConsultationCTA />
  </>;
}
