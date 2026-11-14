import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { dateText } from "@/lib/site";
import { ConsultationCTA } from "@/components/SiteLayout";
import { Loading } from "@/components/SiteUI";

export default function BlogPost() {
  const { slug = "" } = useParams();
  const query = trpc.public.post.useQuery({ slug });
  if (query.isLoading) return <Loading label="Loading article…" />;
  if (!query.data) return <section className="not-found-inline"><h1>Article not found</h1><Link to="/blogs"><ArrowLeft /> Back to insights</Link></section>;
  const post = query.data;
  return <>
    <article className="article-page">
      <header><Link to="/blogs" className="text-link"><ArrowLeft /> All insights</Link><span className="eyebrow">{post.category}</span><h1>{post.title}</h1><p>{post.excerpt}</p><small>{dateText(post.publishedAt)} · {post.readTime}</small></header>
      <img className="article-hero" src={post.image} alt={post.title} />
      <div className="article-body">{post.body.split("\n").filter(Boolean).map((paragraph, i) => <p className={i % 2 === 1 && paragraph.length < 80 ? "article-subhead" : ""} key={i}>{paragraph}</p>)}<Link to="/consultation" className="button button-dark">Discuss your project <ArrowUpRight /></Link></div>
    </article>
    <ConsultationCTA />
  </>;
}
