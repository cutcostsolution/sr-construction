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
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--void)",
      padding: "40px 20px",
    }}>
      <div style={{ maxWidth: 420, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <img src="/assets/logo-light.png" alt="SR Construction" style={{ height: 48, marginBottom: 24 }} />
          <p style={{ color: "var(--text-faint)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.15em" }}>
            Administration Portal
          </p>
        </div>
        <form
          onSubmit={submit}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@srconstruction.ng"
              style={{
                background: "var(--void-lift)",
                border: "1px solid var(--line-dark)",
                padding: "16px 18px",
                color: "var(--text)",
                fontSize: 15,
                outline: "none",
                borderRadius: "var(--radius-sm)",
                width: "100%",
              }}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              style={{
                background: "var(--void-lift)",
                border: "1px solid var(--line-dark)",
                padding: "16px 18px",
                color: "var(--text)",
                fontSize: 15,
                outline: "none",
                borderRadius: "var(--radius-sm)",
                width: "100%",
              }}
            />
          </div>
          {error && (
            <div style={{
              color: "#E8A0A0",
              fontSize: 13,
              background: "rgba(139,30,47,0.1)",
              padding: "14px 18px",
              borderRadius: "var(--radius-sm)",
              borderLeft: "2px solid var(--accent)",
            }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={busy}
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
          >
            {busy ? "Signing in..." : "Sign in to Admin"}
          </button>
        </form>
        <p style={{ color: "var(--text-faint)", fontSize: 12, textAlign: "center", marginTop: 32 }}>
          Authorised personnel only.
        </p>
      </div>
    </div>
  );
}
