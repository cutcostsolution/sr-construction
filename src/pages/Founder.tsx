import { Link } from "react-router";
import { ArrowUpRight, Globe, Linkedin, Award, Target, Shield, Users, BookOpen, Lightbulb, Quote } from "lucide-react";
import { usePage } from "@/lib/site";
import { ConsultationCTA } from "@/components/SiteLayout";

export default function Founder() {
  const { page } = usePage("founder");
  return <>
    {/* ===== FOUNDER HERO — ASYMMETRIC ===== */}
    <section className="founder-hero">
      <div className="founder-hero-inner">
        <img src={page.photo} alt={page.title} />
        <div>
          <span className="eyebrow">The Founder</span>
          <h1>{page.title}</h1>
          <span className="role">Founder & Managing Director</span>
          <p>{page.body}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
            <Link to="/consultation" className="button">Book a Consultation <ArrowUpRight /></Link>
            {page.linkedin && <a href={page.linkedin} target="_blank" rel="noopener noreferrer" className="button button-outline"><Linkedin size={16} /> LinkedIn</a>}
          </div>
        </div>
      </div>
    </section>

    {/* ===== QUOTE ===== */}
    <section style={{ maxWidth: 800, margin: "60px auto", padding: "0 5vw", textAlign: "center" }}>
      <Quote size={32} color="var(--burgundy)" style={{ marginBottom: 20, opacity: .5 }} />
      <p style={{ fontFamily: "Cinzel,serif", fontSize: 22, lineHeight: 1.6, color: "var(--ink)", fontStyle: "italic" }}>{page.quote}</p>
      <span style={{ display: "block", marginTop: 20, fontSize: 12, textTransform: "uppercase", letterSpacing: ".12em", color: "var(--muted)" }}>— {page.title}</span>
    </section>

    {/* ===== STORY ===== */}
    <section className="founder-body">
      <span className="eyebrow">Background</span>
      <h3>Built from observation.</h3>
      <p>Emmanuel Andrew Nwosu built SR Construction from a single conviction: that Nigerian clients deserve construction partners who treat clarity, quality and accountability as non-negotiable standards, not marketing language.</p>
      <p>Before founding the company, he spent years observing how miscommunication between design teams, site crews and clients turned ambitious projects into costly, frustrating experiences. That observation shaped the operating model he runs today — one where every stage of a build is documented, every decision has a named owner, and the client never has to guess what is happening on site.</p>

      <h3>Leadership Philosophy</h3>
      <p>His leadership rests on three practical rules. First, <strong>listen to the ground before drawing a line</strong> — site conditions, soil behaviour and local material availability should shape the engineering, not the other way around. Second, <strong>build the process before building the structure</strong> — clear scope, defined approvals and visible reporting protect both speed and quality. Third, <strong>own the outcome</strong> — when something goes wrong, the response should be faster than the excuse.</p>

      <h3>Technical Standards</h3>
      <p>Under his direction, SR Construction maintains strict internal standards for reinforcement placement, concrete mixing ratios, steel fabrication tolerances and waterproofing protocols. These are not decorative policies — they are enforced through site inspections, photographic documentation and milestone sign-offs that the client can review.</p>
    </section>

    {/* ===== VALUES ===== */}
    <section style={{ background: "var(--warm-white)", padding: "80px 5vw", borderRadius: "var(--radius-xl)", margin: "0 4vw 60px", boxShadow: "0 4px 30px var(--shadow)" }}>
      <div style={{ textAlign: "center", marginBottom: 50 }}>
        <span className="eyebrow">Core Principles</span>
        <h2>The six standards that guide every decision.</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, maxWidth: 1200, margin: "0 auto" }}>
        {[
          { icon: Target, title: "Precision First", body: "Every measurement, every mix ratio, every connection detail is verified before it becomes permanent." },
          { icon: Shield, title: "Accountable Delivery", body: "Clear ownership at each stage means no stage is left to chance or passed silently between teams." },
          { icon: Users, title: "Client Partnership", body: "The client is not an observer — they are a participant with full visibility into progress, decisions and costs." },
          { icon: Lightbulb, title: "Practical Innovation", body: "New methods and materials are welcome, but only after they prove themselves reliable on Nigerian sites." },
          { icon: Award, title: "Finish with Integrity", body: "The final structure must reflect the same care that went into its foundation — nothing hidden, nothing rushed." },
          { icon: BookOpen, title: "Documented Learning", body: "Every project teaches something. We record it, share it and apply it to the next build." },
        ].map(({ icon: Icon, title, body }) => (
          <article key={title} style={{ padding: "30px 24px", borderRadius: "var(--radius-lg)", background: "var(--cream)", transition: "all .3s ease" }}>
            <Icon size={24} color="var(--burgundy)" style={{ marginBottom: 16 }} />
            <h3 style={{ fontSize: 18, marginBottom: 10 }}>{title}</h3>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>{body}</p>
          </article>
        ))}
      </div>
    </section>

    {/* ===== COMMITMENT ===== */}
    <section style={{ background: "linear-gradient(135deg, var(--burgundy-deep) 0%, var(--burgundy) 100%)", color: "var(--warm-white)", padding: "80px 5vw", textAlign: "center", borderRadius: "var(--radius-xl)", margin: "0 4vw 60px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, background: "rgba(196,163,90,0.06)", borderRadius: "50%", filter: "blur(60px)" }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
        <span className="eyebrow light">Client Commitment</span>
        <h2 style={{ color: "var(--warm-white)", margin: "20px 0 20px" }}>Whether you are building from abroad, managing your first project or developing a portfolio of properties, the standard is the same.</h2>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, lineHeight: 1.8, marginBottom: 30 }}>You should understand enough about your own project to ask the right questions and hold the team accountable. That transparency is what turns a construction contract into a genuine partnership.</p>
        <Link to="/consultation" className="button button-gold">Discuss Your Project <ArrowUpRight /></Link>
      </div>
    </section>

    <ConsultationCTA title="Bring your vision to the table." body="Start with a direct project consultation and give your next decision the clarity it deserves." />
  </>;
}
