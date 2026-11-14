import { useState, type FormEvent } from "react";
import { FileDown, X } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { dateText, label } from "@/lib/site";
import { Select, Status, Textarea } from "@/components/SiteUI";

export default function AdminClients() {
  const query = trpc.admin.clients.useQuery(); const utils = trpc.useUtils();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = query.data?.find((c) => c.id === selectedId);
  const update = trpc.admin.updateClient.useMutation({ onSuccess: () => utils.admin.clients.invalidate() });
  const exportQuery = trpc.admin.exportClients.useQuery(undefined, { enabled: false });
  async function downloadCsv() {
    const result = await exportQuery.refetch();
    if (!result.data) return;
    const blob = new Blob([result.data.csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = result.data.filename; a.click(); URL.revokeObjectURL(url);
  }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!selected) return; const data = new FormData(event.currentTarget);
    update.mutate({ id: selected.id, status: String(data.get("status")) as typeof selected.status, notes: String(data.get("notes") || "") });
  }
  return <div className="admin-page"><div className="admin-page-head"><div><span className="eyebrow">Relationship records</span><h1>Clients & leads</h1><p>People who have booked consultations, deduplicated by email and phone.</p></div><button className="button button-outline" onClick={downloadCsv} disabled={exportQuery.isFetching}><FileDown /> {exportQuery.isFetching ? "Preparing…" : "Export CSV"}</button></div><section className="admin-panel"><div className="table-wrap"><table><thead><tr><th>Name</th><th>Contact</th><th>Project location</th><th>Status</th><th>Created</th><th></th></tr></thead><tbody>{query.data?.map((c) => <tr key={c.id}><td><strong>{c.name}</strong><small>{c.company || "Independent client"}</small></td><td>{c.email}<small>{c.phone}</small></td><td>{c.location || "—"}</td><td><Status>{label(c.status)}</Status></td><td>{dateText(c.createdAt)}</td><td><button className="icon-button" onClick={() => setSelectedId(c.id)}>Manage</button></td></tr>)}</tbody></table>{query.data?.length === 0 && <div className="admin-empty">Client records will appear after the first consultation booking.</div>}</div></section>
    {selected && <div className="drawer-backdrop" onClick={() => setSelectedId(null)}><aside className="admin-drawer" onClick={(e) => e.stopPropagation()}><button className="drawer-close" onClick={() => setSelectedId(null)}><X /></button><span className="eyebrow">Client record</span><h2>{selected.name}</h2><p>{selected.email}<br />{selected.phone}</p><form key={selected.id} onSubmit={save} className="drawer-form"><Select label="Relationship status" name="status" defaultValue={selected.status}>{["new_lead","contacted","consultation_booked","proposal","active","completed","archived"].map((s) => <option value={s} key={s}>{label(s)}</option>)}</Select><Textarea label="Internal relationship notes" name="notes" defaultValue={selected.notes ?? ""} /><button className="button button-dark">Save client record</button>{update.isSuccess && <p className="form-success">Client updated.</p>}</form></aside></div>}
  </div>;
}
