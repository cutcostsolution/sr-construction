import { useState } from "react";
import { Upload, Trash2, ImagePlus, Copy, X, ExternalLink } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { toBase64 } from "@/lib/site";

export default function AdminMedia() {
  const utils = trpc.useUtils();
  const media = trpc.admin.media.useQuery();
  const upload = trpc.admin.uploadMedia.useMutation({
    onSuccess: () => { utils.admin.media.invalidate(); setError(""); },
    onError: (err) => setError(err.message),
  });
  const remove = trpc.admin.deleteMedia.useMutation({
    onSuccess: () => utils.admin.media.invalidate(),
  });
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<{ url: string; name: string; key: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function uploadFile(file?: File) {
    if (!file) return;
    setError("");
    if (file.size > 8 * 1024 * 1024) { setError("File must be 8MB or smaller."); return; }
    try {
      await upload.mutateAsync({
        file: { name: file.name, contentType: file.type, contentBase64: await toBase64(file) },
      });
    } catch (e) { setError(e instanceof Error ? e.message : "Upload failed."); }
  }

  function copyKey(key: string) {
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 4 }}>Media Library</h2>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>Upload images here, then use the key in Website Content or paste the URL directly.</p>
          <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>Tip: Copy the Key and paste it into any image field (heroImage, image, gallery, etc.) in Website Content.</p>
        </div>
        <label style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 20px", background: "var(--burgundy)", color: "white",
          borderRadius: "var(--radius-md)", cursor: "pointer", fontSize: 13, fontWeight: 600,
        }}>
          <Upload size={16} />
          {upload.isPending ? "Uploading..." : "Upload Image"}
          <input type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }}
            onChange={(e) => uploadFile(e.target.files?.[0])} disabled={upload.isPending} />
        </label>
      </div>

      {error && <div className="form-error" style={{ marginBottom: 20 }}>{error}</div>}

      {media.isLoading && <p style={{ color: "var(--muted)" }}>Loading media...</p>}

      {!media.isLoading && (!media.data || media.data.length === 0) && (
        <div style={{ textAlign: "center", padding: "80px 20px", background: "var(--warm-white)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--line)" }}>
          <ImagePlus size={48} style={{ color: "var(--muted)", marginBottom: 16 }} />
          <h3 style={{ fontSize: 16, marginBottom: 8 }}>No media uploaded yet</h3>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>Upload images here to use across your website.</p>
          <label style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 20px", background: "var(--burgundy)", color: "white",
            borderRadius: "var(--radius-md)", cursor: "pointer", fontSize: 13, fontWeight: 600,
          }}>
            <Upload size={16} /> Upload First Image
            <input type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }}
              onChange={(e) => uploadFile(e.target.files?.[0])} disabled={upload.isPending} />
          </label>
        </div>
      )}

      {media.data && media.data.length > 0 && (
        <>
          <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>{media.data.length} file(s)</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
            {media.data.map((m) => (
              <div key={m.id} style={{
                background: "var(--warm-white)", borderRadius: "var(--radius-lg)",
                border: "1px solid var(--line)", overflow: "hidden",
              }}>
                <div style={{ aspectRatio: "4/3", overflow: "hidden", cursor: "pointer", background: "var(--cream)" }}
                  onClick={() => setPreview({ url: m.url, name: m.name, key: m.key })}>
                  <img src={m.url} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: 12 }}>
                  <p style={{ fontSize: 12, color: "var(--ink)", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</p>
                  <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 12 }}>{(m.size / 1024).toFixed(1)} KB</p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <button onClick={() => copyKey(m.key)} style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                      padding: "6px 8px", fontSize: 11, border: "1px solid var(--line)",
                      borderRadius: "var(--radius-sm)", background: "white", cursor: "pointer", color: "var(--ink)",
                    }}>
                      <Copy size={12} /> {copied ? "Copied!" : "Copy Key"}
                    </button>
                    <button onClick={() => copyKey(`${window.location.origin}/api/media?key=${encodeURIComponent(m.key)}`)} style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                      padding: "6px 8px", fontSize: 11, border: "1px solid var(--burgundy)",
                      borderRadius: "var(--radius-sm)", background: "white", cursor: "pointer", color: "var(--burgundy)",
                    }}>
                      <ExternalLink size={12} /> Copy URL
                    </button>
                    <button onClick={() => { if (confirm("Delete this image?")) remove.mutate({ id: m.id, key: m.key }); }} style={{
                      padding: "6px 8px", fontSize: 11, border: "1px solid #dc2626",
                      borderRadius: "var(--radius-sm)", background: "white", cursor: "pointer", color: "#dc2626",
                    }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Preview Modal */}
      {preview && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        }} onClick={() => setPreview(null)}>
          <div style={{ position: "relative", maxWidth: 800, maxHeight: "90vh" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPreview(null)} style={{
              position: "absolute", top: -40, right: 0, background: "none", border: "none",
              color: "white", cursor: "pointer",
            }}><X size={24} /></button>
            <img src={preview.url} alt={preview.name} style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: "var(--radius-lg)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
              <p style={{ color: "white", fontSize: 13 }}>{preview.name}</p>
              <button onClick={() => copyKey(preview.key)} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
                background: "white", border: "none", borderRadius: "var(--radius-sm)",
                fontSize: 12, cursor: "pointer",
              }}>
                <Copy size={12} /> {copied ? "Copied!" : "Copy Key"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
