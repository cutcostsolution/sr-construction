import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { ArrowUpRight, Menu, X, Phone, Mail, MapPin } from "lucide-react";
import { useSite } from "@/lib/site";

const NAV = [
  ["Home", "/"], ["About", "/about"], ["Services", "/services"], ["Projects", "/projects"],
  ["The Founder", "/founder"], ["Our Network", "/network"], ["Contact Us", "/contact"],
];

export function Brand({ light = false }: { light?: boolean }) {
  return <Link to="/" className="brand" aria-label="SR Construction home">
    <span><strong style={{ color: light ? "white" : "var(--burgundy)" }}>SR</strong><small style={{ color: light ? "rgba(255,255,255,0.7)" : "var(--muted)" }}>CONSTRUCTION</small></span>
  </Link>;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { settings } = useSite();
  useEffect(() => setOpen(false), [pathname]);
  return <>
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {NAV.map(([name, path]) => <NavLink key={path} to={path} end={path === "/"}>{name}</NavLink>)}
        </nav>
        <Link to="/consultation" className="button" style={{ fontSize: 11, padding: "12px 20px" }}>Book Consultation <ArrowUpRight size={14} /></Link>
        <button className="mobile-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
      </div>
    </header>
    <div className={`mobile-nav ${open ? "open" : ""}`}>
      <button className="close" onClick={() => setOpen(false)}><X /></button>
      <nav>{NAV.map(([name, path]) => <NavLink key={path} to={path} end={path === "/"} onClick={() => setOpen(false)}>{name}</NavLink>)}</nav>
      <Link to="/consultation" className="button" style={{ marginTop: 20 }}>Book Consultation <ArrowUpRight /></Link>
    </div>
  </>;
}

export function Footer() {
  const { settings } = useSite();
  return <footer className="site-footer">
    <div className="footer-grid">
      <div><strong style={{ fontFamily: "Cinzel,serif", fontSize: 20, color: "white", letterSpacing: ".04em", display: "block", marginBottom: 14 }}>SR CONSTRUCTION</strong><p style={{ fontSize: 13, lineHeight: 1.7 }}>Full-cycle construction and engineering. Built with clarity, from ground to handover.</p></div>
      <div><span className="footer-label">Navigate</span><Link to="/about">About</Link><Link to="/services">Services</Link><Link to="/projects">Projects</Link><Link to="/founder">The Founder</Link></div>
      <div><span className="footer-label">Take part</span><Link to="/network">Join Our Network</Link><Link to="/blogs">Insights &amp; Guides</Link><Link to="/consultation">Book Your Consultation</Link><Link to="/contact">Contact Us</Link></div>
      <div><span className="footer-label">Operations base</span><p style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 10, margin: "8px 0" }}><MapPin size={14} /> {settings["brand.address"]}</p><p style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 10, margin: "8px 0" }}><Mail size={14} /> {settings["brand.email"]}</p><p style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 10, margin: "8px 0" }}><Phone size={14} /> {settings["brand.phone"]}</p></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} SR Construction Ltd. {settings["brand.registration"]}</span><Link to="/admin">Admin access</Link></div>
  </footer>;
}

export function WhatsApp() {
  const { settings } = useSite();
  const fallback = "2347071122510";
  const number = settings["brand.whatsapp"] || fallback;
  const text = encodeURIComponent("Hello SR Construction, I would like to discuss a project.");
  return <a className="whatsapp-float" href={`https://wa.me/${number}?text=${text}`} target="_blank" rel="noreferrer" aria-label="Chat with SR Construction on WhatsApp">
    <svg viewBox="0 0 32 32" aria-hidden="true" width="20" height="20"><path fill="currentColor" d="M16.04 3C8.85 3 3.05 8.8 3.05 15.98c0 2.29.6 4.52 1.75 6.49L3 29l6.7-1.75a12.96 12.96 0 0 0 6.33 1.63h.01c7.18 0 12.99-5.8 12.99-12.98A12.91 12.91 0 0 0 16.04 3Zm0 23.75h-.01c-2.04 0-4.04-.55-5.78-1.58l-.42-.25-3.98 1.04 1.06-3.87-.27-.4a10.75 10.75 0 0 1-1.65-5.72c0-5.98 4.87-10.85 10.86-10.85a10.8 10.8 0 0 1 10.84 10.85c0 5.98-4.86 10.78-10.65 10.78Zm5.96-8.1c-.33-.16-1.93-.95-2.23-1.06-.3-.1-.52-.16-.73.17-.22.32-.84 1.06-1.03 1.28-.19.21-.38.24-.7.08-.33-.16-1.38-.5-2.62-1.61a9.8 9.8 0 0 1-1.82-2.26c-.19-.32-.02-.5.14-.66.15-.15.33-.38.49-.57.16-.2.22-.33.33-.55.11-.22.05-.41-.03-.57-.08-.16-.73-1.76-1-2.4-.26-.63-.53-.55-.73-.56h-.62c-.22 0-.57.08-.87.4-.3.33-1.14 1.12-1.14 2.72s1.17 3.16 1.33 3.38c.16.21 2.3 3.51 3.57 4.23.5.28.9.45 1.2.58.5.16.97.14 1.33.08.41-.06 1.26-.52 1.44-1.01.18-.5.18-.92.13-1.01-.06-.08-.2-.13-.43-.24Z"/></svg>
    Chat on WhatsApp
  </a>;
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return <><Header /><main>{children}</main><Footer /><WhatsApp /></>;
}

export function PageHero({ page, children, compact = false }: { page: Record<string, string>; children?: ReactNode; compact?: boolean }) {
  return <section className="page-hero" style={{
    background: "linear-gradient(135deg, var(--burgundy) 0%, var(--burgundy-dark) 100%)",
    color: "white", padding: compact ? "120px 6vw 60px" : "140px 6vw 80px",
    textAlign: "center", borderRadius: "0 0 28px 28px", position: "relative", overflow: "hidden",
  }}>
    <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, background: "rgba(196,163,90,0.06)", borderRadius: "50%", filter: "blur(80px)" }} />
    <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto" }}>
      <span className="eyebrow light">{page.kicker}</span>
      <h1 style={{ color: "white", margin: "20px 0 16px" }}>{page.title}</h1>
      <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 17, lineHeight: 1.8, maxWidth: 600, margin: "0 auto 30px" }}>{page.body}</p>
      {children}
    </div>
  </section>;
}

export function ConsultationCTA({ title = "Let's build with clarity.", body = "Start with a focused conversation about your site, scope and the next practical step." }: { title?: string; body?: string }) {
  return <section className="consultation-cta">
    <div className="consultation-cta-inner">
      <span className="eyebrow light">Your next step</span>
      <h2>{title}</h2>
      <p>{body}</p>
      <Link to="/consultation" className="button button-gold">Book Your Consultation <ArrowUpRight /></Link>
    </div>
  </section>;
}
