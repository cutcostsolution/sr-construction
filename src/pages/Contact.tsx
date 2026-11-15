import { useState } from "react";
import { MapPin, Mail, Phone, ArrowUpRight } from "lucide-react";
import { usePage } from "@/lib/site";
import { trpc } from "@/providers/trpc";

export default function Contact() {
  const { page } = usePage("contact");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const mutation = trpc.public.contact.useMutation({
    onSuccess: () => setSent(true),
    onError: (err) => setError(err.message),
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !email || !message) {
      setError("Please fill in all required fields.");
      return;
    }

    mutation.mutate({ name, email, phone: String(data.get("phone") || ""), message, subject: String(data.get("subject") || "") });
  }

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero-fullbleed" style={{ minHeight: "60vh", justifyContent: "center" }}>
        <div className="hero-bg loaded" style={{ backgroundImage: `url(${page.heroImage || "/assets/hero-building.jpg"})` }} />
        <div className="hero-overlay" />
        <div className="hero-content" style={{ textAlign: "center", paddingTop: "160px" }}>
          <span className="hero-kicker">{page.kicker || "Get In Touch"}</span>
          <h1 className="hero-title" style={{ maxWidth: 900, margin: "0 auto 24px" }}>
            Let's start a<br />
            <span className="hero-accent">conversation.</span>
          </h1>
          <p className="hero-body" style={{ maxWidth: 560, margin: "0 auto" }}>
            {page.body || "Whether you have a question, a project brief or just want to explore options, we are here to listen."}
          </p>
        </div>
      </section>

      {/* ===== CONTACT CONTENT ===== */}
      <section className="section-dark section-pad">
        <div className="container">
          <div className="grid-split">
            <div>
              <span className="caption">Contact Details</span>
              <h2 className="display-md" style={{ margin: "16px 0 20px" }}>
                Reach us directly.
              </h2>
              <p className="body-lg" style={{ marginBottom: 40 }}>
                Our team responds to all enquiries within 24 hours. For urgent matters, call us directly.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <MapPin size={18} style={{ color: "var(--accent)" }} />
                  </div>
                  <div>
                    <strong style={{ display: "block", marginBottom: 4 }}>Office Address</strong>
                    <span style={{ color: "var(--text-dim)", fontSize: 14 }}>Bics Mall, 61 Olusegun-Obasanjo Road, Port Harcourt, Rivers State</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Mail size={18} style={{ color: "var(--accent)" }} />
                  </div>
                  <div>
                    <strong style={{ display: "block", marginBottom: 4 }}>Email</strong>
                    <span style={{ color: "var(--text-dim)", fontSize: 14 }}>info@srconstructions.ng</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Phone size={18} style={{ color: "var(--accent)" }} />
                  </div>
                  <div>
                    <strong style={{ display: "block", marginBottom: 4 }}>Phone</strong>
                    <span style={{ color: "var(--text-dim)", fontSize: 14 }}>0707 112 2510</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: "var(--void-soft)", borderRadius: "var(--radius-xl)", border: "1px solid var(--line-dark)", padding: "clamp(32px, 4vw, 48px)" }}>
              {sent ? (
                <div className="form-success">
                  <strong style={{ fontSize: 18, display: "block", marginBottom: 8 }}>Message Sent</strong>
                  <p style={{ margin: 0 }}>Thank you for reaching out. We will get back to you within 24 hours.</p>
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
                  <div className="form-group" style={{ marginTop: 20 }}>
                    <label>Phone Number</label>
                    <input name="phone" placeholder="+234 ..." />
                  </div>
                  <div className="form-group" style={{ marginTop: 20 }}>
                    <label>Subject</label>
                    <input name="subject" placeholder="What is this about?" />
                  </div>
                  <div className="form-group" style={{ marginTop: 20 }}>
                    <label>Message *</label>
                    <textarea name="message" rows={5} placeholder="Tell us about your project or enquiry..." required />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 24 }} disabled={mutation.isPending}>
                    {mutation.isPending ? "Sending..." : "Send Message"} <ArrowUpRight size={16} />
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
