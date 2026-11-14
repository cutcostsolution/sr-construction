import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { ConsultationCTA, PageHero } from "@/components/SiteLayout";
import { Loading, ProjectCard } from "@/components/SiteUI";

export default function ServiceDetail() {
  const { slug = "" } = useParams();
  const query = trpc.public.service.useQuery({ slug });
  if (query.isLoading) return <Loading label="Loading service…" />;
  if (!query.data) return <section className="not-found-inline"><h1>Service not found</h1><Link to="/services"><ArrowLeft /> Back to services</Link></section>;
  const { service, projects } = query.data;
  const page = { kicker: service.category, title: service.name, body: service.summary, heroImage: service.image };
  return <>
    <PageHero page={page} compact><Link to="/consultation" className="button">Discuss this service <ArrowUpRight /></Link></PageHero>
    <section className="section service-detail"><div><span className="eyebrow">The service</span><h2>Technical work, clearly coordinated.</h2></div><div><p className="lead">{service.description}</p><ul>{service.capabilities.map((c) => <li key={c}><Check />{c}</li>)}</ul></div></section>
    {projects.length > 0 && <section className="section related-projects"><div className="section-head"><div><span className="eyebrow">Related case studies</span><h2>See the capability in practice.</h2></div></div><div className="project-grid">{projects.map((p) => <ProjectCard key={p.id} project={p} />)}</div></section>}
    <ConsultationCTA title={`Planning ${service.name.toLowerCase()}?`} body="Share your site and project goals with us. We will help you establish the right scope and next step." />
  </>;
}
