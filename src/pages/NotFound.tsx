import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="section-dark" style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 5vw" }}>
      <div style={{ textAlign: "center", maxWidth: 500 }}>
        <span className="caption" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
          404 &middot; Page Not Found
        </span>
        <h1 className="display-lg" style={{ marginBottom: 16 }}>
          This page is not on the site plan.
        </h1>
        <p className="body-lg" style={{ marginBottom: 32 }}>
          The address may have changed. Return home or explore our services and project record.
        </p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Homepage
        </Link>
      </div>
    </section>
  );
}
