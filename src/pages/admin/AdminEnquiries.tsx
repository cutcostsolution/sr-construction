import { useState } from "react";
import { FileDown, Mail, Phone, X } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { dateText } from "@/lib/site";
import { Status } from "@/components/SiteUI";

export default function AdminEnquiries() {
  const query = trpc.admin.enquiries.useQuery(); const utils = trpc.useUtils();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = query.data?.find((e) => e.id === selectedId);
  const update = trpc.admin.respondEnquiry.useMutation({ onSuccess: () => utils.admin.enquiries.invalidate() });
  const exportQuery = trpc.admin.exportEnquiries.useQuery(undefined, { enabled: false });
  async function downloadCsv() {
    const result = await exportQuery.refetch();
    if (!result.data) return;
    const blob = new Blob([result.data.csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = result.data.filename; a.click(); URL.revokeObjectURL(url);
  }
  return <div className="admin-page"><div className="admin-page-head"><div><span className="eyebrow">Website inbox</span><h1>General enquiries</h1><p>Messages submitted through the Contact page.</p></div><button className="button button-outline" onClick={downloadCsv} disabled={exportQuery.isFetching}><FileDown /> {exportQuery.isFetching ? "Preparing…" : "Export CSV"}</button></div><section className="admin-panel"><div className="table-wrap"><table><thead><tr><th>Sender</th><th>Subject</th><th>Received</th><th>Status</th><th></th></tr></thead><tbody>{query.data?.map((e) => <tr key={e.id}><td><strong>{e.name}</strong><small>{e.email}</small></td><td>{e.subject}</td><td>{dateText(e.createdAt)}</td><td><Status>{e.isResponded ? "Responded" : "Open"}</Status></td><td><button className="icon-button" onClick={() => setSelectedId(e.id)}>Open message</button></td></tr>)}</tbody></table>{query.data?.length === 0 && <div className="admin-empty">No general enquiries yet.</div>}</div></section>
    {selected && <div className="drawer-backdrop" onClick={() => setSelectedId(null)}><aside className="admin-drawer" onClick={(e) => e.stopPropagation()}><button className="drawer-close" onClick={() => setSelectedId(null)}><X /></button><span className="eyebrow">{selected.subject}</span><h2>{selected.name}</h2><p>Received {dateText(selected.createdAt)}</p><div className="record-description message-full"><p>{selected.message}</p></div><div className="record-contact"><a href={`mailto:${selected.email}`}><Mail /> {selected.email}</a>{selected.phone && <a href={`tel:${selected.phone}`}><Phone /> {selected.phone}</a>}</div><button className="button button-dark" onClick={() => update.mutate({ id: selected.id, isResponded: !selected.isResponded })}>{selected.isResponded ? "Reopen enquiry" : "Mark as responded"}</button></aside></div>}
  </div>;
}
