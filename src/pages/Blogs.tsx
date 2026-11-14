import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { dateText, usePage } from "@/lib/site";
import { ConsultationCTA } from "@/components/SiteLayout";
import { Empty } from "@/components/SiteUI";

export default function Blogs() {
  const { page } = usePage("blogs");
  const query = trpc.public.posts.useQuery();
  return <>
    {/* ===== BLOGS HERO — MINIMAL, NO IMAGE ===== */}
    <section className="blogs-hero">
      <span className="eyebrow">Insights & Guides</span>
      <h1>{page.title}</h1>
      <p>{page.body}</p>
    </section>

    {/* ===== BLOG GRID ===== */}
    <section className="blog-grid">
      {(query.data ?? []).map((post) => (
        <Link to={`/blogs/${post.slug}`} className="blog-card" key={post.id}>
          <img src={post.image} alt={post.title} />
          <div className="blog-copy">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--burgundy)", fontWeight: 600 }}>{post.category}</span>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>{dateText(post.publishedAt)} · {post.readTime}</span>
            </div>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <span className="text-link">Read Guide <ArrowUpRight size={16} /></span>
          </div>
        </Link>
      ))}
      {!query.isLoading && query.data?.length === 0 && <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px" }}><Empty title="New guides are on the way" body="Our team is preparing practical construction notes for you." /></div>}
    </section>

    <ConsultationCTA title="Need advice for your specific project?" body="A general guide is a start. A focused consultation turns the information into your next practical step." />
  </>;
}
