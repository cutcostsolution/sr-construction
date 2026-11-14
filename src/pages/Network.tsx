import { useState, type FormEvent } from "react";
import { CheckCircle2, ArrowUpRight } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { toBase64, usePage } from "@/lib/site";
import { ConsultationCTA } from "@/components/SiteLayout";

export default function Network() {
  const { page } = usePage("network");
  const [type, setType] = useState<"business" | "professional">("business");
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const mutation = trpc.public.networkApplication.useMutation();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    const form = event.currentTarget;
    const values = new FormData(form);
    const file = (values.get("document") as File | null);
    try {
      const documentFile = file?.size ? { name: file.name, contentType: file.type, contentBase64: await toBase64(file) } : undefined;
      const result = await mutation.mutateAsync({
        type, name: String(values.get("name")), contactName: String(values.get("contactName")),
        email: String(values.get("email")), phone: String(values.get("phone")), location: String(values.get("location")),
        category: String(values.get("category")), affiliations: String(values.get("affiliations") || ""),
        servicesOffered: String(values.get("servicesOffered")), experience: String(values.get("experience") || ""),
        website: String(values.get("website") || ""), details: String(values.get("details") || ""), document: documentFile,
      });
      setReference(result.reference); form.reset(); window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) { setError(e instanceof Error ? e.message : "We could not submit your application. Please try again."); }
  }

  return <>
    {/* ===== NETWORK HERO — FULL IMAGE WITH BURGUNDY OVERLAY ===== */}
    <section className="network-hero">
      <img src={page.heroImage} alt="SR Construction network" />
      <div className="network-hero-inner">
        <span className="eyebrow light">Work With SR</span>
        <h1>{page.title}</h1>
        <p>{page.body}</p>
      </div>
    </section>

    {/* ===== INTRO ===== */}
    <section style={{ maxWidth: 900, margin: "80px auto", padding: "0 5vw", textAlign: "center" }}>
      <span className="eyebrow">Join Our Network</span>
      <h2 style={{ margin: "16px 0 20px" }}>Bring your capability.<br />Meet our standard.</h2>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.8 }}>Our network supports the quality of the work we deliver. Tell us what you do, where you operate and the experience you bring. Every application is reviewed privately by our admin team.</p>
    </section>

    {/* ===== APPLICATION FORM ===== */}
    <section style={{ maxWidth: 900, margin: "0 auto 80px", padding: "0 5vw" }}>
      {/* Type Selector */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 40 }}>
        <button onClick={() => setType("business")} style={{
          padding: "30px 24px", borderRadius: "var(--radius-lg)", border: type === "business" ? "2px solid var(--burgundy)" : "1px solid var(--line)",
          background: type === "business" ? "var(--burgundy-soft)" : "var(--warm-white)", cursor: "pointer", textAlign: "left", transition: "all .2s"
        }}>
          <span style={{ fontFamily: "Cinzel,serif", fontSize: 12, color: "var(--burgundy)", display: "block", marginBottom: 10 }}>01</span>
          <strong style={{ fontSize: 18, display: "block", marginBottom: 8, color: "var(--ink)" }}>Vendor or Business</strong>
          <p style={{ fontSize: 14, color: "var(--muted)", margin: 0 }}>Suppliers, contractors and service companies.</p>
        </button>
        <button onClick={() => setType("professional")} style={{
          padding: "30px 24px", borderRadius: "var(--radius-lg)", border: type === "professional" ? "2px solid var(--burgundy)" : "1px solid var(--line)",
          background: type === "professional" ? "var(--burgundy-soft)" : "var(--warm-white)", cursor: "pointer", textAlign: "left", transition: "all .2s"
        }}>
          <span style={{ fontFamily: "Cinzel,serif", fontSize: 12, color: "var(--burgundy)", display: "block", marginBottom: 10 }}>02</span>
          <strong style={{ fontSize: 18, display: "block", marginBottom: 8, color: "var(--ink)" }}>Artisan or Professional</strong>
          <p style={{ fontSize: 14, color: "var(--muted)", margin: 0 }}>Skilled tradespeople and built-environment professionals.</p>
        </button>
      </div>

      {/* Form */}
      <div style={{ background: "var(--warm-white)", padding: 50, borderRadius: "var(--radius-xl)", boxShadow: "0 8px 32px var(--shadow)", border: "1px solid var(--line)" }}>
        {reference ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <CheckCircle2 size={48} color="var(--burgundy)" style={{ marginBottom: 20 }} />
            <span className="eyebrow">Application Received</span>
            <h2 style={{ margin: "16px 0 12px" }}>Thank you. Our team will review it.</h2>
            <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.8, marginBottom: 30 }}>Your private reference is <strong style={{ color: "var(--burgundy)" }}>{reference}</strong>. Keep it for your records. We will contact you using the details supplied if we need more information.</p>
            <button className="button" onClick={() => setReference("")}>Submit Another Application <ArrowUpRight /></button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <span className="eyebrow">{type === "business" ? "Business Application" : "Professional Application"}</span>
              <h2 style={{ marginTop: 12 }}>Tell us about your work.</h2>
            </div>
            <div className="form-grid">
              <div className="input-group">
                <label>{type === "business" ? "Business name" : "Full name"} *</label>
                <input name="name" required />
              </div>
              <div className="input-group">
                <label>Contact person *</label>
                <input name="contactName" required />
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
                <label>Operating location *</label>
                <input name="location" required />
              </div>
              <div className="input-group">
                <label>{type === "business" ? "Business category" : "Trade or profession"} *</label>
                <input name="category" placeholder={type === "business" ? "e.g. Building materials supplier" : "e.g. Electrical engineer"} required />
              </div>
              <div className="input-group">
                <label>Relevant affiliations (optional)</label>
                <input name="affiliations" />
              </div>
              <div className="input-group">
                <label>Years of experience (optional)</label>
                <input name="experience" />
              </div>
              <div className="input-group full">
                <label>Website or portfolio (optional)</label>
                <input name="website" type="url" placeholder="https://" />
              </div>
              <div className="input-group full">
                <label>{type === "business" ? "Products or services offered" : "Services you offer"} *</label>
                <textarea name="servicesOffered" required style={{ minHeight: 100 }} />
              </div>
              <div className="input-group full">
                <label>Additional details (optional)</label>
                <textarea name="details" style={{ minHeight: 100 }} />
              </div>
              <div className="input-group full">
                <label>Supporting document (optional)</label>
                <input name="document" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" />
                <small style={{ color: "var(--muted)", fontSize: 12 }}>JPG, PNG, WEBP or PDF. Maximum 5MB.</small>
              </div>
              {error && <div className="form-error full">{error}</div>}
              <div className="full">
                <button className="button" type="submit" disabled={mutation.isPending} style={{ width: "100%", justifyContent: "center" }}>
                  {mutation.isPending ? "Sending…" : "Send Application for Review"} <ArrowUpRight />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>

    <ConsultationCTA title="Have a project rather than an application?" body="Book a consultation and tell us exactly what you want to build." />
  </>;
}
