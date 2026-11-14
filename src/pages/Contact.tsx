import { useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { usePage } from "@/lib/site";

export default function Contact() {
  const { page, settings } = usePage("contact");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const mutation = trpc.public.enquiry.useMutation();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    const form = event.currentTarget; const data = new FormData(form);
    try {
      await mutation.mutateAsync({ name: String(data.get("name")), email: String(data.get("email")), phone: String(data.get("phone") || ""), subject: String(data.get("subject")), message: String(data.get("message")) });
      setSent(true); form.reset();
    } catch (e) { setError(e instanceof Error ? e.message : "Your message could not be sent. Please try again."); }
  }

  const whatsappText = encodeURIComponent("Hello SR Construction, I would like to make an enquiry.");

  return <>
    {/* ===== CONTACT HERO — MINIMAL ===== */}
    <section style={{ padding: "140px 5vw 40px", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
      <span className="eyebrow">Contact Us</span>
      <h1 style={{ margin: "16px 0 16px" }}>{page.title}</h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.8 }}>{page.body}</p>
    </section>

    {/* ===== SPLIT LAYOUT ===== */}
    <section className="contact-layout">
      <div className="contact-info">
        <h2>Get in Touch</h2>
        <a href={`tel:+${settings["brand.whatsapp"]}`}><Phone size={18} /> {settings["brand.phone"]}</a>
        <a href={`https://wa.me/${settings["brand.whatsapp"]}?text=${whatsappText}`} target="_blank" rel="noreferrer"><ArrowUpRight size={18} /> Start a WhatsApp chat</a>
        <a href={`mailto:${settings["brand.email"]}`}><Mail size={18} /> {settings["brand.email"]}</a>
        <a href="#" onClick={e => e.preventDefault()}><MapPin size={18} /> {settings["brand.address"]}</a>
        <div style={{ marginTop: 40 }}>
          <Link to="/consultation" className="button button-gold" style={{ width: "100%", justifyContent: "center" }}>Book Consultation <ArrowUpRight /></Link>
        </div>
      </div>
      <div className="contact-form-wrap">
        {sent ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <CheckCircle2 size={48} color="var(--burgundy)" style={{ marginBottom: 20 }} />
            <span className="eyebrow">Message Received</span>
            <h2 style={{ margin: "16px 0 12px" }}>Thank you for contacting us.</h2>
            <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.8, marginBottom: 30 }}>Your message is now in our admin dashboard. Our team will review it and respond using your contact details.</p>
            <button onClick={() => setSent(false)} className="button">Send Another Message <ArrowUpRight /></button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div style={{ textAlign: "center", marginBottom: 30 }}>
              <span className="eyebrow">General Enquiry</span>
              <h2 style={{ marginTop: 12 }}>Send us a message.</h2>
            </div>
            <div className="form-grid">
              <div className="input-group">
                <label>Full name *</label>
                <input name="name" required />
              </div>
              <div className="input-group">
                <label>Email address *</label>
                <input name="email" type="email" required />
              </div>
              <div className="input-group">
                <label>Phone number *</label>
                <input name="phone" type="tel" required />
              </div>
              <div className="input-group">
                <label>Subject *</label>
                <input name="subject" required />
              </div>
              <div className="input-group full">
                <label>Your message *</label>
                <textarea name="message" required style={{ minHeight: 140 }} />
              </div>
              {error && <div className="form-error full">{error}</div>}
              <div className="full">
                <button className="button" type="submit" disabled={mutation.isPending} style={{ width: "100%", justifyContent: "center" }}>
                  {mutation.isPending ? "Sending…" : "Send Message"} <ArrowUpRight />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  </>;
}
