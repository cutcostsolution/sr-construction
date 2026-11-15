import { useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { usePage } from "@/lib/site";

export default function Contact() {
  const { page, settings } = usePage("contact");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const mutation = trpc.public.enquiry.useMutation();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      await mutation.mutateAsync({
        name: String(data.get("name")),
        email: String(data.get("email")),
        phone: String(data.get("phone") || ""),
        subject: String(data.get("subject")),
        message: String(data.get("message")),
      });
      setSent(true);
      form.reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Your message could not be sent. Please try again.");
    }
  }

  const whatsappText = encodeURIComponent("Hello SR Construction, I would like to make an enquiry.");

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="section-dark hero-pad-sm" style={{ padding: "160px 5vw 60px" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: 700 }}>
          <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
            Contact Us
          </span>
          <h1 className="display-lg" style={{ marginBottom: 20 }}>
            {page.title || "Let's Talk"}
          </h1>
          <p className="body-lg" style={{ fontSize: 18 }}>
            {page.body || "Have a project in mind? We'd love to hear about it. Reach out and we'll respond within 24 hours."}
          </p>
        </div>
      </section>

      {/* ===== SPLIT LAYOUT ===== */}
      <section className="section-dark section-pad" style={{ paddingTop: 40 }}>
        <div className="container">
          <div
            className="contact-split"
            style={{
              display: "grid",
              gridTemplateColumns: "0.4fr 1fr",
              gap: 0,
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
              border: "1px solid var(--line-dark)",
            }}
          >
            {/* Left: Dark Info Panel */}
            <div
              style={{
                background: "var(--void-soft)",
                padding: 60,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h2 className="heading-lg" style={{ marginBottom: 40 }}>
                  Get in Touch
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <a
                    href={`tel:+${settings["brand.whatsapp"]}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "18px 0",
                      borderBottom: "1px solid var(--line-dark)",
                      fontSize: 14,
                      color: "var(--text-dim)",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-dim)"; }}
                  >
                    <Phone size={18} style={{ color: "var(--accent)", flexShrink: 0 }} />
                    {settings["brand.phone"]}
                  </a>
                  <a
                    href={`https://wa.me/${settings["brand.whatsapp"]}?text=${whatsappText}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "18px 0",
                      borderBottom: "1px solid var(--line-dark)",
                      fontSize: 14,
                      color: "var(--text-dim)",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-dim)"; }}
                  >
                    <ArrowUpRight size={18} style={{ color: "var(--accent)", flexShrink: 0 }} />
                    WhatsApp Chat
                  </a>
                  <a
                    href={`mailto:${settings["brand.email"]}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "18px 0",
                      borderBottom: "1px solid var(--line-dark)",
                      fontSize: 14,
                      color: "var(--text-dim)",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-dim)"; }}
                  >
                    <Mail size={18} style={{ color: "var(--accent)", flexShrink: 0 }} />
                    {settings["brand.email"]}
                  </a>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "18px 0",
                      fontSize: 14,
                      color: "var(--text-dim)",
                    }}
                  >
                    <MapPin size={18} style={{ color: "var(--accent)", flexShrink: 0 }} />
                    {settings["brand.address"]}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 40 }}>
                <Link to="/consultation" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  Book Consultation <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>

            {/* Right: Form Panel */}
            <div style={{ background: "var(--void)", padding: 60, borderLeft: "1px solid var(--line-dark)" }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                  <CheckCircle2 size={56} style={{ color: "var(--accent)", marginBottom: 24 }} />
                  <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
                    Message Received
                  </span>
                  <h2 className="heading-lg" style={{ marginBottom: 12 }}>
                    Thank you for contacting us.
                  </h2>
                  <p className="body-lg" style={{ maxWidth: 400, margin: "0 auto 32px" }}>
                    Your message is now in our admin dashboard. Our team will review it and respond using your contact details.
                  </p>
                  <button onClick={() => setSent(false)} className="btn btn-outline">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <div className="form-grid">
                    <div className="input-group">
                      <label htmlFor="name">Full Name</label>
                      <input id="name" name="name" type="text" placeholder="Your full name" required />
                    </div>
                    <div className="input-group">
                      <label htmlFor="email">Email Address</label>
                      <input id="email" name="email" type="email" placeholder="you@example.com" required />
                    </div>
                    <div className="input-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input id="phone" name="phone" type="tel" placeholder="+234 ..." />
                    </div>
                    <div className="input-group">
                      <label htmlFor="subject">Subject</label>
                      <input id="subject" name="subject" type="text" placeholder="What is this about?" required />
                    </div>
                    <div className="input-group full">
                      <label htmlFor="message">Message</label>
                      <textarea id="message" name="message" placeholder="Tell us about your project or enquiry..." required />
                    </div>
                  </div>
                  {error && <div className="form-error" style={{ marginTop: 20 }}>{error}</div>}
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={mutation.isPending}
                    style={{ marginTop: 24 }}
                  >
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
