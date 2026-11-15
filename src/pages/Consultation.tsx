import { useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, ChevronRight } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { usePage } from "@/lib/site";

export default function Consultation() {
  const { page } = usePage("consultation");
  const [stage, setStage] = useState<"form" | "success" | "payment" | "confirm">("form");
  const [data, setData] = useState<{
    name: string; email: string; phone: string; reference: string; agreedFee: number;
  } | null>(null);
  const [error, setError] = useState("");
  // CORRECTED: use bookConsultation (not book)
  const mutation = trpc.public.bookConsultation.useMutation({
    onSuccess: (res) => {
      setData({ name: res.name || "", email: res.email || "", phone: res.phone || "", reference: res.reference, agreedFee: res.agreedFee });
      setStage("success");
    },
    onError: (err) => setError(err.message),
  });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = event.currentTarget;
    const fd = new FormData(form);
    const projectType = String(fd.get("projectType"));
    // Map frontend fields to backend fields
    mutation.mutate({
      name: String(fd.get("name")),
      email: String(fd.get("email")),
      phone: String(fd.get("phone")),
      company: String(fd.get("company") || ""),
      type: projectType,
      projectCategory: projectType,
      projectLocation: String(fd.get("location")),
      description: String(fd.get("message")),
      preferredDate: String(fd.get("preferredDate") || new Date().toISOString().split("T")[0]),
      preferredTime: "Flexible",
    });
  }

  if (stage === "success" && data) {
    return (
      <section className="section-dark" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 5vw 60px" }}>
        <div style={{ maxWidth: 600, textAlign: "center" }}>
          <CheckCircle2 size={64} style={{ color: "var(--accent)", marginBottom: 28 }} />
          <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
            Booking Confirmed
          </span>
          <h2 className="display-md" style={{ marginBottom: 16 }}>
            Your consultation is booked.
          </h2>
          <p className="body-lg" style={{ marginBottom: 32 }}>
            A member of our team will contact you within 24 hours to confirm the details and schedule your site visit.
          </p>
          <div
            style={{
              background: "var(--void-soft)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--line-dark)",
              padding: 32,
              textAlign: "left",
              marginBottom: 32,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 12, borderBottom: "1px solid var(--line-dark)", marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Reference</span>
              <span style={{ fontSize: 14, color: "var(--text)", fontFamily: "var(--font-display)" }}>{data.reference}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 12, borderBottom: "1px solid var(--line-dark)", marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Name</span>
              <span style={{ fontSize: 14, color: "var(--text)" }}>{data.name}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 12, borderBottom: "1px solid var(--line-dark)", marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Email</span>
              <span style={{ fontSize: 14, color: "var(--text)" }}>{data.email}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Consultation Fee</span>
              <span style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>
                {data.agreedFee > 0 ? `₦${data.agreedFee.toLocaleString()}` : "Free"}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {data.agreedFee > 0 ? (
              <button className="btn btn-primary" onClick={() => setStage("payment")}>
                Pay Consultation Fee <ArrowUpRight size={16} />
              </button>
            ) : null}
            <a href="/" className="btn btn-outline">Back to Home</a>
          </div>
        </div>
      </section>
    );
  }

  if (stage === "payment" && data) {
    return (
      <section className="section-dark" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 5vw 60px" }}>
        <div style={{ maxWidth: 500, width: "100%" }}>
          <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>Payment</span>
          <h2 className="display-md" style={{ marginBottom: 12 }}>Consultation Fee</h2>
          <p className="body-lg" style={{ marginBottom: 32 }}>
            Secure your slot with a fully refundable consultation fee. This covers site assessment and initial planning.
          </p>
          <div style={{ background: "var(--void-soft)", borderRadius: "var(--radius-lg)", border: "1px solid var(--line-dark)", padding: 32, marginBottom: 24 }}>
            <h3 className="heading-md" style={{ marginBottom: 16 }}>Bank Transfer</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, borderBottom: "1px solid var(--line-dark)" }}>
                <span style={{ color: "var(--text-faint)" }}>Bank Name</span>
                <span style={{ color: "var(--text)" }}>Access Bank PLC</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, borderBottom: "1px solid var(--line-dark)" }}>
                <span style={{ color: "var(--text-faint)" }}>Account Number</span>
                <span style={{ color: "var(--text)" }}>1234567890</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, borderBottom: "1px solid var(--line-dark)" }}>
                <span style={{ color: "var(--text-faint)" }}>Account Name</span>
                <span style={{ color: "var(--text)" }}>SR Construction Ltd</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-faint)" }}>Amount</span>
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>₦{data.agreedFee.toLocaleString()}</span>
              </div>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 16 }}>Reference: <strong style={{ color: "var(--text)" }}>{data.reference}</strong></p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn btn-outline" onClick={() => setStage("success")}>I'll Pay Later</button>
            <button className="btn btn-primary" onClick={() => setStage("confirm")}>I've Paid <ArrowUpRight size={16} /></button>
          </div>
        </div>
      </section>
    );
  }

  if (stage === "confirm") {
    return (
      <section className="section-dark" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 5vw 60px" }}>
        <div style={{ maxWidth: 500, textAlign: "center" }}>
          <CheckCircle2 size={64} style={{ color: "var(--accent)", marginBottom: 24 }} />
          <h2 className="display-md" style={{ marginBottom: 12 }}>Payment Submitted</h2>
          <p className="body-lg" style={{ marginBottom: 32 }}>
            Thank you. Our team will verify your payment and confirm your consultation slot within 24 hours.
          </p>
          <a href="/" className="btn btn-primary">Back to Home <ArrowUpRight size={16} /></a>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="section-dark hero-pad-sm" style={{ padding: "160px 5vw 60px" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: 800 }}>
          <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
            {page.kicker || "Start Your Project"}
          </span>
          <h1 className="display-lg" style={{ marginBottom: 20 }}>
            {page.title || "Book a Consultation"}
          </h1>
          <p className="body-lg" style={{ fontSize: 18 }}>
            {page.body || "Tell us about your project. We'll review and schedule a focused conversation about scope, timeline and next steps."}
          </p>
        </div>
      </section>

      {/* ===== FORM ===== */}
      <section className="section-dark section-pad" style={{ paddingTop: 0 }}>
        <div className="container">
          <div
            style={{
              maxWidth: 800,
              margin: "0 auto",
              background: "var(--void-soft)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--line-dark)",
              padding: "clamp(32px, 5vw, 60px)",
            }}
          >
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
                  <input id="phone" name="phone" type="tel" placeholder="+234 ..." required />
                </div>
                <div className="input-group">
                  <label htmlFor="location">Project Location</label>
                  <input id="location" name="location" type="text" placeholder="City, State" required />
                </div>
                <div className="input-group">
                  <label htmlFor="projectType">Project Type</label>
                  <select id="projectType" name="projectType" required>
                    <option value="">Select project type</option>
                    <option value="Residential">Residential Building</option>
                    <option value="Commercial">Commercial Building</option>
                    <option value="Renovation">Renovation</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="company">Company (optional)</label>
                  <input id="company" name="company" type="text" placeholder="Your company name" />
                </div>
                <div className="input-group full">
                  <label htmlFor="preferredDate">Preferred Date</label>
                  <input id="preferredDate" name="preferredDate" type="date" />
                </div>
                <div className="input-group full">
                  <label htmlFor="message">Project Details</label>
                  <textarea id="message" name="message" placeholder="Tell us about your project — size, timeline, special requirements..." required />
                </div>
              </div>
              {error && <div className="form-error" style={{ marginTop: 20 }}>{error}</div>}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={mutation.isPending}
                style={{ marginTop: 24, width: "100%", justifyContent: "center" }}
              >
                {mutation.isPending ? "Booking..." : "Book Consultation"} <ArrowUpRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
