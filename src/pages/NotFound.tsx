import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return <section className="not-found-page"><span className="eyebrow light">404 · Page not found</span><h1>This page is not on the site plan.</h1><p>The address may have changed. Return home or explore our services and project record.</p><Link to="/" className="button"><ArrowLeft /> Back to homepage</Link></section>;
}
