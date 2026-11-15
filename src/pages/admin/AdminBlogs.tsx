import { useState, type FormEvent } from "react";
import { Edit3, Plus, Trash2, X } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { dateText } from "@/lib/site";
import type { Post } from "@/lib/site";
import { Input, Status, Textarea } from "@/components/SiteUI";
import MediaPicker from "@/components/admin/MediaPicker";

export default function AdminBlogs() {
  const query = trpc.admin.posts.useQuery(); const utils = trpc.useUtils();
  const [editing, setEditing] = useState<Partial<Post> | null>(null);
  const save = trpc.admin.savePost.useMutation({ onSuccess: () => { utils.admin.posts.invalidate(); setEditing(null); } });
  const remove = trpc.admin.deletePost.useMutation({ onSuccess: () => utils.admin.posts.invalidate() });
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!editing) return; const d = new FormData(event.currentTarget);
    save.mutate({ id: editing.id, title: String(d.get("title")), slug: String(d.get("slug") || ""), category: String(d.get("category")), excerpt: String(d.get("excerpt")), body: String(d.get("body")), image: editing.image || "/assets/project-interior.webp", readTime: String(d.get("readTime")), isPublished: d.get("isPublished") === "on" });
  }
  return <div className="admin-page"><div className="admin-page-head"><div><span className="eyebrow">Editorial CMS</span><h1>Blogs & construction guides</h1><p>Publish practical articles, update their copy and replace article imagery.</p></div><button className="button button-dark" onClick={() => setEditing({ image: "/assets/project-interior.webp", readTime: "5 min read", isPublished: true })}><Plus /> New article</button></div><section className="admin-panel"><div className="table-wrap"><table><thead><tr><th>Article</th><th>Category</th><th>Published</th><th>Status</th><th></th></tr></thead><tbody>{query.data?.map((p) => <tr key={p.id}><td><strong>{p.title}</strong><small>{p.readTime}</small></td><td>{p.category}</td><td>{dateText(p.publishedAt)}</td><td><Status>{p.isPublished ? "Published" : "Draft"}</Status></td><td><div className="row-actions"><button onClick={() => setEditing(p)}><Edit3 /> Edit</button><button className="danger" onClick={() => { if (window.confirm(`Delete “${p.title}”?`)) remove.mutate({ id: p.id }); }}><Trash2 /></button></div></td></tr>)}</tbody></table></div></section>
    {editing && <div className="drawer-backdrop"><aside className="admin-drawer wide"><button className="drawer-close" onClick={() => setEditing(null)}><X /></button><span className="eyebrow">Article editor</span><h2>{editing.id ? "Edit article" : "Create article"}</h2><form onSubmit={submit} className="drawer-form"><Input label="Article title" name="title" defaultValue={editing.title} required /><Input label="URL slug (optional)" name="slug" defaultValue={editing.slug} /><Input label="Category" name="category" defaultValue={editing.category} required /><Input label="Read time" name="readTime" defaultValue={editing.readTime ?? "5 min read"} required /><Textarea label="Excerpt" name="excerpt" defaultValue={editing.excerpt} required /><Textarea label="Article body — separate paragraphs with a new line" name="body" className="article-textarea" defaultValue={editing.body} required /><MediaPicker label="Article image" value={editing.image ?? ""} onChange={(image) => setEditing({ ...editing, image })} /><label className="check-field"><input type="checkbox" name="isPublished" defaultChecked={editing.isPublished ?? true} /> Publish on the public website</label><button className="button button-dark" disabled={save.isPending}>{save.isPending ? "Saving…" : "Save article"}</button>{save.error && <p className="form-error">{save.error.message}</p>}</form></aside></div>}
  </div>;
}
