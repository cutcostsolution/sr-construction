import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Quote } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePage } from "@/lib/site";
import { ConsultationCTA } from "@/components/SiteLayout";

gsap.registerPlugin(ScrollTrigger);

export default function Founder() {
  const { page } = usePage("founder");
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".founder-hero-text", { y: 60, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.2 });
      gsap.from(".founder-hero-img", { x: 60, opacity: 0, duration: 1, ease: "power3.out", delay: 0.4 });
      gsap.from(".founder-story-block", {
        y: 40, opacity: 0, duration: 0.9, stagger: 0.2, ease: "power3.out",
        scrollTrigger: { trigger: storyRef.current, start: "top 80%" },
      });
      gsap.from(".founder-value", {
        y: 30, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: valuesRef.current, start: "top 80%" },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ===== HERO: ASYMMETRIC PORTRAIT + TEXT ===== */}
      <section ref={heroRef} className="section-dark hero-pad" style={{ padding: "160px 5vw 100px" }}>
        <div className="container">
          <div className="grid-asym" style={{ display: "grid", gridTemplateColumns: "0.38fr 1fr", gap: 80, alignItems: "center" }}>
            <div className="founder-hero-img" style={{ position: "relative" }}>
              <img
                src="/assets/founder.jpg"
                alt="SR Construction Founder"
                style={{
                  width: "100%",
                  borderRadius: "var(--radius-xl)",
                  aspectRatio: "3/4",
                  objectFit: "cover",
                  border: "1px solid var(--line-dark)",
                }}
              />
              <div
                className="float-badge"
                style={{
                  position: "absolute",
                  bottom: -16,
                  right: -16,
                  background: "var(--void-soft)",
                  border: "1px solid var(--line-dark)",
                  borderRadius: "var(--radius-lg)",
                  padding: "20px 24px",
                }}
              >
                <span style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 4 }}>
                  Since
                </span>
                <strong style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--text)" }}>2012</strong>
              </div>
            </div>
            <div className="founder-hero-text">
              <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 20 }}>
                {page.kicker || "The Founder"}
              </span>
              <h1 className="display-lg" style={{ marginBottom: 12 }}>
                {page.title || "Engineering-First Leadership"}
              </h1>
              <span className="accent-line" style={{ marginBottom: 28 }} />
              <p className="body-lg" style={{ maxWidth: 600, fontSize: 18, marginBottom: 32 }}>
                {page.body || "Built on years of hands-on site experience, SR Construction is led by someone who understands that buildings are only as good as the decisions made at ground level."}
              </p>
              <Link to="/consultation" className="btn btn-primary">
                Work With Us <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== QUOTE BLOCK ===== */}
      <section className="section-void-soft section-pad-sm">
        <div className="container">
          <div
            style={{
              maxWidth: 800,
              margin: "0 auto",
              textAlign: "center",
              padding: "60px 40px",
              background: "var(--void)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--line-dark)",
            }}
          >
            <Quote size={32} style={{ color: "var(--accent)", marginBottom: 24, opacity: 0.5 }} />
            <blockquote className="display-md" style={{ fontSize: "clamp(20px, 3vw, 32px)", lineHeight: 1.3, marginBottom: 24 }}>
              "Every structure we build is a statement of what Nigerian construction can be — precise, durable, and beautiful."
            </blockquote>
            <span className="caption" style={{ color: "var(--text-faint)" }}>
              Founder, SR Construction Ltd.
            </span>
          </div>
        </div>
      </section>

      {/* ===== STORY SECTIONS ===== */}
      <section ref={storyRef} className="section-dark section-pad">
        <div className="container">
          <div style={{ display: "flex", flexDirection: "column", gap: 100, maxWidth: 900, margin: "0 auto" }}>
            <div className="founder-story-block">
              <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
                The Beginning
              </span>
              <h2 className="heading-lg" style={{ marginBottom: 20 }}>Started on Site, Not in an Office</h2>
              <p className="body-lg">
                Before SR Construction was a company, it was a commitment to doing things right. Years of working directly on construction sites across Rivers State taught me that the difference between a building that lasts and one that doesn't comes down to the decisions made in the first 30 days.
              </p>
            </div>
            <div className="founder-story-block">
              <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
                The Philosophy
              </span>
              <h2 className="heading-lg" style={{ marginBottom: 20 }}>Accountability Over Everything</h2>
              <p className="body-lg">
                We don't pass blame to subcontractors. We don't hide behind contracts. When SR Construction takes on a project, the result is our responsibility from foundation to final coat of paint. That accountability is what has built our reputation across Lagos, Abuja and Port Harcourt.
              </p>
            </div>
            <div className="founder-story-block">
              <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
                The Vision
              </span>
              <h2 className="heading-lg" style={{ marginBottom: 20 }}>Raising the Standard, One Build at a Time</h2>
              <p className="body-lg">
                Nigeria's construction industry is ready for a new standard — one where clients don't have to choose between speed and quality, where budgets are respected and timelines are met. That's the standard we're building.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VALUES GRID ===== */}
      <section ref={valuesRef} className="section-void-soft section-pad">
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 60px" }}>
            <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
              Guiding Principles
            </span>
            <h2 className="display-md">Values that shape every decision</h2>
          </div>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { title: "Engineering Rigor", desc: "Every design decision is backed by structural logic, not aesthetics alone." },
              { title: "Transparent Pricing", desc: "No hidden costs. No surprise invoices. What we quote is what you pay." },
              { title: "Site Discipline", desc: "Safety protocols, material tracking, and daily progress reports are non-negotiable." },
              { title: "Client Partnership", desc: "We don't build for you — we build with you. Your input shapes the outcome." },
              { title: "Quality Materials", desc: "Every material is sourced from verified suppliers with full traceability." },
              { title: "Long-term Thinking", desc: "We build structures that will outlast their first owner. Durability is design." },
            ].map((v) => (
              <div
                key={v.title}
                className="founder-value"
                style={{
                  padding: 36,
                  background: "var(--void)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--line-dark)",
                  transition: "all 0.4s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--line-dark)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <h3 className="heading-md" style={{ fontSize: 18, marginBottom: 12 }}>{v.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-dim)" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMMITMENT BANNER ===== */}
      <section className="section-dark section-pad-sm" style={{ borderTop: "1px solid var(--line-dark)", borderBottom: "1px solid var(--line-dark)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 className="display-md" style={{ marginBottom: 20 }}>
            Ready to build something that lasts?
          </h2>
          <p className="body-lg" style={{ maxWidth: 560, margin: "0 auto 32px" }}>
            Let's discuss your project. The first conversation is always about understanding your vision.
          </p>
          <Link to="/consultation" className="btn btn-primary">
            Start the Conversation <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}
