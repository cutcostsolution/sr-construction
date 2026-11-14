import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { usePage } from "@/lib/site";
import { ConsultationCTA } from "@/components/SiteLayout";
import { Empty } from "@/components/SiteUI";

export default function Services() {
  const { page } = usePage("services");
  const query = trpc.public.services.useQuery();
  return <>
    {/* ===== SERVICES HERO — GRADIENT, NO IMAGE ===== */}
    <section className="services-hero">
      <div className="services-hero-inner">
        <span className="eyebrow light">Capabilities</span>
        <h1>{page.title}</h1>
        <p>{page.body}</p>
        <Link to="/consultation" className="button button-gold" style={{ marginTop: 20 }}>Book Your Consultation <ArrowUpRight /></Link>
      </div>
    </section>

    {/* ===== SERVICE CARDS ===== */}
    <section style={{ padding: "80px 5vw", maxWidth: 1300, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 50 }}>
        <span className="eyebrow">What We Offer</span>
        <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.8, maxWidth: 600, margin: "16px auto 0" }}>Every service begins with the site, the intended outcome and a clear definition of responsibility.</p>
      </div>
      <div className="service-grid">
        {(query.data ?? []).map((s, i) => (
          <Link key={s.id} to={`/services/${s.slug}`} className="service-card">
            <img src={s.image} alt={s.name} />
            <div className="service-copy">
              <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--muted)" }}>{s.category}</span>
              <h3>{s.name}</h3>
              <p>{s.summary}</p>
              <span style={{ color: "var(--burgundy)", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: ".06em", display: "flex", alignItems: "center", gap: 6, marginTop: 16 }}>Explore Service <ArrowUpRight size={16} /></span>
            </div>
          </Link>
        ))}
      </div>
      {!query.isLoading && query.data?.length === 0 && <Empty title="Services are being updated" body="Please contact us directly while our service catalogue is being refreshed." />}
    </section>

    {/* ===== PROCESS ===== */}
    <section style={{ background: "var(--warm-white)", padding: "80px 5vw", borderRadius: "var(--radius-xl)", margin: "0 4vw 60px", boxShadow: "0 4px 30px var(--shadow)" }}>
      <div style={{ textAlign: "center", marginBottom: 50 }}>
        <span className="eyebrow">Our Process</span>
        <h2>Before a single block is laid.</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 30, maxWidth: 1200, margin: "0 auto" }}>
        {[
          ["01", "Scope Review", "We establish what you want to build and what information already exists."],
          ["02", "Technical Path", "We identify the design, engineering and site decisions required."],
          ["03", "Delivery Plan", "We define responsibilities, sequencing, procurement and reporting."],
          ["04", "Site Execution", "We coordinate and supervise the work through completion."],
        ].map(([n, t, b]) => (
          <article key={n} style={{ textAlign: "center", padding: "30px 20px" }}>
            <span style={{ fontFamily: "Cinzel,serif", fontSize: 36, color: "var(--burgundy)", fontWeight: 700, display: "block", marginBottom: 16 }}>{n}</span>
            <h3 style={{ fontSize: 20, marginBottom: 10 }}>{t}</h3>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>{b}</p>
          </article>
        ))}
      </div>
    </section>

    <ConsultationCTA title="Not sure which service fits?" body="Tell us the project type, location and current stage. We will help you identify the right delivery path." />
  </>;
}
