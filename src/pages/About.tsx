import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Shield, Clock, Lightbulb, Award } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePage } from "@/lib/site";
import { ConsultationCTA } from "@/components/SiteLayout";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const { page } = usePage("about");
  const heroRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-hero-text", { y: 60, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.2 });
      gsap.from(".about-value-card", {
        y: 50, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: valuesRef.current, start: "top 80%" },
      });
      gsap.from(".about-story-reveal", {
        y: 40, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out",
        scrollTrigger: { trigger: storyRef.current, start: "top 80%" },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ===== HERO: FULL-BLEED IMAGE WITH MASSIVE TYPE ===== */}
      <section
        ref={heroRef}
        style={{
          minHeight: "85vh",
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
            backgroundImage: "url(/assets/hero-structure.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(10,10,15,0.92) 0%, rgba(10,10,15,0.5) 50%, rgba(10,10,15,0.3) 100%)",
          }}
        />
        <div className="container about-hero-text" style={{ position: "relative", zIndex: 2, padding: "160px 5vw 100px" }}>
          <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 20 }}>
            {page.kicker || "About SR Construction"}
          </span>
          <h1 className="display-lg" style={{ maxWidth: 800, marginBottom: 24 }}>
            {page.title || "Built on Integrity. Delivered with Precision."}
          </h1>
          <p className="body-lg" style={{ maxWidth: 600, fontSize: 18, opacity: 0.8 }}>
            {page.body || "A Nigerian construction company that treats every project as a long-term investment in quality and trust."}
          </p>
        </div>
      </section>

      {/* ===== STORY SECTION: ASYMMETRIC EDITORIAL ===== */}
      <section ref={storyRef} className="section-dark section-pad">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 100, alignItems: "center" }}>
            <div className="about-story-reveal">
              <img
                src="/assets/hero-foundation.jpg"
                alt="Construction foundation work"
                style={{
                  width: "100%",
                  height: 600,
                  objectFit: "cover",
                  borderRadius: "var(--radius-xl)",
                  border: "1px solid var(--line-dark)",
                }}
              />
            </div>
            <div className="about-story-reveal">
              <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 20 }}>
                Our Story
              </span>
              <h2 className="display-md" style={{ marginBottom: 28 }}>
                From Ground to Grandeur
              </h2>
              <span className="accent-line" style={{ marginBottom: 32 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <p className="body-lg">
                  SR Construction began with a simple conviction: that Nigerian buildings deserve the same engineering rigour found anywhere in the world. We started small — residential renovations, structural repairs — and earned every next project through results.
                </p>
                <p className="body-lg">
                  Today we manage full-cycle construction across multiple states. Our team combines structural engineers, architects, project managers and site supervisors who work as one accountable unit from foundation to handover.
                </p>
                <p className="body-lg">
                  We don't subcontract accountability. When SR Construction signs a contract, the delivery promise is ours — supervised, documented and met.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VALUES: DARK CARDS WITH HOVER REVEAL ===== */}
      <section ref={valuesRef} className="section-void-soft section-pad">
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 80px" }}>
            <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
              Core Values
            </span>
            <h2 className="display-md">What drives every decision</h2>
            <span className="accent-line" style={{ margin: "24px auto 0" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {[
              { icon: Shield, title: "Integrity", desc: "We say what we mean and deliver what we promise. No hidden costs, no compromised materials." },
              { icon: Clock, title: "Discipline", desc: "Timelines are commitments, not suggestions. Every phase is planned, tracked and executed with precision." },
              { icon: Lightbulb, title: "Ingenuity", desc: "We solve problems before they become delays. Smart planning prevents expensive corrections." },
              { icon: Award, title: "Excellence", desc: "Good enough is never enough. Every weld, every pour, every finish is inspected to standard." },
            ].map((v) => (
              <div
                key={v.title}
                className="about-value-card"
                style={{
                  padding: 40,
                  background: "var(--void)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--line-dark)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.transform = "translateY(-6px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--line-dark)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <v.icon size={24} style={{ color: "var(--accent)", marginBottom: 24 }} />
                <h3 className="heading-md" style={{ fontSize: 20, marginBottom: 14 }}>{v.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-dim)" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LOCATION BAND ===== */}
      <section className="section-dark section-pad-sm" style={{ borderTop: "1px solid var(--line-dark)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="caption" style={{ color: "var(--text-faint)", display: "block", marginBottom: 16 }}>
            Operations Across Nigeria
          </span>
          <h3 className="heading-lg" style={{ color: "var(--text-dim)", fontWeight: 400 }}>
            Port Harcourt &middot; Lagos &middot; Abuja &middot; Asaba &middot; Owerri
          </h3>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}
