import { useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, HardHat, Truck, Wrench, Users, TrendingUp, Award, Building2 } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { usePage } from "@/lib/site";
import { ConsultationCTA } from "@/components/SiteLayout";

export default function Network() {
  const { page } = usePage("network");
  const [type, setType] = useState<"artisan" | "supplier" | "consultant">("artisan");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  // CORRECTED: use networkApplication (not apply)
  const mutation = trpc.public.networkApplication.useMutation({
    onSuccess: () => setSent(true),
    onError: (err) => setError(err.message),
  });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    // Map frontend types to backend enum: "business" | "professional"
    const backendType = type === "supplier" ? "business" : "professional";
    const nameVal = String(data.get("name"));
    const skillVal = String(data.get("skill"));
    const messageVal = String(data.get("message"));
    mutation.mutate({
      type: backendType,
      name: nameVal,
      contactName: nameVal,
      email: String(data.get("email")),
      phone: String(data.get("phone")),
      location: String(data.get("location")),
      category: skillVal,
      servicesOffered: messageVal.length >= 5 ? messageVal : `${skillVal} services`,
      experience: String(data.get("experience") || ""),
      affiliations: "",
      website: "",
      details: "",
      document: undefined,
    });
  }

  const types = [
    {
      key: "artisan" as const,
      icon: HardHat,
      title: "Skilled Artisan",
      desc: "Masons, carpenters, electricians, plumbers, painters and other site craftspeople who bring structures to life with precision and care.",
    },
    {
      key: "supplier" as const,
      icon: Truck,
      title: "Material Supplier",
      desc: "Cement, steel, sand, roofing, tiles, fixtures and other building material vendors who ensure every project has quality materials on time.",
    },
    {
      key: "consultant" as const,
      icon: Wrench,
      title: "Technical Consultant",
      desc: "Structural engineers, architects, surveyors, MEP engineers and specialists who provide the technical backbone for every build.",
    },
  ];

  const benefits = [
    { icon: TrendingUp, title: "Steady Work Flow", desc: "Access to ongoing projects across residential, commercial and industrial sectors." },
    { icon: Award, title: "Skill Development", desc: "Work alongside seasoned professionals and grow your craft through real-world experience." },
    { icon: Users, title: "Fair Partnership", desc: "Transparent terms, prompt payment and a team that values your contribution." },
    { icon: Building2, title: "Portfolio Growth", desc: "Build your reputation by associating with landmark projects across Nigeria." },
  ];

  return (
    <>
      {/* ===== HERO ===== */}
      <section
        style={{
          minHeight: "70vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(/assets/hero-building.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.3,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(10,10,15,0.85) 0%, rgba(10,10,15,0.6) 100%)",
          }}
        />
        <div className="container hero-pad" style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "140px 5vw 80px" }}>
          <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 20 }}>
            {page.kicker || "Grow With Us"}
          </span>
          <h1 className="display-lg" style={{ marginBottom: 20, maxWidth: 800, margin: "0 auto 20px" }}>
            {page.title || "Build Your Future With SR Construction"}
          </h1>
          <p className="body-lg" style={{ maxWidth: 680, margin: "0 auto", fontSize: 18 }}>
            {page.body || "We believe in building people as much as we believe in building structures. Whether you are a skilled artisan, a reliable supplier or a technical expert, SR Construction is your platform to grow, earn and leave a legacy."}
          </p>
        </div>
      </section>

      {/* ===== WHY JOIN ===== */}
      <section className="section-dark section-pad">
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 60px" }}>
            <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
              Why Partner With Us
            </span>
            <h2 className="display-md">More than work. A career.</h2>
            <p className="body-lg" style={{ marginTop: 16, color: "var(--text-dim)" }}>
              We do not just hire hands. We invest in people. Every project is an opportunity to sharpen your skills, expand your network and build a name that lasts.
            </p>
          </div>
          <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 80 }}>
            {benefits.map((b) => (
              <div
                key={b.title}
                style={{
                  padding: "clamp(28px, 3vw, 40px)",
                  background: "var(--void-soft)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--line-dark)",
                  textAlign: "left",
                }}
              >
                <b.icon size={28} style={{ color: "var(--accent)", marginBottom: 20 }} />
                <h3 className="heading-md" style={{ fontSize: 18, marginBottom: 12 }}>{b.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-dim)" }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TYPE SELECTOR ===== */}
      <section className="section-dark section-pad" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 60px" }}>
            <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
              How You Can Join
            </span>
            <h2 className="display-md">Three ways to partner</h2>
          </div>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 80 }}>
            {types.map((t) => (
              <button
                key={t.key}
                onClick={() => { setType(t.key); setSent(false); }}
                style={{
                  padding: "clamp(28px, 3vw, 40px)",
                  background: type === t.key ? "var(--void-soft)" : "var(--void)",
                  borderRadius: "var(--radius-lg)",
                  border: `1px solid ${type === t.key ? "var(--accent)" : "var(--line-dark)"}`,
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.4s ease",
                  color: "inherit",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => { if (type !== t.key) e.currentTarget.style.borderColor = "var(--line-accent)"; }}
                onMouseLeave={(e) => { if (type !== t.key) e.currentTarget.style.borderColor = "var(--line-dark)"; }}
              >
                <t.icon size={28} style={{ color: "var(--accent)", marginBottom: 20 }} />
                <h3 className="heading-md" style={{ fontSize: 20, marginBottom: 12 }}>{t.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-dim)" }}>{t.desc}</p>
              </button>
            ))}
          </div>

          {/* ===== APPLICATION FORM ===== */}
          <div
            style={{
              maxWidth: 700,
              margin: "0 auto",
              background: "var(--void-soft)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--line-dark)",
              padding: "clamp(32px, 5vw, 60px)",
            }}
          >
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <CheckCircle2 size={56} style={{ color: "var(--accent)", marginBottom: 24 }} />
                <h2 className="heading-lg" style={{ marginBottom: 12 }}>Application Submitted</h2>
                <p className="body-lg">
                  Thank you for your interest. Our team will review your application and contact you within 5 business days.
                </p>
                <button onClick={() => setSent(false)} className="btn btn-outline" style={{ marginTop: 24 }}>
                  Submit Another Application
                </button>
              </div>
            ) : (
              <>
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                  <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 12 }}>
                    Application Form
                  </span>
                  <h3 className="heading-lg">
                    Apply as a {types.find((t) => t.key === type)?.title}
                  </h3>
                </div>
                <form onSubmit={submit}>
                  <div className="form-grid">
                    <div className="input-group">
                      <label htmlFor="name">Full Name</label>
                      <input id="name" name="name" type="text" placeholder="Your full name" required />
                    </div>
                    <div className="input-group">
                      <label htmlFor="email">Email</label>
                      <input id="email" name="email" type="email" placeholder="you@example.com" required />
                    </div>
                    <div className="input-group">
                      <label htmlFor="phone">Phone</label>
                      <input id="phone" name="phone" type="tel" placeholder="+234 ..." required />
                    </div>
                    <div className="input-group">
                      <label htmlFor="location">Location / State</label>
                      <input id="location" name="location" type="text" placeholder="e.g. Port Harcourt, Rivers State" required />
                    </div>
                    <div className="input-group">
                      <label htmlFor="skill">Primary Skill / Trade</label>
                      <input id="skill" name="skill" type="text" placeholder="e.g. Electrical Installation" required />
                    </div>
                    <div className="input-group">
                      <label htmlFor="experience">Years of Experience</label>
                      <input id="experience" name="experience" type="text" placeholder="e.g. 5 years" required />
                    </div>
                    <div className="input-group full">
                      <label htmlFor="message">Tell us about your work</label>
                      <textarea id="message" name="message" placeholder="Describe your experience, past projects, and what you can bring to SR Construction..." required />
                    </div>
                  </div>
                  {error && <div className="form-error" style={{ marginTop: 20 }}>{error}</div>}
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={mutation.isPending}
                    style={{ marginTop: 24, width: "100%", justifyContent: "center" }}
                  >
                    {mutation.isPending ? "Submitting..." : "Submit Application"} <ArrowUpRight size={16} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}
