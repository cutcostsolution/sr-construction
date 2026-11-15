import { useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, ChevronRight } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { usePage } from "@/lib/site";

export default function Consultation() {
  const { page } = usePage("consultation");
  const [stage, setStage] = useState<"form" | "success" | "payment" | "confirm">("form");
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    projectType: "",
    budgetRange: "",
    preferredDate: "",
    message: "",
  });
  const [error, setError] = useState("");
  const mutation = trpc.public.book.useMutation();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      const form = event.currentTarget;
      const fd = new FormData(form);
      const payload = {
        name: String(fd.get("name")),
        email: String(fd.get("email")),
        phone: String(fd.get("phone")),
        location: String(fd.get("location")),
        projectType: String(fd.get("projectType")),
        budgetRange: String(fd.get("budgetRange")),
        preferredDate: String(fd.get("preferredDate")),
        message: String(fd.get("message")),
      };
      await mutation.mutateAsync(payload);
      setData(payload);
      setStage("success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Booking failed. Please try again.");
    }
  }

  if (stage === "success") {
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
            <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div><span style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 4 }}>Name</span><span style={{ fontSize: 14, color: "var(--text)" }}>{data.name}</span></div>
              <div><span style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 4 }}>Email</span><span style={{ fontSize: 14, color: "var(--text)" }}>{data.email}</span></div>
              <div><span style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 4 }}>Phone</span><span style={{ fontSize: 14, color: "var(--text)" }}>{data.phone}</span></div>
              <div><span style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 4 }}>Project Type</span><span style={{ fontSize: 14, color: "var(--text)" }}>{data.projectType}</span></div>
              <div><span style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 4 }}>Preferred Date</span><span style={{ fontSize: 14, color: "var(--text)" }}>{data.preferredDate || "Flexible"}</span></div>
              <div><span style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 4 }}>Budget Range</span><span style={{ fontSize: 14, color: "var(--text)" }}>{data.budgetRange || "Not specified"}</span></div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => setStage("payment")}>
              Pay Consultation Fee <ArrowUpRight size={16} />
            </button>
            <a href="/" className="btn btn-outline">
              Back to Home
            </a>
          </div>
        </div>
      </section>
    );
  }

  if (stage === "payment") {
    return (
      <section className="section-dark" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 5vw 60px" }}>
        <div style={{ maxWidth: 500, width: "100%" }}>
          <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
            Payment
          </span>
          <h2 className="display-md" style={{ marginBottom: 12 }}>
            Consultation Fee
          </h2>
          <p className="body-lg" style={{ marginBottom: 32 }}>
            Secure your slot with a fully refundable ₦20,000 consultation fee. This covers site assessment and initial planning.
          </p>
          <div
            style={{
              background: "var(--void-soft)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--line-dark)",
              padding: 32,
              marginBottom: 24,
            }}
          >
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
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>₦20,000.00</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn btn-outline" onClick={() => setStage("success")}>
              I'll Pay Later
            </button>
            <button className="btn btn-primary" onClick={() => setStage("confirm")}>
              I've Paid <ArrowUpRight size={16} />
            </button>
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
          <h2 className="display-md" style={{ marginBottom: 12 }}>
            Payment Submitted
          </h2>
          <p className="body-lg" style={{ marginBottom: 32 }}>
            Thank you. Our team will verify your payment and confirm your consultation slot within 24 hours.
          </p>
          <a href="/" className="btn btn-primary">
            Back to Home <ArrowUpRight size={16} />
          </a>
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
              padding: 60,
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
                  <label htmlFor="budgetRange">Budget Range</label>
                  <select id="budgetRange" name="budgetRange">
                    <option value="">Select budget range</option>
                    <option value="Below ₦5M">Below ₦5 Million</option>
                    <option value="₦5M - ₦20M">₦5M - ₦20 Million</option>
                    <option value="₦20M - ₦50M">₦20M - ₦50 Million</option>
                    <option value="₦50M - ₦100M">₦50M - ₦100 Million</option>
                    <option value="Above ₦100M">Above ₦100 Million</option>
                  </select>
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
