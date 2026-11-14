import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowUpRight, MapPin } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { ConsultationCTA, PageHero } from "@/components/SiteLayout";
import { Loading } from "@/components/SiteUI";
import ImageSlideshow from "@/components/ImageSlideshow";

export default function ProjectDetail() {
  const { slug = "" } = useParams();
  const query = trpc.public.project.useQuery({ slug });
  if (query.isLoading) return <Loading label="Loading project…" />;
  if (!query.data) return <section className="not-found-inline"><h1>Project not found</h1><Link to="/projects"><ArrowLeft /> Back to projects</Link></section>;
  const p = query.data;
  const page = { kicker: p.category, title: p.title, body: p.summary, heroImage: p.image };
  return <>
    <PageHero page={page} compact />
    <section className="project-facts"><div><span>Location</span><strong><MapPin />{p.location}</strong></div><div><span>Status</span><strong>{p.status}</strong></div>{p.stat && <div><span>Project record</span><strong>{p.stat}</strong></div>}</section>
    <section className="section project-narrative"><span className="eyebrow">The case study</span><p>{p.description}</p></section>
    <section className="project-slideshow-section">
      <ImageSlideshow images={[p.image, ...(p.gallery || [])]} altPrefix={p.title} />
    </section>
    <section className="section project-next"><h2>Have a similar project in mind?</h2><Link to="/consultation" className="button button-dark">Book Your Consultation <ArrowUpRight /></Link></section>
    <ConsultationCTA title="Let’s define your project properly." />
  </>;
}
