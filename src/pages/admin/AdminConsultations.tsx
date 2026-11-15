import { useMemo, useState, type FormEvent } from "react";
import { Check, Download, Eye, FileDown, X } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { dateText, label, money } from "@/lib/site";

type Row = {
  consultation: { id: number; reference: string; type: string; projectCategory: string; projectLocation: string; description: string; preferredDate: string; preferredTime: string; agreedFee: number; status: "new_request" | "pending_confirmation" | "confirmed" | "rescheduled" | "completed" | "cancelled"; notes: string | null; createdAt: Date };
  client: { name: string; email: string; phone: string; company: string | null };
  payment: { id: number; amount: number; status: "awaiting_payment" | "evidence_submitted" | "under_verification" | "verified" | "rejected"; evidenceKey: string | null; evidenceName: string | null; rejectionReason: string | null } | null;
};

export default function AdminConsultations() {
  const query = trpc.admin.consultations.useQuery();
  const utils = trpc.useUtils();
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const rows = (query.data ?? []) as Row[];
  const selected = rows.find((r) => r.consultation.id === selectedId) ?? null;
  const filtered = useMemo(() => rows.filter((r) => filter === "all" || r.consultation.status === filter || r.payment?.status === filter), [rows, filter]);
  const update = trpc.admin.updateConsultation.useMutation({ onSuccess: () => utils.admin.consultations.invalidate() });
  const payment = trpc.admin.updatePayment.useMutation({ onSuccess: () => { utils.admin.consultations.invalidate(); utils.admin.dashboard.invalidate(); } });
  const evidence = trpc.admin.evidenceUrl.useMutation();
  const exportQuery = trpc.admin.exportConsultations.useQuery(undefined, { enabled: false });

  async function downloadCsv() {
    const result = await exportQuery.refetch();
    if (!result.data) return;
    const blob = new Blob([result.data.csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = result.data.filename; a.click(); URL.revokeObjectURL(url);
  }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!selected) return; const data = new FormData(event.currentTarget);
    update.mutate({ id: selected.consultation.id, status: String(data.get("status")) as Row["consultation"]["status"], preferredDate: String(data.get("preferredDate")), preferredTime: String(data.get("preferredTime")), notes: String(data.get("notes") || "") });
  }
  function setPayment(status: string) {
    if (!selected?.payment) return;
    const rejectionReason = status === "rejected" ? window.prompt("Why is this payment evidence being rejected?") || "" : undefined;
    payment.mutate({ id: selected.payment.id, status: status as "verified" | "rejected" | "under_verification", rejectionReason });
  }
  async function viewEvidence(key: string) {
    const result = await evidence.mutateAsync({ key }); window.open(result.url, "_blank", "noopener,noreferrer");
  }

  return <div>
    {/* Header */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 30, flexWrap: "wrap", gap: 16 }}>
      <div>
        <span className="eyebrow">Consultation Pipeline</span>
        <h1 style={{ margin: "12px 0 8px", fontSize: 28 }}>Bookings & Payment Review</h1>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>Confirm schedules, keep internal notes and verify bank-transfer evidence.</p>
      </div>
      <button className="button button-outline" onClick={downloadCsv} disabled={exportQuery.isFetching}><FileDown size={16} /> {exportQuery.isFetching ? "Preparing…" : "Export CSV"}</button>
    </div>

    {/* Filter */}
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
      <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: "10px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--line)", background: "var(--warm-white)", fontSize: 13 }}>
        <option value="all">All bookings</option><option value="new_request">New requests</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="evidence_submitted">Evidence submitted</option><option value="verified">Payment verified</option><option value="rejected">Payment rejected</option>
      </select>
      <span style={{ fontSize: 13, color: "var(--muted)" }}>{filtered.length} records</span>
    </div>

    {/* Table */}
    <div className="admin-card">
      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead><tr><th>Reference / Client</th><th>Project</th><th>Schedule</th><th>Fee / Payment</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.consultation.id}>
                <td><strong style={{ fontSize: 14 }}>{row.consultation.reference}</strong><br/><small style={{ color: "var(--muted)" }}>{row.client.name}</small></td>
                <td>{row.consultation.projectCategory}<br/><small style={{ color: "var(--muted)" }}>{row.consultation.projectLocation}</small></td>
                <td>{row.consultation.preferredDate}<br/><small style={{ color: "var(--muted)" }}>{row.consultation.preferredTime}</small></td>
                <td>{row.consultation.agreedFee ? money(row.consultation.agreedFee) : "Free"}{row.payment && <><br/><small style={{ color: "var(--muted)" }}>{label(row.payment.status)}</small></>}</td>
                <td><span className={`status-badge ${row.consultation.status.replaceAll("_", "-")}`}>{label(row.consultation.status)}</span></td>
                <td><button onClick={() => setSelectedId(row.consultation.id)} style={{ background: "var(--burgundy-soft)", border: "none", padding: "8px 14px", borderRadius: "var(--radius-sm)", cursor: "pointer", fontSize: 12, color: "var(--burgundy)", display: "flex", alignItems: "center", gap: 6 }}><Eye size={14} /> Manage</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--muted)", fontSize: 14 }}>No bookings match this view.</div>}
    </div>

    {/* Drawer */}
    {selected && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", justifyContent: "flex-end" }} onClick={() => setSelectedId(null)}>
      <aside style={{ width: 480, maxWidth: "100%", background: "var(--warm-white)", height: "100%", overflow: "auto", padding: 30, boxShadow: "-4px 0 30px rgba(0,0,0,0.1)" }} onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setSelectedId(null)} style={{ background: "none", border: "none", cursor: "pointer", marginBottom: 20 }}><X size={20} /></button>
        <span className="eyebrow">{selected.consultation.reference}</span>
        <h2 style={{ margin: "12px 0 4px", fontSize: 24 }}>{selected.client.name}</h2>
        <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 20 }}>Received {dateText(selected.consultation.createdAt)}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          <a href={`mailto:${selected.client.email}`} style={{ fontSize: 14, color: "var(--burgundy)" }}>{selected.client.email}</a>
          <a href={`tel:${selected.client.phone}`} style={{ fontSize: 14, color: "var(--burgundy)" }}>{selected.client.phone}</a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24, background: "var(--cream)", padding: 20, borderRadius: "var(--radius-lg)" }}>
          <div><dt style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--muted)" }}>Consultation</dt><dd style={{ margin: "4px 0 0", fontSize: 14 }}>{selected.consultation.type}</dd></div>
          <div><dt style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--muted)" }}>Project</dt><dd style={{ margin: "4px 0 0", fontSize: 14 }}>{selected.consultation.projectCategory}</dd></div>
          <div><dt style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--muted)" }}>Location</dt><dd style={{ margin: "4px 0 0", fontSize: 14 }}>{selected.consultation.projectLocation}</dd></div>
          <div><dt style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--muted)" }}>Agreed fee</dt><dd style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 600 }}>{selected.consultation.agreedFee ? money(selected.consultation.agreedFee) : "Free"}</dd></div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--muted)", display: "block", marginBottom: 8 }}>Project Brief</span>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink)" }}>{selected.consultation.description}</p>
        </div>

        {selected.payment && <div style={{ background: "var(--cream)", padding: 24, borderRadius: "var(--radius-lg)", marginBottom: 24, border: "1px solid var(--line)" }}>
          <span className="eyebrow">Payment Review</span>
          <h3 style={{ margin: "12px 0 16px" }}>{money(selected.payment.amount)} · {label(selected.payment.status)}</h3>
          {selected.payment.evidenceKey && <button className="button button-outline" onClick={() => viewEvidence(selected.payment!.evidenceKey!)} style={{ marginBottom: 16 }}><Download size={14} /> View {selected.payment.evidenceName || "evidence"}</button>}
          {selected.payment.rejectionReason && <p className="form-error" style={{ marginBottom: 16 }}>{selected.payment.rejectionReason}</p>}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => setPayment("under_verification")} style={{ padding: "10px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--line)", background: "var(--warm-white)", cursor: "pointer", fontSize: 12 }}>Mark Under Review</button>
            <button onClick={() => setPayment("verified")} style={{ padding: "10px 16px", borderRadius: "var(--radius-sm)", border: "none", background: "var(--burgundy)", color: "white", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}><Check size={14} /> Verify Payment</button>
            <button onClick={() => setPayment("rejected")} style={{ padding: "10px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--burgundy)", background: "transparent", color: "var(--burgundy)", cursor: "pointer", fontSize: 12 }}>Reject Evidence</button>
          </div>
          <small style={{ display: "block", marginTop: 12, color: "var(--muted)", fontSize: 11 }}>Only use "Verify payment" after checking the bank transaction.</small>
        </div>}

        <form key={selected.consultation.id} onSubmit={save}>
          <span className="eyebrow">Booking Management</span>
          <div className="input-group" style={{ marginTop: 16 }}>
            <label>Consultation status</label>
            <select name="status" defaultValue={selected.consultation.status}>
              {["new_request","pending_confirmation","confirmed","rescheduled","completed","cancelled"].map((s) => <option key={s} value={s}>{label(s)}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Preferred / confirmed date</label>
            <input name="preferredDate" defaultValue={selected.consultation.preferredDate} />
          </div>
          <div className="input-group">
            <label>Preferred / confirmed time</label>
            <input name="preferredTime" defaultValue={selected.consultation.preferredTime} />
          </div>
          <div className="input-group">
            <label>Internal notes</label>
            <textarea name="notes" defaultValue={selected.consultation.notes ?? ""} style={{ minHeight: 100 }} />
          </div>
          <button className="button" type="submit" disabled={update.isPending} style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>{update.isPending ? "Saving…" : "Save Booking Changes"}</button>
          {update.isSuccess && <p className="form-success" style={{ marginTop: 12 }}>Booking updated.</p>}
        </form>
      </aside>
    </div>}
  </div>;
}
