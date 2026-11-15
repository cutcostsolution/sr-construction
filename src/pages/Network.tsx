import { useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, ArrowRight, TrendingUp, Users, Lightbulb, Handshake, Award } from "lucide-react";
import { usePage } from "@/lib/site";
import { trpc } from "@/providers/trpc";
import { ConsultationCTA } from "@/components/SiteLayout";

const SKILL_OPTIONS = [
  "Architectural Design",
  "Structural Engineering",
  "Quantity Surveying",
  "Project Management",
  "MEP Engineering",
  "Steel Fabrication",
  "Concrete Works",
  "Interior Design",
  "Landscaping",
  "Surveying",
  "Material Supply",
  "Other",
];

export default function Network() {
  const { page } = usePage("network");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const mutation = trpc.public.networkApplication.useMutation({
    onSuccess: () => setSent(true),
    onError: (err) => setError(err.message),
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const data = new FormData(e.currentTarget);
    const nameVal = String(data.get("name") || "").trim();
    const skillVal = String(data.get("skill") || "").trim();
    const messageVal = String(data.get("message") || "").trim();

    if (!nameVal || !skillVal) {
      setError("Please fill in your name and select a skill area.");
      return;
    }

    const backendType = skillVal === "Material Supply" ? "supplier" : "artisan";

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
    });
  }

  const benefits = [
    { icon: TrendingUp, title: "Steady Work Flow", body: "Get consistent project opportunities across multiple sites in Port Harcourt, Lagos, Abuja and beyond." },
    { icon: Users, title: "Skill Development", body: "Work alongside experienced engineers and learn new techniques that grow your expertise and earning power." },
    { icon: Handshake, title: "Fair Partnership", body: "Clear terms, timely payments and transparent communication. We treat our network as partners, not labour." },
    { icon: Award, title: "Portfolio Growth", body: "Build your reputation by working on landmark projects that speak for your craft across Nigeria." },
  ];

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero-fullbleed" style={{ minHeight: "75vh", justifyContent: "center" }}>
        <div className="hero-bg loaded" style={{ backgroundImage: `url(${page.heroImage || "/assets/hero-building.jpg"})` }} />
        <div className="hero-overlay" />
        <div className="hero-content" style={{ textAlign: "center", paddingTop: "160px" }}>
          <span className="hero-kicker">{page.kicker || "Grow With Us"}</span>
          <h1 className="hero-title" style={{ maxWidth: 900, margin: "0 auto 24px" }}>
            Build your future<br />
            <span className="hero-accent">with SR</span> Construction.
          </h1>
          <p className="hero-body" style={{ maxWidth: 640, margin: "0 auto 40px" }}>
            {page.body || "We believe in building people as much as we believe in building structures. Whether you are a skilled artisan, a reliable supplier or a technical expert, SR Construction is your platform to grow, earn and leave a legacy."}
          </p>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <a href="#apply" className="btn btn-primary btn-lg">
              Join the Network <ArrowDown size={18} />
            </a>
            <Link to="/contact" className="btn btn-outline btn-lg">
              Contact Us <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHY PARTNER ===== */}
      <section className="section-cream section-pad">
        <div className="container">
          <div className="section-header">
            <span className="caption">Why Partner With Us</span>
            <h2 className="display-md" style={{ color: "var(--ink)" }}>More than a contract. A career path.</h2>
          </div>
          <div className="grid-4">
            {benefits.map((b) => (
              <div key={b.title} className="principle-card">
                <b.icon size={28} style={{ color: "var(--accent)" }} />
                <h3>{b.title}</h3>
                <p>{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== APPLICATION FORM ===== */}
      <section id="apply" className="section-dark section-pad">
        <div className="container">
          <div className="grid-split">
            <div>
              <span className="caption">Apply Now</span>
              <h2 className="display-md" style={{ margin: "16px 0 20px" }}>
                Tell us about<br />
                <span className="hero-accent">your expertise.</span>
              </h2>
              <p className="body-lg" style={{ marginBottom: 32 }}>
                Fill in the form and our team will review your application within 48 hours. If your skills match our current needs, we will reach out to discuss the next steps.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Lightbulb size={18} style={{ color: "var(--accent)" }} />
                  </div>
                  <div>
                    <strong style={{ fontSize: 14, display: "block" }}>Skill Assessment</strong>
                    <span style={{ fontSize: 13, color: "var(--text-dim)" }}>We review your experience and portfolio</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Users size={18} style={{ color: "var(--accent)" }} />
                  </div>
                  <div>
                    <strong style={{ fontSize: 14, display: "block" }}>Interview & Onboarding</strong>
                    <span style={{ fontSize: 13, color: "var(--text-dim)" }}>A conversation about fit and expectations</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Award size={18} style={{ color: "var(--accent)" }} />
                  </div>
                  <div>
                    <strong style={{ fontSize: 14, display: "block" }}>First Project Assignment</strong>
                    <span style={{ fontSize: 13, color: "var(--text-dim)" }}>Start building your portfolio with us</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: "var(--void-soft)", borderRadius: "var(--radius-xl)", border: "1px solid var(--line-dark)", padding: "clamp(32px, 4vw, 48px)" }}>
              {sent ? (
                <div className="form-success">
                  <strong style={{ fontSize: 18, display: "block", marginBottom: 8 }}>Application Submitted</strong>
                  <p style={{ margin: 0 }}>Thank you. We will review your details and contact you within 48 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && <div className="form-error" style={{ marginBottom: 20 }}>{error}</div>}
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input name="name" placeholder="Your full name" required />
                    </div>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input name="email" type="email" placeholder="you@example.com" required />
                    </div>
                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input name="phone" placeholder="+234 ..." required />
                    </div>
                    <div className="form-group">
                      <label>Location *</label>
                      <input name="location" placeholder="City, State" required />
                    </div>
                  </div>
                  <div className="form-grid" style={{ marginTop: 20 }}>
                    <div className="form-group">
                      <label>Skill Area *</label>
                      <select name="skill" required>
                        <option value="">Select your skill</option>
                        {SKILL_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Years of Experience</label>
                      <input name="experience" placeholder="e.g. 5 years" />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginTop: 20 }}>
                    <label>Tell us about your work</label>
                    <textarea name="message" rows={4} placeholder="Describe your expertise, past projects and what you bring to the table..." />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 24 }} disabled={mutation.isPending}>
                    {mutation.isPending ? "Submitting..." : "Submit Application"} <ArrowUpRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}

// ArrowDown icon inline
function ArrowDown({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  );
}
