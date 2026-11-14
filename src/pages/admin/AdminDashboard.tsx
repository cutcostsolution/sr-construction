import { Link } from "react-router";
import { ArrowUpRight, BriefcaseBusiness, CircleDollarSign, Clock3, Users } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { label, money } from "@/lib/site";

export default function AdminDashboard() {
  const query = trpc.admin.dashboard.useQuery();
  const c = query.data?.counts;
  return <div>
    {/* Header */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 30, flexWrap: "wrap", gap: 16 }}>
      <div>
        <span className="eyebrow">Operations Overview</span>
        <h1 style={{ margin: "12px 0 8px", fontSize: 28 }}>Good morning. Here's what needs attention.</h1>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>Consultations, payments, applications and enquiries across the SR website.</p>
      </div>
      <Link to="/admin/consultations" className="button">Review Bookings <ArrowUpRight /></Link>
    </div>

    {/* Metrics */}
    <div className="metric-grid" style={{ marginBottom: 40 }}>
      <article><BriefcaseBusiness size={28} /><strong>{c?.newConsultations ?? "—"}</strong><span>New Consultations</span><small style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--muted)" }}>{c?.consultations ?? 0} total requests</small></article>
      <article><Clock3 size={28} /><strong>{c?.payments ?? "—"}</strong><span>Payments to Review</span><small style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--muted)" }}>Evidence awaiting verification</small></article>
      <article><Users size={28} /><strong>{c?.clients ?? "—"}</strong><span>Clients & Leads</span><small style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--muted)" }}>{c?.applications ?? 0} pending applications</small></article>
      <article style={{ background: "linear-gradient(135deg, var(--burgundy) 0%, var(--burgundy-deep) 100%)", color: "var(--warm-white)" }}><CircleDollarSign size={28} color="var(--gold)" /><strong style={{ color: "var(--warm-white)" }}>{c ? money(Number(c.revenue)) : "—"}</strong><span style={{ color: "rgba(255,255,255,0.7)" }}>Verified Revenue</span><small style={{ display: "block", marginTop: 4, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Admin-verified payments only</small></article>
    </div>

    {/* Recent Activity */}
    <div className="admin-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div><span className="eyebrow">Latest Activity</span><h3 style={{ marginTop: 8, fontSize: 20 }}>Recent Consultation Requests</h3></div>
        <Link to="/admin/consultations" style={{ color: "var(--burgundy)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", display: "flex", alignItems: "center", gap: 4 }}>View All <ArrowUpRight size={14} /></Link>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead><tr><th>Client</th><th>Project</th><th>Schedule</th><th>Fee</th><th>Status</th></tr></thead>
          <tbody>
            {query.data?.recent.map(({ consultation, client, payment }) => (
              <tr key={consultation.id}>
                <td><strong style={{ fontSize: 14 }}>{client.name}</strong><br/><small style={{ color: "var(--muted)" }}>{consultation.reference}</small></td>
                <td>{consultation.projectCategory}<br/><small style={{ color: "var(--muted)" }}>{consultation.projectLocation}</small></td>
                <td>{consultation.preferredDate}<br/><small style={{ color: "var(--muted)" }}>{consultation.preferredTime}</small></td>
                <td>{consultation.agreedFee ? money(consultation.agreedFee) : "Free"}{payment && <><br/><small style={{ color: "var(--muted)" }}>{label(payment.status)}</small></>}</td>
                <td><span className={`status-badge ${consultation.status.replaceAll("_", "-")}`}>{label(consultation.status)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {query.data?.recent.length === 0 && <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--muted)", fontSize: 14 }}>No consultation requests yet. New website bookings will appear here.</div>}
    </div>

    {/* Note */}
    <div style={{ background: "var(--warm-white)", padding: 24, borderRadius: "var(--radius-lg)", border: "1px solid var(--line)", display: "flex", gap: 16, alignItems: "flex-start" }}>
      <div style={{ flex: 1 }}>
        <strong style={{ fontSize: 14, display: "block", marginBottom: 6 }}>Payment Control</strong>
        <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.7, margin: 0 }}>Receipt uploads remain unverified until an authorised administrator reviews them. Consultation confirmation and payment verification are separate actions.</p>
      </div>
    </div>
  </div>;
}
