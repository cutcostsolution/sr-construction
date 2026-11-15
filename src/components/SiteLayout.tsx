import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { ArrowUpRight, Menu, X, Phone, Mail, MapPin } from "lucide-react";
import { useSite } from "@/lib/site";

const NAV = [
  ["Home", "/"],
  ["About", "/about"],
  ["Services", "/services"],
  ["Projects", "/projects"],
  ["The Founder", "/founder"],
  ["Our Network", "/network"],
  ["Contact", "/contact"],
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { settings } = useSite();

  useEffect(() => {
    setOpen(false);
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <>
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <div className="header-inner">
          <Link to="/" className="brand-logo" aria-label="SR Construction home">
            <img src="/assets/logo-light.png" alt="SR Construction" height={40} />
          </Link>

          <nav className="desktop-nav" aria-label="Main navigation">
            {NAV.map(([name, path]) => (
              <NavLink key={path} to={path} end={path === "/"}>
                {name}
              </NavLink>
            ))}
          </nav>

          <Link to="/consultation" className="btn btn-primary" style={{ fontSize: 11, padding: "14px 24px" }}>
            Book Consultation <ArrowUpRight size={14} />
          </Link>

          <button
            className="mobile-toggle"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <div className={`mobile-nav ${open ? "open" : ""}`}>
        <button className="mobile-nav-close" onClick={() => setOpen(false)}>
          <X size={28} />
        </button>
        {NAV.map(([name, path]) => (
          <NavLink key={path} to={path} end={path === "/"} onClick={() => setOpen(false)}>
            {name}
          </NavLink>
        ))}
        <Link
          to="/consultation"
          className="btn btn-primary"
          style={{ marginTop: 32, textAlign: "center", justifyContent: "center" }}
          onClick={() => setOpen(false)}
        >
          Book Consultation <ArrowUpRight />
        </Link>
      </div>
    </>
  );
}

export function Footer() {
  const { settings } = useSite();
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">
            <img src="/assets/logo-light.png" alt="SR Construction" height={36} />
            <span className="footer-brand-text">SR CONSTRUCTION</span>
          </div>
          <p className="footer-desc">
            Full-cycle construction and engineering. Built with clarity, from ground to handover.
            Based in Port Harcourt, delivering across Nigeria.
          </p>
        </div>
        <div>
          <span className="footer-label">Navigate</span>
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/services">Services</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/founder">The Founder</Link>
          </div>
        </div>
        <div>
          <span className="footer-label">Take Part</span>
          <div className="footer-links">
            <Link to="/network">Join Our Network</Link>
            <Link to="/blogs">Insights</Link>
            <Link to="/consultation">Book Consultation</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
        </div>
        <div>
          <span className="footer-label">Operations Base</span>
          <div className="footer-contact">
            <div className="footer-contact-item">
              <MapPin size={16} />
              <span>{settings["brand.address"]}</span>
            </div>
            <div className="footer-contact-item">
              <Mail size={16} />
              <span>{settings["brand.email"]}</span>
            </div>
            <div className="footer-contact-item">
              <Phone size={16} />
              <span>{settings["brand.phone"]}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          &copy; {new Date().getFullYear()} SR Construction Ltd. {settings["brand.registration"]}
        </span>
        <Link to="/admin">Admin Access</Link>
      </div>
    </footer>
  );
}

export function WhatsApp() {
  const { settings } = useSite();
  const fallback = "2347071122510";
  const number = settings["brand.whatsapp"] || fallback;
  const text = encodeURIComponent("Hello SR Construction, I would like to discuss a project.");
  return (
    <a
      className="whatsapp-float"
      href={`https://wa.me/${number}?text=${text}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with SR Construction on WhatsApp"
    >
      <svg viewBox="0 0 32 32" aria-hidden="true" width={20} height={20}>
        <path
          fill="currentColor"
          d="M16.04 3C8.85 3 3.05 8.8 3.05 15.98c0 2.29.6 4.52 1.75 6.49L3 29l6.7-1.75a12.96 12.96 0 0 0 6.33 1.63h.01c7.18 0 12.99-5.8 12.99-12.98A12.91 12.91 0 0 0 16.04 3Zm0 23.75h-.01c-2.04 0-4.04-.55-5.78-1.58l-.42-.25-3.98 1.04 1.06-3.87-.27-.4a10.75 10.75 0 0 1-1.65-5.72c0-5.98 4.87-10.85 10.86-10.85a10.8 10.8 0 0 1 10.84 10.85c0 5.98-4.86 10.78-10.65 10.78Zm5.96-8.1c-.33-.16-1.93-.95-2.23-1.06-.3-.1-.52-.16-.73.17-.22.32-.84 1.06-1.03 1.28-.19.21-.38.24-.7.08-.33-.16-1.38-.5-2.62-1.61a9.8 9.8 0 0 1-1.82-2.26c-.19-.32-.02-.5.14-.66.15-.15.33-.38.49-.57.16-.2.22-.33.33-.55.11-.22.05-.41-.03-.57-.08-.16-.73-1.76-1-2.4-.26-.63-.53-.55-.73-.56h-.62c-.22 0-.57.08-.87.4-.3.33-1.14 1.12-1.14 2.72s1.17 3.16 1.33 3.38c.16.21 2.3 3.51 3.57 4.23.5.28.9.45 1.2.58.5.16.97.14 1.33.08.41-.06 1.26-.52 1.44-1.01.18-.5.18-.92.13-1.01-.06-.08-.2-.13-.43-.24Z"
        />
      </svg>
      Chat on WhatsApp
    </a>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsApp />
    </>
  );
}

/* Reusable CTA section */
export function ConsultationCTA({
  title = "Let's build with clarity.",
  body = "Start with a focused conversation about your site, scope and the next practical step.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="section-dark section-pad" style={{ textAlign: "center" }}>
      <div className="container-narrow">
        <span className="caption" style={{ color: "var(--accent)" }}>
          Your Next Step
        </span>
        <h2 className="display-md" style={{ margin: "20px 0 16px" }}>
          {title}
        </h2>
        <p className="body-lg" style={{ maxWidth: 560, margin: "0 auto 40px" }}>
          {body}
        </p>
        <Link to="/consultation" className="btn btn-primary">
          Book Your Consultation <ArrowUpRight />
        </Link>
      </div>
    </section>
  );
}
