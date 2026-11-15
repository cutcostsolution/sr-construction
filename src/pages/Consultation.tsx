import { useState } from "react";
import { ArrowUpRight, Clock, CheckCircle, ShieldCheck, Users } from "lucide-react";
import { usePage } from "@/lib/site";
import { trpc } from "@/providers/trpc";

export default function Consultation() {
  const { page } = usePage("consultation");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const mutation = trpc.public.consultation.useMutation({
    onSuccess: () => setSent(true),
    onError: (err) => setError(err.message),
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const project = String(data.get("project") || "").trim();

    if (!name || !email || !project) {
      setError("Please fill in all required fields.");
      return;
    }

    mutation.mutate({
      name,
      email,
      phone: String(data.get("phone") || ""),
      projectType: project,
      message: String(data.get("message") || ""),
      budget: String(data.get("budget") || ""),
      timeline: String(data.get("timeline") || ""),
    });
  }

  const steps = [
    { icon: Clock, title: "Discovery Call", body: "A 20-minute conversation to understand your site, vision and constraints." },
    { icon: CheckCircle, title: "Site Assessment", body: "We visit your location and provide a preliminary technical and cost evaluation." },
    { icon: ShieldCheck, title: "Proposal & Agreement", body: "A clear scope, timeline and cost breakdown. No hidden charges." },
    { icon: Users, title: "Project Kickoff", body: "Mobilisation, milestones and regular progress reporting from day one." },
  ];

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero-fullbleed" style={{ minHeight: "60vh", justifyContent: "center" }}>
        <div className="hero-bg loaded" style={{ backgroundImage: `url(${page.heroImage || "/assets/hero-duplex.jpg"})` }} />
        <div className="hero-overlay" />
        <div className="hero-content" style={{ textAlign: "center", paddingTop: "160px" }}>
          <span className="hero-kicker">{page.kicker || "Book a Consultation"}</span>
          <h1 className="hero-title" style={{ maxWidth: 900, margin: "0 auto 24px" }}>
            Start with<br />
            <span className="hero-accent">clarity.</span>
          </h1>
          <p className="hero-body" style={{ maxWidth: 560, margin: "0 auto" }}>
            {page.body || "Tell us about your project and we will schedule a focused conversation about the next practical step."}
          </p>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section-dark section-pad-sm">
        <div className="container">
          <div className="section-header">
            <span className="caption">How It Works</span>
            <h2 className="display-md">Four steps to your build.</h2>
          </div>
          <div className="grid-4">
            {steps.map((s, i) => (
              <div key={s.title} style={{ padding: "32px", background: "var(--void-soft)", borderRadius: "var(--radius-lg)", border: "1px solid var(--line-dark)", position: "relative" }}>
                <span style={{ position: "absolute", top: 16, right: 16, fontSize: 48, fontWeight: 200, color: "var(--line-dark)", fontFamily: "var(--font-serif)" }}>{i + 1}</span>
                <s.icon size={24} style={{ color: "var(--accent)", marginBottom: 16 }} />
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--text-dim)" }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FORM ===== */}
      <section className="section-cream section-pad">
        <div className="container">
          <div className="grid-split">
            <div>
              <span className="caption">Request Form</span>
              <h2 className="display-md" style={{ margin: "16px 0 20px", color: "var(--ink)" }}>
                Tell us about<br />
                <span style={{ color: "var(--accent)" }}>your project.</span>
              </h2>
              <p className="body-lg" style={{ color: "var(--stone)", marginBottom: 32 }}>
                Fill in the details below and our team will contact you within 24 hours to schedule your consultation.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <CheckCircle size={18} style={{ color: "var(--accent)", flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: "var(--stone)" }}>No-obligation initial conversation</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <CheckCircle size={18} style={{ color: "var(--accent)", flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: "var(--stone)" }}>Site visit included for local projects</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <CheckCircle size={18} style={{ color: "var(--accent)", flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: "var(--stone)" }}>Clear proposal within 72 hours</span>
                </div>
              </div>
            </div>

            <div style={{ background: "var(--warm-white)", borderRadius: "var(--radius-xl)", border: "1px solid var(--line)", padding: "clamp(32px, 4vw, 48px)" }}>
              {sent ? (
                <div className="form-success" style={{ background: "#e8f5e9", borderColor: "#a5d6a7" }}>
                  <strong style={{ fontSize: 18, display: "block", marginBottom: 8 }}>Request Received</strong>
                  <p style={{ margin: 0 }}>Thank you. We will contact you within 24 hours to schedule your consultation.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && <div className="form-error" style={{ marginBottom: 20 }}>{error}</div>}
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input name="name" placeholder="Your name" required />
                    </div>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input name="email" type="email" placeholder="you@example.com" required />
                    </div>
                  </div>
                  <div className="form-grid" style={{ marginTop: 20 }}>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input name="phone" placeholder="+234 ..." />
                    </div>
                    <div className="form-group">
                      <label>Project Type *</label>
                      <select name="project" required>
                        <option value="">Select project type</option>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Renovation">Renovation</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-grid" style={{ marginTop: 20 }}>
                    <div className="form-group">
                      <label>Budget Range</label>
                      <select name="budget">
                        <option value="">Select budget</option>
                        <option value="Under 50M">Under N50 Million</option>
                        <option value="50M - 150M">N50 Million - N150 Million</option>
                        <option value="150M - 500M">N150 Million - N500 Million</option>
                        <option value="500M+">Above N500 Million</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Timeline</label>
                      <select name="timeline">
                        <option value="">Select timeline</option>
                        <option value="Immediate">Immediate</option>
                        <option value="1-3 months">1 - 3 months</option>
                        <option value="3-6 months">3 - 6 months</option>
                        <option value="6+ months">6+ months</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group" style={{ marginTop: 20 }}>
                    <label>Project Details</label>
                    <textarea name="message" rows={4} placeholder="Tell us about your vision, site location and any specific requirements..." />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 24 }} disabled={mutation.isPending}>
                    {mutation.isPending ? "Submitting..." : "Book Consultation"} <ArrowUpRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
