import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check, CheckCircle2, Copy, FileUp, LockKeyhole, Search } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { money, toBase64, usePage } from "@/lib/site";

type BookingResult = {
  reference: string; email: string; agreedFee: number;
  bank: { bankName: string; accountName: string; accountNumber: string } | null;
};

function BankDetails({ booking }: { booking: BookingResult }) {
  const [copied, setCopied] = useState(false);
  if (!booking.bank) return null;
  async function copyAccount() {
    await navigator.clipboard.writeText(booking.bank!.accountNumber); setCopied(true); setTimeout(() => setCopied(false), 1500);
  }
  return <div style={{ background: "var(--cream)", padding: 30, borderRadius: "var(--radius-lg)", marginTop: 30, border: "1px solid var(--line)" }}>
    <span className="eyebrow">Bank Transfer Instructions</span>
    <h3 style={{ margin: "12px 0 20px" }}>Pay {money(booking.agreedFee)}</h3>
    <div style={{ display: "grid", gap: 16 }}>
      <div><dt style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--muted)", marginBottom: 4 }}>Bank name</dt><dd style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{booking.bank.bankName}</dd></div>
      <div><dt style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--muted)", marginBottom: 4 }}>Account name</dt><dd style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{booking.bank.accountName}</dd></div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div><dt style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--muted)", marginBottom: 4 }}>Account number</dt><dd style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{booking.bank.accountNumber}</dd></div>
        <button onClick={copyAccount} style={{ background: "var(--burgundy)", color: "white", border: "none", padding: "8px 16px", borderRadius: "var(--radius-sm)", cursor: "pointer", fontSize: 12 }}>{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}</button>
      </div>
    </div>
    <p style={{ marginTop: 20, fontSize: 13, color: "var(--muted)" }}>Use <strong style={{ color: "var(--burgundy)" }}>{booking.reference}</strong> as your payment reference where possible.</p>
  </div>;
}

function EvidenceUpload({ booking }: { booking: BookingResult }) {
  const [file, setFile] = useState<File | null>(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const mutation = trpc.public.submitPayment.useMutation();
  async function submit() {
    if (!file) { setError("Choose your transfer receipt or evidence first."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("The file must be 5MB or smaller."); return; }
    setError("");
    try {
      await mutation.mutateAsync({ reference: booking.reference, email: booking.email, evidence: { name: file.name, contentType: file.type, contentBase64: await toBase64(file) } });
      setDone(true);
    } catch (e) { setError(e instanceof Error ? e.message : "Upload failed. Please try again."); }
  }
  if (done) return <div style={{ background: "rgba(45,106,79,0.08)", padding: 30, borderRadius: "var(--radius-lg)", marginTop: 20, display: "flex", gap: 16, alignItems: "flex-start" }}>
    <CheckCircle2 size={24} color="#2d6a4f" />
    <div><h3 style={{ marginBottom: 8 }}>Evidence submitted for review.</h3><p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, margin: 0 }}>Your payment is <strong>not yet verified</strong>. An authorised administrator will review the evidence and update your booking.</p></div>
  </div>;
  return <div style={{ background: "var(--cream)", padding: 30, borderRadius: "var(--radius-lg)", marginTop: 20, border: "1px solid var(--line)" }}>
    <span className="eyebrow">After Making the Transfer</span>
    <h3 style={{ margin: "12px 0 20px" }}>Upload your payment evidence.</h3>
    <label style={{ display: "block", border: "2px dashed var(--line)", borderRadius: "var(--radius-lg)", padding: 30, textAlign: "center", cursor: "pointer", transition: "all .2s", background: "var(--warm-white)" }}>
      <FileUp size={28} color="var(--burgundy)" style={{ marginBottom: 12 }} />
      <span style={{ display: "block", fontSize: 14, color: "var(--ink)", marginBottom: 4 }}>{file ? file.name : "Choose receipt or screenshot"}</span>
      <input type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" style={{ display: "none" }} onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
    </label>
    <small style={{ color: "var(--muted)", fontSize: 12, display: "block", marginTop: 8 }}>JPG, PNG, WEBP or PDF. Maximum 5MB.</small>
    {error && <p className="form-error" style={{ marginTop: 12 }}>{error}</p>}
    <button className="button" onClick={submit} disabled={mutation.isPending} style={{ marginTop: 20, width: "100%", justifyContent: "center" }}>{mutation.isPending ? "Uploading securely…" : "Submit evidence for verification"}</button>
  </div>;
}

