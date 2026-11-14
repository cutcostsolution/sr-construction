import { Link } from "react-router";
import { ArrowUpRight, Check, MoveRight, Shield, Clock, Lightbulb, Award, TrendingUp, Users, Building, HardHat } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { usePage } from "@/lib/site";
import { ConsultationCTA } from "@/components/SiteLayout";

export default function Home() {
  const { page } = usePage("home");
  const services = trpc.public.services.useQuery();
  const projects = trpc.public.projects.useQuery();
  const founder = usePage("founder").page;
  return <>
    {/* ===== HERO — TYPOGRAPHY DRIVEN, NO IMAGE ===== */}
    <section className="home-hero">
      <div className="home-hero-inner">
        <div>
          <span className="eyebrow">{page.kicker}</span>
          <h1>{page.title}</h1>
          <p>{page.body}</p>
          <div className="hero-actions">
            <Link to="/consultation" className="button">Book Your Consultation <ArrowUpRight /></Link>
            <Link to="/projects" className="button button-outline">Explore Our Work</Link>
          </div>
        </div>
        <div className="hero-stats">
          <h2>Our Track Record</h2>
          <ul>
            <li><Check size={18} /> 12+ years in Nigerian construction</li>
            <li><Check size={18} /> 50+ completed projects</li>
            <li><Check size={18} /> Lagos, Abuja, Port Harcourt</li>
            <li><Check size={18} /> Structural, architectural, finishing</li>
            <li><Check size={18} /> Supervised execution every stage</li>
          </ul>
        </div>
      </div>
    </section>

    {/* ===== MARQUEE ===== */}
    <div className="marquee-strip">
      <div className="marquee-track">
        <span>Structural Engineering</span><span>Architectural Design</span><span>Project Management</span><span>Interior Fit-Out</span><span>Renovation & Restoration</span><span>Building Materials Supply</span>
        <span>Structural Engineering</span><span>Architectural Design</span><span>Project Management</span><span>Interior Fit-Out</span><span>Renovation & Restoration</span><span>Building Materials Supply</span>
      </div>
    </div>

    {/* ===== PRINCIPLES ===== */}
    <section className="principles-strip">
      <div style={{ textAlign: "center", marginBottom: 50 }}>
        <span className="eyebrow">The SR Standard</span>
        <h2>Built on four principles</h2>
      </div>
      <div className="principles-grid">
        <article><Shield size={32} /><h3>Quality</h3><p>The right materials, sound technical decisions and careful execution at every stage.</p></article>
        <article><Clock size={32} /><h3>Speed</h3><p>Clear coordination keeps people, decisions and site work moving forward.</p></article>
        <article><Lightbulb size={32} /><h3>Innovation</h3><p>Practical methods and visible records improve the building experience.</p></article>
        <article><Award size={32} /><h3>High Standards</h3><p>Every stage checked against the agreed scope, finish and timeline.</p></article>
      </div>
    </section>

    {/* ===== SERVICES PREVIEW — BURGUNDY PANEL ===== */}
    <section className="home-services">
      <div className="home-services-inner">
        <div>
          <span className="eyebrow light">What We Do</span>
          <h2>Specialist capability.<br />One accountable team.</h2>
          <p>From structural work to complete project delivery, every service is shaped around the actual demands of your site.</p>
          <Link to="/services" className="button button-gold">All Services <ArrowUpRight /></Link>
        </div>
        <div className="service-preview-grid">
          {(services.data ?? []).slice(0, 4).map(s => (
            <div key={s.id} className="service-preview-card">
              <h3>{s.name}</h3>
              <p>{s.summary}</p>
            </div>
          ))}
          {services.isLoading && <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Loading capabilities…</div>}
        </div>
      </div>
    </section>

    {/* ===== IMAGE STORY — HOW WE WORK ===== */}
    <section className="image-story" style={{ marginTop: 80, marginBottom: 80 }}>
      <img src={page.image} alt="SR Construction supervised site work" />
      <div>
        <span className="eyebrow">From Brief to Handover</span>
        <h2>A clearer way to build.</h2>
        <ol>
          <li><span>01</span><div><strong>Understand</strong><p>Scope, site, priorities and constraints.</p></div></li>
          <li><span>02</span><div><strong>Coordinate</strong><p>Design, engineering, materials and people.</p></div></li>
          <li><span>03</span><div><strong>Execute</strong><p>Supervised work with visible progress.</p></div></li>
          <li><span>04</span><div><strong>Deliver</strong><p>Quality checks, completion and handover.</p></div></li>
        </ol>
      </div>
    </section>

    {/* ===== PROJECTS PREVIEW ===== */}
    <section className="projects-preview">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
        <div><span className="eyebrow">Selected Work</span><h2>The evidence is in the delivery.</h2></div>
        <Link to="/projects" className="text-link" style={{ color: "var(--burgundy)", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: ".06em" }}>View All Projects <ArrowUpRight size={16} /></Link>
      </div>
      <div className="projects-preview-grid">
        {(projects.data ?? []).slice(0, 3).map(p => (
          <Link key={p.id} to={`/projects/${p.slug}`} className="project-card">
            <img src={p.image} alt={p.title} />
            <div className="project-copy">
              <div className="micro">{p.category} · {p.location}</div>
              <h3>{p.title}</h3>
              <span className="project-status">{p.status}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>

    {/* ===== FOUNDER TEASER ===== */}
    <section className="founder-teaser">
      <img src={founder.photo} alt={founder.title} />
      <div>
        <span className="eyebrow">The Founder</span>
        <h2>Leadership that stays close to the work.</h2>
        <p>{founder.body}</p>
        <Link to="/founder" className="button button-outline">Meet {founder.title} <ArrowUpRight /></Link>
      </div>
    </section>

    {/* ===== METRICS ===== */}
    <section className="section" style={{ paddingTop: 0, paddingBottom: 80 }}>
      <div className="metric-grid">
        <article><Building size={28} /><strong>50+</strong><span>Projects Delivered</span></article>
        <article><Users size={28} /><strong>200+</strong><span>Happy Clients</span></article>
        <article><HardHat size={28} /><strong>12+</strong><span>Years Experience</span></article>
        <article><TrendingUp size={28} /><strong>100%</strong><span>Quality Commitment</span></article>
      </div>
    </section>

    <ConsultationCTA title={page.ctaTitle} body={page.ctaBody} />
  </>;
}
