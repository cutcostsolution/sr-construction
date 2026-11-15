import { useState, type FormEvent } from "react";
import { Download, Eye, FileDown, X } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { dateText, label } from "@/lib/site";
import { Select, Status, Textarea } from "@/components/SiteUI";

export default function AdminApplications() {
  const query = trpc.admin.applications.useQuery(); const utils = trpc.useUtils();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = query.data?.find((a) => a.id === selectedId);
  const update = trpc.admin.updateApplication.useMutation({ onSuccess: () => utils.admin.applications.invalidate() });
  const documentUrl = trpc.admin.evidenceUrl.useMutation();
  const exportQuery = trpc.admin.exportApplications.useQuery(undefined, { enabled: false });
  async function downloadCsv() {
    const result = await exportQuery.refetch();
    if (!result.data) return;
    const blob = new Blob([result.data.csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = result.data.filename; a.click(); URL.revokeObjectURL(url);
  }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!selected) return; const d = new FormData(event.currentTarget);
    update.mutate({ id: selected.id, status: String(d.get("status")) as typeof selected.status, notes: String(d.get("notes") || ""), isPublic: d.get("isPublic") === "on" });
  }
  return <div className="admin-page"><div className="admin-page-head"><div><span className="eyebrow">Private network records</span><h1>Vendor & professional applications</h1><p>Review capabilities, supporting documents and approval decisions. Application data is never publicly listed by the public API.</p></div><button className="button button-outline" onClick={downloadCsv} disabled={exportQuery.isFetching}><FileDown /> {exportQuery.isFetching ? "Preparing…" : "Export CSV"}</button></div><section className="admin-panel"><div className="table-wrap"><table><thead><tr><th>Applicant</th><th>Type / Category</th><th>Location</th><th>Submitted</th><th>Status</th><th></th></tr></thead><tbody>{query.data?.map((a) => <tr key={a.id}><td><strong>{a.name}</strong><small>{a.reference} · {a.contactName}</small></td><td>{label(a.type)}<small>{a.category}</small></td><td>{a.location}</td><td>{dateText(a.createdAt)}</td><td><Status>{label(a.status)}</Status></td><td><button className="icon-button" onClick={() => setSelectedId(a.id)}><Eye /> Review</button></td></tr>)}</tbody></table>{query.data?.length === 0 && <div className="admin-empty">No network applications yet.</div>}</div></section>
    {selected && <div className="drawer-backdrop" onClick={() => setSelectedId(null)}><aside className="admin-drawer" onClick={(e) => e.stopPropagation()}><button className="drawer-close" onClick={() => setSelectedId(null)}><X /></button><span className="eyebrow">{selected.reference}</span><h2>{selected.name}</h2><p>{selected.email}<br />{selected.phone}</p><dl className="record-list"><div><dt>Type</dt><dd>{label(selected.type)}</dd></div><div><dt>Category</dt><dd>{selected.category}</dd></div><div><dt>Location</dt><dd>{selected.location}</dd></div><div><dt>Experience</dt><dd>{selected.experience || "Not supplied"}</dd></div><div><dt>Affiliations</dt><dd>{selected.affiliations || "Not supplied"}</dd></div><div><dt>Website</dt><dd>{selected.website || "Not supplied"}</dd></div></dl><div className="record-description"><span>Services offered</span><p>{selected.servicesOffered}</p><span>Additional details</span><p>{selected.details || "None supplied"}</p></div>{selected.documentKey && <button className="button button-outline" onClick={async () => { const r = await documentUrl.mutateAsync({ key: selected.documentKey! }); window.open(r.url, "_blank", "noopener,noreferrer"); }}><Download /> View supporting document</button>}<form key={selected.id} onSubmit={save} className="drawer-form"><Select label="Review status" name="status" defaultValue={selected.status}>{["pending","under_review","approved","rejected","more_info"].map((s) => <option key={s}>{s}</option>)}</Select><Textarea label="Internal review notes" name="notes" defaultValue={selected.notes ?? ""} /><label className="check-field"><input type="checkbox" name="isPublic" defaultChecked={selected.isPublic} /> Eligible for a future public directory (not currently published)</label><button className="button button-dark">Save review</button>{update.isSuccess && <p className="form-success">Application updated.</p>}</form></aside></div>}
  </div>;
}
