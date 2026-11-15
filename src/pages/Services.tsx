import { usePage } from "@/lib/site";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { ConsultationCTA } from "@/components/SiteLayout";

function imgFallback(e: React.SyntheticEvent<HTMLImageElement>) {
  (e.target as HTMLImageElement).src = "/assets/hero-structure.jpg";
}

export default function Services() {
  const { page } = usePage("services");
  const services = trpc.public.services.useQuery();

  const fallbackServices = [
    { id: 1, slug: "design-build-construction", category: "Full-Cycle Delivery", name: "Design & Build Construction", image: "/assets/hero-duplex.jpg", summary: "Architecture, engineering and construction coordinated under one accountable team.", description: "Our Design & Build service covers the entire project lifecycle from architectural drawings through structural engineering to final handover." },
    { id: 2, slug: "structural-steel-roof-trusses", category: "Structural Engineering", name: "Structural Steel & Roof Trusses", image: "/assets/service-steel.webp", summary: "In-house steel fabrication for roof trusses, frames, balustrades and gatehouses.", description: "Our in-house steel workshop produces roof trusses, steel frames, balustrades and gatehouses to precise engineering specifications." },
    { id: 3, slug: "reinforced-concrete-superstructure", category: "Structural Engineering", name: "Reinforced Concrete & Superstructure", image: "/assets/service-concrete.jpg", summary: "Precise formwork, reinforcement, columns, beams and suspended concrete slabs.", description: "From raft foundations to suspended floor slabs, our concrete team delivers structural elements that meet or exceed engineering specification." },
    { id: 4, slug: "foundations-ground-engineering", category: "Civil Works", name: "Foundations & Ground Engineering", image: "/assets/service-foundation.jpg", summary: "Ground beams, raft foundations, retaining walls and difficult-site stabilisation.", description: "We assess soil conditions and design foundations that match the ground reality." },
    { id: 5, slug: "drainage-paving-perimeter-works", category: "Infrastructure", name: "Drainage, Paving & Perimeter Works", image: "/assets/service-drainage.webp", summary: "Practical external works that protect the property and complete the site.", description: "We install surface and sub-surface drainage, interlocking paving and perimeter walls." },
    { id: 6, slug: "sports-turf-facility-construction", category: "Specialist Construction", name: "Sports Turf & Facility Construction", image: "/assets/service-turf.jpg", summary: "Sports grounds delivered from sub-base civil works to turf and facility setup.", description: "From sub-base civil works through drainage, turf laying and facility construction." },
  ];
  const displayServices = services.data?.length ? services.data : fallbackServices;

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero-fullbleed" style={{ minHeight: "70vh", justifyContent: "center" }}>
        <div className="hero-bg loaded" style={{ backgroundImage: `url(${page.heroImage || "/assets/hero-duplex.jpg"})` }} />
        <div className="hero-overlay" />
        <div className="hero-content" style={{ textAlign: "center", paddingTop: "160px" }}>
          <span className="hero-kicker">{page.kicker || "What We Do"}</span>
          <h1 className="hero-title" style={{ maxWidth: 900, margin: "0 auto 24px" }}>
            Built properly<br />
            <span className="hero-accent">from the ground</span> up.
          </h1>
          <p className="hero-body" style={{ maxWidth: 560, margin: "0 auto" }}>
            {page.body || "From concept to completion, every service is designed to deliver certainty."}
          </p>
        </div>
      </section>

      {/* ===== SERVICES GRID ===== */}
      <section className="section-dark section-pad">
        <div className="container">
          <div className="grid-2">
            {displayServices.map((s) => (
              <Link key={s.id} to={`/services/${s.slug}`} className="service-reveal">
                <div className="service-img-wrap">
                  <img src={s.image || "/assets/hero-structure.jpg"} alt={s.name} onError={imgFallback} />
                </div>
                <div className="service-body">
                  <span className="service-category">{s.category}</span>
                  <h3>{s.name}</h3>
                  <p>{s.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}
