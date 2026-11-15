import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { ArrowUpRight, ArrowRight, MoveRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { trpc } from "@/providers/trpc";
import { usePage } from "@/lib/site";
import { ConsultationCTA } from "@/components/SiteLayout";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const { page } = usePage("services");
  const services = trpc.public.services.useQuery();
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".services-hero-text", { y: 60, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.2 });
      gsap.from(".service-card", {
        y: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: gridRef.current, start: "top 80%" },
      });
      gsap.from(".process-step", {
        y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: processRef.current, start: "top 80%" },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ===== HERO: MASSIVE TYPOGRAPHY, NO IMAGE ===== */}
      <section
        ref={heroRef}
        className="section-dark hero-pad-sm"
        style={{ padding: "180px 5vw 100px", position: "relative", overflow: "hidden" }}
      >
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            background: "radial-gradient(circle, rgba(139,30,47,0.06) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div className="container services-hero-text" style={{ position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: 900 }}>
            <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 20 }}>
              {page.kicker || "Our Capabilities"}
            </span>
            <h1 className="display-lg" style={{ marginBottom: 28 }}>
              {page.title || "Everything Your Build Needs"}
            </h1>
            <span className="accent-line-lg" style={{ marginBottom: 32 }} />
            <p className="body-lg" style={{ maxWidth: 600, fontSize: 18 }}>
              {page.body || "From structural foundations to interior finishes, we provide the full spectrum of construction services under one accountable team."}
            </p>
          </div>
        </div>
      </section>

      {/* ===== SERVICES GRID ===== */}
      <section ref={gridRef} className="section-dark section-pad" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {(services.data ?? []).map((s, i) => (
              <Link
                key={s.id}
                to={`/services/${s.slug}`}
                className="service-card"
                style={{
                  display: "block",
                  background: "var(--void-soft)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  border: "1px solid var(--line-dark)",
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
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
                <div style={{ overflow: "hidden", height: 280 }}>
                  <img
                    src={s.coverImage || `/assets/service-${["foundation", "concrete", "steel", "drainage", "turf"][i % 5]}.jpg`}
                    alt={s.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.transform = "scale(1.05)"; }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = "scale(1)"; }}
                  />
                </div>
                <div style={{ padding: 36 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <h3 className="heading-md" style={{ fontSize: 22 }}>{s.name}</h3>
                    <ArrowUpRight size={20} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
                  </div>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-dim)", marginBottom: 20 }}>{s.summary}</p>
                  <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Learn more
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROCESS: 4 STEPS ===== */}
      <section ref={processRef} className="section-void-soft section-pad">
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 80px" }}>
            <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
              How We Work
            </span>
            <h2 className="display-md">Four steps to your build</h2>
            <span className="accent-line" style={{ margin: "24px auto 0" }} />
          </div>
          <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {[
              { num: "01", title: "Discovery", desc: "We visit your site, understand your vision and assess the technical requirements before any commitment." },
              { num: "02", title: "Planning", desc: "Detailed scope, timeline and cost breakdown. Every material spec'd. Every phase mapped." },
              { num: "03", title: "Execution", desc: "Supervised construction with real-time updates. Quality checks at every milestone." },
              { num: "04", title: "Handover", desc: "Final inspection, documentation and a building ready for use. Our warranty begins here." },
            ].map((step, i) => (
              <div
                key={step.num}
                className="process-step"
                style={{
                  padding: 40,
                  background: "var(--void)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--line-dark)",
                  position: "relative",
                  transition: "all 0.4s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--line-dark)";
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 48,
                    color: "var(--accent)",
                    opacity: 0.3,
                    lineHeight: 1,
                    display: "block",
                    marginBottom: 20,
                  }}
                >
                  {step.num}
                </span>
                <h3 className="heading-md" style={{ fontSize: 20, marginBottom: 14 }}>{step.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-dim)" }}>{step.desc}</p>
                {i < 3 && (
                  <div
                    className="process-arrow"
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: -24,
                      transform: "translateY(-50%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 48,
                      height: 48,
                      background: "var(--void-soft)",
                      borderRadius: "50%",
                      border: "1px solid var(--line-dark)",
                      zIndex: 2,
                    }}
                  >
                    <ArrowRight size={16} style={{ color: "var(--accent)" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}
