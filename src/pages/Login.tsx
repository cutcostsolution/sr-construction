import { useState, type FormEvent } from "react";
import { trpc } from "@/providers/trpc";
import { useNavigate } from "react-router";

export default function Login() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const login = trpc.auth.login.useMutation({
    onSuccess: () => {
      utils.auth.me.invalidate();
      navigate("/admin", { replace: true });
    },
    onError: (err) => {
      setError(err.message || "Login failed. Please check your credentials.");
      setBusy(false);
    },
  });

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const data = new FormData(e.currentTarget);
    login.mutate({
      email: String(data.get("email")),
      password: String(data.get("password")),
    });
  }

  return (
    <div className="admin-loading" style={{ background: "#0a0a0a", color: "white" }}>
      <div style={{ maxWidth: 400, width: "90vw", textAlign: "center" }}>
        <div style={{ fontSize: 50, fontWeight: 800, color: "#f7b819", marginBottom: 8 }}>SR</div>
        <p style={{ color: "#aaa", fontSize: 13, marginBottom: 35, letterSpacing: ".05em" }}>ADMINISTRATION PORTAL</p>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 18, textAlign: "left" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".08em", color: "#888" }}>Email address</label>
            <input name="email" type="email" required autoComplete="email" style={{ background: "#1a1a1a", border: "1px solid #333", padding: "14px 16px", color: "white", fontSize: 14, outline: "none" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".08em", color: "#888" }}>Password</label>
            <input name="password" type="password" required autoComplete="current-password" style={{ background: "#1a1a1a", border: "1px solid #333", padding: "14px 16px", color: "white", fontSize: 14, outline: "none" }} />
          </div>
          {error && <p style={{ color: "#e0705a", fontSize: 12, background: "#2a1815", padding: "12px 14px", margin: 0 }}>{error}</p>}
          <button type="submit" disabled={busy} style={{ background: "#f7b819", color: "#0a0a0a", border: "none", padding: "15px", fontSize: 12, fontWeight: 700, cursor: busy ? "wait" : "pointer", opacity: busy ? .6 : 1 }}>
            {busy ? "Signing in…" : "Sign in to Admin"}
          </button>
        </form>
        <p style={{ color: "#555", fontSize: 11, marginTop: 25 }}>Authorised personnel only.</p>
      </div>
    </div>
  );
}