function BookingLookup() {
  const [details, setDetails] = useState<{ reference: string; email: string } | null>(null);
  const query = trpc.public.booking.useQuery(details!, { enabled: !!details, retry: false });
  const result = query.data ? { reference: query.data.consultation.reference, email: query.data.client.email, agreedFee: query.data.consultation.agreedFee, bank: query.data.bank } : null;
  function find(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    setDetails({ reference: String(data.get("reference")).trim(), email: String(data.get("email")).trim() });
  }
  return <div>
    <span className="eyebrow">Existing Booking</span>
    <h2 style={{ margin: "12px 0 24px" }}>Find your consultation.</h2>
    <form onSubmit={find}>
      <div className="form-grid">
        <div className="input-group"><label>Booking reference</label><input name="reference" placeholder="SRC-…" required /></div>
        <div className="input-group"><label>Email used for booking</label><input name="email" type="email" required /></div>
        <div className="full"><button className="button" type="submit" style={{ width: "100%", justifyContent: "center" }}><Search size={16} /> Find Booking</button></div>
      </div>
    </form>
    {query.isFetching && <p style={{ textAlign: "center", marginTop: 20, color: "var(--muted)" }}>Checking your booking…</p>}
    {query.error && <p className="form-error" style={{ marginTop: 12 }}>{query.error.message}</p>}
    {query.data && <div style={{ marginTop: 30, background: "var(--cream)", padding: 30, borderRadius: "var(--radius-lg)", border: "1px solid var(--line)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div><span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--muted)" }}>Status</span><strong style={{ display: "block", marginTop: 4, fontSize: 16 }}>{query.data.consultation.status.replaceAll("_", " ")}</strong></div>
        <div><span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--muted)" }}>Preferred date</span><strong style={{ display: "block", marginTop: 4, fontSize: 16 }}>{query.data.consultation.preferredDate} · {query.data.consultation.preferredTime}</strong></div>
        <div><span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--muted)" }}>Fee</span><strong style={{ display: "block", marginTop: 4, fontSize: 16 }}>{query.data.consultation.agreedFee ? money(query.data.consultation.agreedFee) : "Free consultation"}</strong></div>
        {query.data.payment && <div><span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--muted)" }}>Payment</span><strong style={{ display: "block", marginTop: 4, fontSize: 16 }}>{query.data.payment.status.replaceAll("_", " ")}</strong></div>}
      </div>
      {result && query.data.payment && query.data.payment.status !== "verified" && <><BankDetails booking={result} /><EvidenceUpload booking={result} /></>}
    </div>}
  </div>;
}

