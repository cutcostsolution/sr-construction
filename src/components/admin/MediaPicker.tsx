import { useState } from "react";
import { ImagePlus, Upload, X } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { toBase64 } from "@/lib/site";

export default function MediaPicker({ label, value, onChange }: { label: string; value: string; onChange: (key: string) => void }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const utils = trpc.useUtils();
  const media = trpc.admin.media.useQuery();
  const upload = trpc.admin.uploadMedia.useMutation({ onSuccess: () => utils.admin.media.invalidate() });
  const selected = media.data?.find((m) => m.key === value);
  const preview = selected?.url ?? (value.startsWith("/") || value.startsWith("http") || value.startsWith("data:") ? value : value ? `/api/media?key=${encodeURIComponent(value)}` : "");
  async function uploadFile(file?: File) {
    if (!file) return; setError("");
    if (file.size > 8 * 1024 * 1024) { setError("Image must be 8MB or smaller."); return; }
    try {
      const saved = await upload.mutateAsync({ file: { name: file.name, contentType: file.type, contentBase64: await toBase64(file) } });
      onChange(saved.key); setOpen(false);
    } catch (e) { setError(e instanceof Error ? e.message : "Upload failed."); }
  }
  return <div className="media-picker"><span>{label}</span><div className="media-current">{preview ? <img src={preview} alt="Current selection" /> : <ImagePlus />}<div><small>{value || "No image selected"}</small><button type="button" onClick={() => setOpen(true)}>Choose from media library</button></div></div>
    {open && <div className="media-modal-backdrop"><div className="media-modal"><div className="media-modal-head"><div><span className="eyebrow">Media library</span><h3>Choose or upload an image</h3></div><button onClick={() => setOpen(false)}><X /></button></div><label className="media-upload"><Upload />{upload.isPending ? "Uploading…" : "Upload a new image"}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => uploadFile(e.target.files?.[0])} disabled={upload.isPending} /></label>{error && <p className="form-error">{error}</p>}<div className="media-grid">{media.data?.map((m) => <button key={m.id} onClick={() => { onChange(m.key); setOpen(false); }}><img src={m.url} alt={m.name} /><span>{m.name.split("/").pop()}</span></button>)}</div>{media.data?.length === 0 && <p>No uploaded media yet. Upload your first image above.</p>}</div></div>}
  </div>;
}
