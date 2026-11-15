import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Images, LoaderCircle } from "lucide-react";
import type { Project, Service } from "@/lib/site";

export function SectionHead({ eyebrow, title, body, action }: { eyebrow: string; title: string; body?: string; action?: ReactNode }) {
  return <div className="section-head"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{(body || action) && <div className="section-head-side">{body && <p>{body}</p>}{action}</div>}</div>;
}

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  return <Link to={`/services/${service.slug}`} className="service-card">
    <div className="service-image"><img src={service.image} alt={service.name} /><span>{String(index + 1).padStart(2, "0")}</span></div>
    <div className="service-copy"><span className="micro">{service.category}</span><h3>{service.name}</h3><p>{service.summary}</p><span className="text-link">Explore service <ArrowUpRight size={17} /></span></div>
  </Link>;
}

export function ProjectCard({ project, large = false }: { project: Project; large?: boolean }) {
  const galleryCount = (project.gallery?.length || 0) + 1;
  return <Link to={`/projects/${project.slug}`} className={`project-card ${large ? "large" : ""}`}>
    <div className="project-image"><img src={project.image} alt={project.title} /><span className="project-status">{project.status}</span>{galleryCount > 1 && <span className="gallery-badge"><Images size={14} /> {galleryCount} photos</span>}</div>
    <div className="project-copy"><div><span className="micro">{project.category} · {project.location}</span><h3>{project.title}</h3></div><ArrowUpRight /></div>
    {project.stat && <p className="project-stat">{project.stat}</p>}
  </Link>;
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>;
}
export function Input({ label, hint, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return <Field label={label} hint={hint}><input {...props} /></Field>;
}
export function Textarea({ label, hint, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string }) {
  return <Field label={label} hint={hint}><textarea {...props} /></Field>;
}
export function Select({ label, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: ReactNode }) {
  return <Field label={label}><select {...props}>{children}</select></Field>;
}

export function Submit({ busy, children }: { busy: boolean; children: ReactNode }) {
  return <button className="button form-submit" disabled={busy}>{busy ? <LoaderCircle className="spin" /> : <ArrowUpRight />}{busy ? "Please wait…" : children}</button>;
}

export function Status({ children }: { children: ReactNode }) {
  return <span className={`status status-${String(children).toLowerCase().replaceAll(" ", "-")}`}>{children}</span>;
}

export function Loading({ label = "Loading project information…" }: { label?: string }) {
  return <div className="page-loading"><LoaderCircle className="spin" /><p>{label}</p></div>;
}

export function Empty({ title, body }: { title: string; body: string }) {
  return <div className="empty-state"><span>—</span><h3>{title}</h3><p>{body}</p></div>;
}
