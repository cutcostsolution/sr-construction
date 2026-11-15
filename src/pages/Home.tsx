import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { ArrowUpRight, ArrowRight, Shield, Clock, Lightbulb, Award, TrendingUp, Users, Building, HardHat, Check } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { trpc } from "@/providers/trpc";
import { usePage } from "@/lib/site";
import { ConsultationCTA } from "@/components/SiteLayout";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { page } = usePage("home");
  const services = trpc.public.services.useQuery();
  const projects = trpc.public.projects.useQuery();
  const founder = usePage("founder").page;

  const heroRef = useRef<HTMLDivElement>(null);
  const principlesRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const founderRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.from(".hero-title", { y: 60, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.2 });
      gsap.from(".hero-body", { y: 40, opacity: 0, duration: 1, ease: "power3.out", delay: 0.5 });
      gsap.from(".hero-actions", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.8 });
      gsap.from(".hero-stats-panel", { x: 60, opacity: 0, duration: 1, ease: "power3.out", delay: 0.6 });

      // Principles stagger
      gsap.from(".principle-card", {
        y: 50, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: principlesRef.current, start: "top 80%" },
      });

      // Services
      gsap.from(".service-reveal", {
        y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: servicesRef.current, start: "top 80%" },
      });

      // Projects
      gsap.from(".project-reveal", {
        y: 50, opacity: 0, duration: 0.9, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: projectsRef.current, start: "top 80%" },
      });

      // Founder
      gsap.from(".founder-reveal", {
        y: 40, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out",
        scrollTrigger: { trigger: founderRef.current, start: "top 80%" },
      });

      // Metrics
      gsap.from(".metric-reveal", {
        y: 30, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: metricsRef.current, start: "top 85%" },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ===== HERO: CINEMATIC FULL-BLEED ===== */}
      <section
        ref={heroRef}
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          background: "var(--void)",
        }}
      >
        {/* Background image with overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(/assets/hero-building.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.35,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(10,10,15,0.4) 0%, rgba(10,10,15,0.85) 70%, var(--void) 100%)",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 2, padding: "140px 5vw 100px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: 80, alignItems: "center" }}>
            <div>
              <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 24 }}>
                {page.kicker || "Nigerian Construction Excellence"}
              </span>
              <h1 className="display-xl hero-title" style={{ marginBottom: 32, maxWidth: 900 }}>
                {page.title || "Structures That Stand the Test of Time"}
              </h1>
              <p className="body-lg hero-body" style={{ maxWidth: 520, marginBottom: 40, fontSize: 18 }}>
                {page.body || "Full-cycle construction from structural engineering to final handover. Built with precision, delivered with accountability."}
              </p>
              <div className="hero-actions" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <Link to="/consultation" className="btn btn-primary">
                  Book Your Consultation <ArrowUpRight size={16} />
                </Link>
                <Link to="/projects" className="btn btn-outline">
                  Explore Our Work <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div
              className="hero-stats-panel"
              style={{
                background: "rgba(17,17,24,0.8)",
                backdropFilter: "blur(20px)",
                border: "1px solid var(--line-dark)",
                borderRadius: "var(--radius-xl)",
                padding: 48,
              }}
            >
              <span className="caption" style={{ color: "var(--gold)", display: "block", marginBottom: 24 }}>
                Track Record
              </span>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 18 }}>
                {[
                  "12+ years in Nigerian construction",
                  "50+ completed projects",
                  "Lagos, Abuja, Port Harcourt",
                  "Structural, architectural, finishing",
                  "Supervised execution every stage",
                ].map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 14, color: "var(--text-dim)" }}>
                    <Check size={16} style={{ color: "var(--accent)", flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--line-dark)" }}>
                <div style={{ display: "flex", gap: 32 }}>
                  <div>
                    <strong style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--text)", display: "block" }}>50+</strong>
                    <span style={{ fontSize: 12, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Projects</span>
                  </div>
                  <div>
                    <strong style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--text)", display: "block" }}>12+</strong>
                    <span style={{ fontSize: 12, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Years</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            opacity: 0.4,
          }}
        >
          <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em" }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, var(--text-faint), transparent)" }} />
        </div>
      </section>

      {/* ===== MARQUEE STRIP ===== */}
      <div style={{ background: "var(--void-soft)", borderTop: "1px solid var(--line-dark)", borderBottom: "1px solid var(--line-dark)", padding: "20px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ display: "inline-block", animation: "marquee 30s linear infinite" }}>
          {["Structural Engineering", "Architectural Design", "Project Management", "Interior Fit-Out", "Renovation & Restoration", "Building Materials Supply", "Site Supervision", "Quality Assurance"].map((t) => (
            <span key={t} style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 500, color: "var(--text-faint)", padding: "0 50px" }}>
              {t}
            </span>
          ))}
          {["Structural Engineering", "Architectural Design", "Project Management", "Interior Fit-Out", "Renovation & Restoration", "Building Materials Supply", "Site Supervision", "Quality Assurance"].map((t) => (
            <span key={`dup-${t}`} style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 500, color: "var(--text-faint)", padding: "0 50px" }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ===== PRINCIPLES ===== */}
      <section ref={principlesRef} className="section-dark section-pad">
        <div className="container">
          <div style={{ maxWidth: 600, marginBottom: 80 }}>
            <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
              The SR Standard
            </span>
            <h2 className="display-md">Built on four principles</h2>
            <span className="accent-line" style={{ marginTop: 24 }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {[
              { icon: Shield, title: "Quality", desc: "The right materials, sound technical decisions and careful execution at every stage." },
              { icon: Clock, title: "Speed", desc: "Clear coordination keeps people, decisions and site work moving forward." },
              { icon: Lightbulb, title: "Innovation", desc: "Practical methods and visible records improve the building experience." },
              { icon: Award, title: "High Standards", desc: "Every stage checked against the agreed scope, finish and timeline." },
            ].map((p) => (
              <div
                key={p.title}
                className="principle-card"
                style={{
                  padding: 40,
                  background: "var(--void-soft)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--line-dark)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
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
                <p.icon size={28} style={{ color: "var(--accent)", marginBottom: 24 }} />
                <h3 className="heading-md" style={{ marginBottom: 12, fontSize: 20 }}>{p.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-dim)" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES PREVIEW ===== */}
      <section ref={servicesRef} className="section-cream section-pad">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "0.4fr 1fr", gap: 80, alignItems: "start" }}>
            <div>
              <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
                What We Do
              </span>
              <h2 className="display-md" style={{ color: "var(--text-dark)", marginBottom: 24 }}>
                Specialist capability.
              </h2>
              <p className="body-lg" style={{ color: "var(--text-dark-dim)", marginBottom: 32 }}>
                From structural work to complete project delivery, every service is shaped around the actual demands of your site.
              </p>
              <Link to="/services" className="btn btn-accent">
                All Services <ArrowUpRight size={16} />
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
              {(services.data ?? []).slice(0, 4).map((s) => (
                <div
                  key={s.id}
                  className="service-reveal"
                  style={{
                    padding: 36,
                    background: "var(--cream-warm)",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--line-light)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--line-light)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <h3 className="heading-md" style={{ color: "var(--text-dark)", marginBottom: 12, fontSize: 20 }}>{s.name}</h3>
                  <p style={{ color: "var(--text-dark-dim)", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{s.summary}</p>
                </div>
              ))}
              {services.isLoading && (
                <div style={{ color: "var(--text-dark-dim)", fontSize: 14, padding: 36 }}>Loading capabilities...</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SELECTED PROJECTS ===== */}
      <section ref={projectsRef} className="section-dark section-pad">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60, flexWrap: "wrap", gap: 20 }}>
            <div>
              <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
                Selected Work
              </span>
              <h2 className="display-md">Projects that speak</h2>
            </div>
            <Link to="/projects" className="btn btn-outline">
              View All Projects <ArrowUpRight size={16} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {(projects.data ?? []).slice(0, 3).map((p) => (
              <Link
                key={p.id}
                to={`/projects/${p.slug}`}
                className="project-reveal"
                style={{
                  display: "block",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  border: "1px solid var(--line-dark)",
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--line-accent)";
                  e.currentTarget.style.transform = "translateY(-8px)";
                  const img = e.currentTarget.querySelector("img") as HTMLElement;
                  if (img) img.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--line-dark)";
                  e.currentTarget.style.transform = "translateY(0)";
                  const img = e.currentTarget.querySelector("img") as HTMLElement;
                  if (img) img.style.transform = "scale(1)";
                }}
              >
                <div style={{ overflow: "hidden", height: 320 }}>
                  <img
                    src={p.coverImage || "/assets/project-duplex.webp"}
                    alt={p.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}
                  />
                </div>
                <div style={{ padding: 28 }}>
                  <span style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>
                    {p.category}
                  </span>
                  <h3 className="heading-md" style={{ fontSize: 20, marginBottom: 8 }}>{p.title}</h3>
                  <span
                    style={{
                      display: "inline-block",
                      background: "var(--accent-soft)",
                      color: "var(--accent)",
                      padding: "6px 16px",
                      borderRadius: "var(--radius-full)",
                      fontSize: 10,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginTop: 8,
                    }}
                  >
                    {p.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOUNDER TEASER ===== */}
      <section ref={founderRef} className="section-void-soft section-pad">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "0.42fr 1fr", gap: 80, alignItems: "center" }}>
            <div className="founder-reveal" style={{ position: "relative" }}>
              <img
                src="/assets/founder.jpg"
                alt="Founder"
                style={{
                  width: "100%",
                  borderRadius: "var(--radius-xl)",
                  aspectRatio: "3/4",
                  objectFit: "cover",
                  border: "1px solid var(--line-dark)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: -20,
                  right: -20,
                  background: "var(--void-soft)",
                  border: "1px solid var(--line-dark)",
                  borderRadius: "var(--radius-lg)",
                  padding: "24px 28px",
                  maxWidth: 220,
                }}
              >
                <strong style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--text)", display: "block" }}>12+</strong>
                <span style={{ fontSize: 12, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Years Building Nigeria</span>
              </div>
            </div>
            <div className="founder-reveal">
              <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
                The Founder
              </span>
              <h2 className="display-md" style={{ marginBottom: 20 }}>
                {founder.title || "Leadership Built on Site Experience"}
              </h2>
              <span className="accent-line" style={{ marginBottom: 28 }} />
              <p className="body-lg" style={{ marginBottom: 32, maxWidth: 560 }}>
                {founder.body || "Every decision at SR Construction is informed by years of hands-on project execution. We don't just manage builds — we engineer outcomes."}
              </p>
              <Link to="/founder" className="btn btn-outline">
                Meet the Founder <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== METRICS ===== */}
      <section ref={metricsRef} className="section-dark section-pad-sm" style={{ borderTop: "1px solid var(--line-dark)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {[
              { icon: Building, value: "50+", label: "Projects Delivered" },
              { icon: Users, value: "30+", label: "Team Members" },
              { icon: HardHat, value: "12+", label: "Years Active" },
              { icon: TrendingUp, value: "100%", label: "Client Satisfaction" },
            ].map((m) => (
              <div
                key={m.label}
                className="metric-reveal"
                style={{
                  textAlign: "center",
                  padding: "40px 24px",
                  background: "var(--void-soft)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--line-dark)",
                }}
              >
                <m.icon size={24} style={{ color: "var(--accent)", marginBottom: 16 }} />
                <strong style={{ fontFamily: "var(--font-display)", fontSize: 42, color: "var(--text)", display: "block", marginBottom: 8, lineHeight: 1 }}>
                  {m.value}
                </strong>
                <span style={{ fontSize: 12, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}