export default function Consultation() {
  const { page, settings } = usePage("consultation");
  const [booking, setBooking] = useState<BookingResult | null>(null);
  const [error, setError] = useState("");
  const [lookup, setLookup] = useState(false);
  const mutation = trpc.public.bookConsultation.useMutation();
  const isPaid = settings["consultation.mode"] === "paid";
  const fee = isPaid ? Number(settings["consultation.fee"] || 0) : 0;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    const data = new FormData(event.currentTarget);
    try {
      const result = await mutation.mutateAsync({
        name: String(data.get("name")), email: String(data.get("email")), phone: String(data.get("phone")), company: String(data.get("company") || ""),
        type: String(data.get("type")), projectCategory: String(data.get("projectCategory")), projectLocation: String(data.get("projectLocation")),
        description: String(data.get("description")), preferredDate: String(data.get("preferredDate")), preferredTime: String(data.get("preferredTime")),
      });
      setBooking(result); window.scrollTo({ top: 500, behavior: "smooth" });
    } catch (e) { setError(e instanceof Error ? e.message : "Your booking could not be submitted. Please try again."); }
  }

  return <>
    {/* ===== CONSULTATION HERO — MINIMAL ===== */}
    <section className="consult-page">
      <span className="eyebrow">Project Consultation</span>
      <h1 style={{ textAlign: "center", margin: "16px 0 12px" }}>{page.title}</h1>
      <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 17, lineHeight: 1.8, marginBottom: 50 }}>{page.body}</p>

      <div style={{ display: "grid", gridTemplateColumns: ".35fr 1fr", gap: 40, alignItems: "start" }}>
        {/* Sidebar */}
        <div style={{ background: "var(--burgundy)", color: "var(--warm-white)", padding: 40, borderRadius: "var(--radius-xl)", position: "sticky", top: 100 }}>
          <span className="eyebrow light" style={{ marginBottom: 20, display: "inline-block" }}>What Happens Next</span>
          <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <span style={{ fontFamily: "Cinzel,serif", fontSize: 24, color: "var(--gold)", display: "block", marginBottom: 8 }}>01</span>
              <strong style={{ fontSize: 15, display: "block", marginBottom: 6 }}>Send your request</strong>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.6 }}>Fill the form with your project details.</p>
            </li>
            <li style={{ padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <span style={{ fontFamily: "Cinzel,serif", fontSize: 24, color: "var(--gold)", display: "block", marginBottom: 8 }}>02</span>
              <strong style={{ fontSize: 15, display: "block", marginBottom: 6 }}>{isPaid ? "Secure your slot" : "Admin review"}</strong>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.6 }}>{isPaid ? `Transfer ${money(fee)} and upload evidence.` : "Your request appears in our dashboard immediately."}</p>
            </li>
            <li style={{ padding: "16px 0" }}>
              <span style={{ fontFamily: "Cinzel,serif", fontSize: 24, color: "var(--gold)", display: "block", marginBottom: 8 }}>03</span>
              <strong style={{ fontSize: 15, display: "block", marginBottom: 6 }}>Receive confirmation</strong>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.6 }}>We confirm your date, time and consultant.</p>
            </li>
          </ol>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <LockKeyhole size={16} color="var(--gold)" />
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: 0 }}>Your information is handled privately.</p>
          </div>
        </div>

        {/* Form Area */}
        <div>
          <button onClick={() => setLookup(!lookup)} style={{ background: "var(--warm-white)", border: "1px solid var(--line)", padding: "12px 20px", borderRadius: "var(--radius-md)", cursor: "pointer", fontSize: 13, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            {lookup ? "Book a new consultation" : "Already booked? Find your booking"} <ArrowUpRight size={14} />
          </button>

          {lookup ? <div className="consult-form"><BookingLookup /></div> : booking ? (
            <div className="consult-form" style={{ textAlign: "center", padding: "50px 30px" }}>
              <CheckCircle2 size={48} color="var(--burgundy)" style={{ marginBottom: 20 }} />
              <span className="eyebrow">Request Received</span>
              <h2 style={{ margin: "16px 0 12px" }}>Your consultation is in our dashboard.</h2>
              <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.8, marginBottom: 30 }}>Your booking reference is <strong style={{ color: "var(--burgundy)" }}>{booking.reference}</strong>. The agreed fee is <strong>{booking.agreedFee ? money(booking.agreedFee) : "free"}</strong>.</p>
              <div style={{ background: "var(--cream)", padding: 20, borderRadius: "var(--radius-lg)", marginBottom: 30, border: "1px solid var(--line)" }}>
                <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--muted)" }}>Current Status</span>
                <strong style={{ display: "block", marginTop: 8, fontSize: 18 }}>New request · Awaiting admin confirmation</strong>
              </div>
              {booking.agreedFee > 0 && <><BankDetails booking={booking} /><EvidenceUpload booking={booking} /></>}
            </div>
          ) : (
            <form onSubmit={submit} className="consult-form">
              <div style={{ textAlign: "center", marginBottom: 30 }}>
                <span className="eyebrow">Project Consultation</span>
                <h2 style={{ marginTop: 12 }}>Tell us what you are planning.</h2>
                <p style={{ color: "var(--muted)", fontSize: 15, marginTop: 8 }}>{isPaid ? `The current consultation fee is ${money(fee)}.` : "The current consultation is free of charge."}</p>
              </div>
              <div className="form-grid">
                <div className="input-group"><label>Full name *</label><input name="name" autoComplete="name" required /></div>
                <div className="input-group"><label>Email address *</label><input name="email" type="email" autoComplete="email" required /></div>
                <div className="input-group"><label>Phone / WhatsApp number *</label><input name="phone" type="tel" autoComplete="tel" required /></div>
                <div className="input-group"><label>Company (optional)</label><input name="company" /></div>
                <div className="input-group">
                  <label>Consultation type *</label>
                  <select name="type" required><option value="">Select one</option><option>New project discussion</option><option>Design & build review</option><option>Structural / technical review</option><option>BOQ & project cost discussion</option><option>Existing project review</option></select>
                </div>
                <div className="input-group">
                  <label>Project category *</label>
                  <select name="projectCategory" required><option value="">Select one</option><option>Residential home / duplex</option><option>Apartments / estate</option><option>Commercial / mixed-use</option><option>Hospitality / hotel</option><option>Institutional facility</option><option>Sports facility / turf</option><option>Other construction project</option></select>
                </div>
                <div className="input-group"><label>Project location *</label><input name="projectLocation" placeholder="City, State" required /></div>
                <div className="input-group"><label>Preferred date *</label><input name="preferredDate" type="date" min={new Date().toISOString().split("T")[0]} required /></div>
                <div className="input-group">
                  <label>Preferred time *</label>
                  <select name="preferredTime" required><option value="">Select one</option><option>9:00 AM – 11:00 AM</option><option>11:00 AM – 1:00 PM</option><option>2:00 PM – 4:00 PM</option></select>
                </div>
                <div className="input-group full">
                  <label>Brief project details *</label>
                  <textarea name="description" placeholder="What do you want to build? What stage are you at?" required style={{ minHeight: 120 }} />
                </div>
                {error && <div className="form-error full">{error}</div>}
                <div className="full">
                  <button className="button" type="submit" disabled={mutation.isPending} style={{ width: "100%", justifyContent: "center" }}>
                    {mutation.isPending ? "Booking…" : "Book Your Consultation"} <ArrowUpRight />
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  </>;
}
