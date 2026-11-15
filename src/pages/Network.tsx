import { useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, HardHat, Truck, Wrench } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { usePage } from "@/lib/site";
import { ConsultationCTA } from "@/components/SiteLayout";

export default function Network() {
  const { page } = usePage("network");
  const [type, setType] = useState<"artisan" | "supplier" | "consultant">("artisan");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const mutation = trpc.public.apply.useMutation();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      await mutation.mutateAsync({
        type,
        name: String(data.get("name")),
        email: String(data.get("email")),
        phone: String(data.get("phone")),
        location: String(data.get("location")),
        skill: String(data.get("skill")),
        experience: String(data.get("experience")),
        message: String(data.get("message")),
      });
      setSent(true);
      form.reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed. Please try again.");
    }
  }

  const types = [
    {
      key: "artisan" as const,
      icon: HardHat,
      title: "Skilled Artisan",
      desc: "Masons, carpenters, electricians, plumbers, painters and other site craftspeople.",
    },
    {
      key: "supplier" as const,
      icon: Truck,
      title: "Material Supplier",
      desc: "Cement, steel, sand, roofing, tiles, fixtures and other building material vendors.",
    },
    {
      key: "consultant" as const,
      icon: Wrench,
      title: "Technical Consultant",
      desc: "Structural engineers, architects, surveyors, MEP engineers and specialists.",
    },
  ];

  return (
    <>
      {/* ===== HERO: FULL IMAGE ===== */}
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
            backgroundImage: "url(/assets/hero-workers.jpg)",
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
        <div className="container" style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "140px 5vw 80px" }}>
          <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 20 }}>
            {page.kicker || "Join Our Network"}
          </span>
          <h1 className="display-lg" style={{ marginBottom: 20, maxWidth: 800, margin: "0 auto 20px" }}>
            {page.title || "Work With SR Construction"}
          </h1>
          <p className="body-lg" style={{ maxWidth: 600, margin: "0 auto", fontSize: 18 }}>
            {page.body || "We are always looking for skilled artisans, reliable suppliers and technical consultants who share our standards."}
          </p>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 80 }}>
            {types.map((t) => (
              <button
                key={t.key}
                onClick={() => { setType(t.key); setSent(false); }}
                style={{
                  padding: 40,
                  background: type === t.key ? "var(--void-soft)" : "var(--void)",
                  borderRadius: "var(--radius-lg)",
                  border: `1px solid ${type === t.key ? "var(--accent)" : "var(--line-dark)"}`,
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.4s ease",
                  color: "inherit",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  if (type !== t.key) e.currentTarget.style.borderColor = "var(--line-accent)";
                }}
                onMouseLeave={(e) => {
                  if (type !== t.key) e.currentTarget.style.borderColor = "var(--line-dark)";
                }}
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
              padding: 60,
            }}
          >
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <CheckCircle2 size={56} style={{ color: "var(--accent)", marginBottom: 24 }} />
                <h2 className="heading-lg" style={{ marginBottom: 12 }}>
                  Application Submitted
                </h2>
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
