import { trpc } from "@/providers/trpc";

export const DEFAULT_SETTINGS: Record<string, string> = {
  "brand.phone": "0707 112 2510",
  "brand.whatsapp": "2347071122510",
  "brand.email": "info@srconstructions.ng",
  "brand.address": "Bics Mall, 61 Olusegun-Obasanjo Road, Port Harcourt",
  "brand.registration": "RC: 7682579",
  "consultation.mode": "free",
  "consultation.fee": "0",
};

export const DEFAULT_CONTENT: Record<string, Record<string, string>> = {
  home: {
    kicker: "Full-cycle construction · Across Nigeria", title: "We build with certainty.",
    body: "From the first drawing to the final handover, SR Construction brings engineering, site execution and accountable project delivery into one clear process.",
    heroImage: "/assets/hero-duplex.jpg", introTitle: "Quality you can see. Control you can feel.",
    introBody: "We coordinate design, engineering, materials and skilled site work around one standard: build it properly, communicate clearly and deliver without avoidable surprises.",
    image: "/assets/hero-structure.jpg", ctaTitle: "Your project deserves a clear, confident start.",
    ctaBody: "Book a consultation and speak directly with our project team. We will review your site, scope and timeline, then give you a practical roadmap with real numbers — no vague promises, no hidden steps.",
  },
  about: { kicker: "About SR Construction", title: "One team. One accountable standard.", body: "SR Construction is a Nigerian construction and engineering company operating from Port Harcourt and delivering projects across Nigeria.", heroImage: "/assets/hero-building.jpg", storyTitle: "Built around the work, not the noise.", storyBody: "We keep the brief, the technical decisions, the materials and the site work connected. Clients know what has been done, what comes next and who is responsible. That is how we protect quality, speed and trust from foundation to handover.", image: "/assets/project-apartments-wide.webp" },
  founder: { kicker: "The Founder", title: "Emmanuel Andrew Nwosu", role: "Founder, SR Construction", body: "Emmanuel Andrew Nwosu leads SR Construction with a clear conviction: clients should not have to choose between ambitious design and disciplined execution. His approach puts sound engineering, visible accountability and practical communication at the centre of every project.", quote: "A good build is not only about the finished structure. It is about the confidence the client has throughout the process.", photo: "/assets/founder.jpg", heroImage: "/assets/hero-structure.jpg" },
  services: { kicker: "Our Services", title: "Built properly from the ground up.", body: "Technical expertise, careful coordination and reliable site execution for residential, commercial and specialist projects.", heroImage: "/assets/service-concrete.jpg" },
  projects: { kicker: "Selected Work", title: "Proof, built in full view.", body: "Explore a selection of residential and hospitality projects delivered with close attention to structure, finish and function.", heroImage: "/assets/project-apartments-wide.webp" },
  network: { kicker: "Our Network", title: "Good work needs the right people.", body: "We welcome capable suppliers, vendors, artisans and built-environment professionals who share our commitment to quality and dependable delivery.", heroImage: "/assets/service-steel.webp" },
  contact: { kicker: "Contact SR Construction", title: "Let’s talk about what comes next.", body: "Share your project, question or partnership idea. Your message goes directly to our admin team for review and response.", heroImage: "/assets/handoff.jpg" },
  consultation: { kicker: "Book Your Consultation", title: "Get clarity before you commit.", body: "A 30-minute focused conversation with our project team. We will understand your site, scope and priorities, then give you a clear next step — whether that is a formal proposal, a site visit or a detailed scope review.", heroImage: "/assets/hero-foundation.jpg" },
  blogs: { kicker: "Insights & Guides", title: "Build with better information.", body: "Practical notes on construction decisions, project planning and delivery in Nigeria.", heroImage: "/assets/project-interior.webp" },
};

export function useSite() {
  const query = trpc.public.bootstrap.useQuery(undefined, { staleTime: 0, retry: 1, refetchOnWindowFocus: true });
  return {
    settings: { ...DEFAULT_SETTINGS, ...(query.data?.settings ?? {}) },
    content: query.data?.content ?? {},
    isLoading: query.isLoading,
  };
}

export function usePage(page: string) {
  const site = useSite();
  return { ...site, page: { ...(DEFAULT_CONTENT[page] ?? {}), ...(site.content[page] ?? {}) } };
}

export type Service = {
  id: number; name: string; slug: string; category: string; summary: string; description: string;
  capabilities: string[]; image: string; isPublished: boolean; sortOrder: number; createdAt: Date;
};
export type Project = {
  id: number; serviceId: number | null; title: string; slug: string; category: string; location: string;
  summary: string; description: string; image: string; gallery: string[]; stat: string | null;
  completionDate: string | null; status: "ongoing" | "completed" | "upcoming"; isFeatured: boolean; isPublished: boolean; createdAt: Date;
};
export type Post = {
  id: number; title: string; slug: string; category: string; excerpt: string; body: string; image: string;
  readTime: string; isPublished: boolean; publishedAt: Date; createdAt: Date;
};

export const money = (value: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);
export const dateText = (value: Date | string) => new Date(value).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
export const label = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (m) => m.toUpperCase());

export async function toBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
