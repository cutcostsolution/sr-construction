import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, or, sql } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import {
  settings, pageContent, services, projects, blogPosts, clients,
  consultations, payments, applications, enquiries, notifications,
  activityLogs, mediaFiles,
} from "@db/schema";


const db = () => getDb();
const PUBLIC_SETTING_KEYS = [
  "brand.phone", "brand.whatsapp", "brand.email", "brand.address",
  "brand.registration", "consultation.mode", "consultation.fee",
];
const BANK_KEYS = ["payment.bank_name", "payment.account_name", "payment.account_number"];

async function settingMap(keys?: string[]) {
  const rows = await db().select().from(settings);
  return Object.fromEntries(rows.filter((r) => !keys || keys.includes(r.key)).map((r) => [r.key, r.value]));
}

async function imageUrl(value: string) {
  if (!value || value.startsWith("/") || value.startsWith("http") || value.startsWith("data:")) return value;
  return `/api/media?key=${encodeURIComponent(value)}`;
}

async function withImage<T extends { image: string; gallery?: string[] }>(row: T): Promise<T> {
  return {
    ...row,
    image: await imageUrl(row.image),
    ...(row.gallery ? { gallery: await Promise.all(row.gallery.map(imageUrl)) } : {}),
  };
}

async function publicContent() {
  const [settingRows, pageRows] = await Promise.all([
    db().select().from(settings), db().select().from(pageContent),
  ]);
  const publicSettings = Object.fromEntries(settingRows.filter((r) => PUBLIC_SETTING_KEYS.includes(r.key)).map((r) => [r.key, r.value]));
  const content: Record<string, Record<string, string>> = {};
  for (const row of pageRows) {
    content[row.page] = {};
    for (const [key, value] of Object.entries(row.content)) {
      content[row.page][key] = /image|hero|photo|logo/i.test(key) ? await imageUrl(value) : value;
    }
  }
  return { settings: publicSettings, content };
}

function reference(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function notify(category: "consultation" | "payment" | "application" | "enquiry" | "system", title: string, description: string, recordType: string, recordId: number) {
  await db().insert(notifications).values({ category, title, description, recordType, recordId });
}

async function audit(userId: number, action: string, module: string, recordId?: number, details?: string) {
  await db().insert(activityLogs).values({ userId, action, module, recordId, details });
}

const fileInput = z.object({
  name: z.string().min(1).max(255),
  contentBase64: z.string().min(1),
  contentType: z.string().max(100),
});
const consultationStatuses = ["new_request", "pending_confirmation", "confirmed", "rescheduled", "completed", "cancelled"] as const;
const paymentStatuses = ["awaiting_payment", "evidence_submitted", "under_verification", "verified", "rejected"] as const;
const applicationStatuses = ["pending", "under_review", "approved", "rejected", "more_info"] as const;

async function upload(file: z.infer<typeof fileInput>, folder: string) {
  const bytes = Uint8Array.from(Buffer.from(file.contentBase64, "base64"));
  if (bytes.byteLength > 5 * 1024 * 1024) throw new TRPCError({ code: "BAD_REQUEST", message: "File must be 5MB or smaller." });
  const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  if (!allowed.includes(file.contentType)) throw new TRPCError({ code: "BAD_REQUEST", message: "Upload a JPG, PNG, WEBP or PDF file." });
  const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name}`;
  await db().insert(mediaFiles).values({ key, name: file.name, contentType: file.contentType, size: bytes.byteLength, content: file.contentBase64 });
  return { key, fileName: file.name, contentType: file.contentType, size: bytes.byteLength };
}

async function bookingWithPayment(referenceValue: string, email: string) {
  const [row] = await db().select({ consultation: consultations, client: clients, payment: payments })
    .from(consultations).innerJoin(clients, eq(consultations.clientId, clients.id))
    .leftJoin(payments, eq(payments.consultationId, consultations.id))
    .where(and(eq(consultations.reference, referenceValue), eq(clients.email, email.trim().toLowerCase()))).limit(1);
  if (!row) throw new TRPCError({ code: "NOT_FOUND", message: "No booking matches that reference and email." });
  const config = await settingMap(BANK_KEYS);
  return {
    ...row,
    bank: row.consultation.agreedFee > 0 ? {
      bankName: config["payment.bank_name"], accountName: config["payment.account_name"], accountNumber: config["payment.account_number"],
    } : null,
  };
}

export const publicRouter = createRouter({
  bootstrap: publicQuery.query(publicContent),
  services: publicQuery.query(async () => {
    const rows = await db().select().from(services).where(eq(services.isPublished, true)).orderBy(asc(services.sortOrder), asc(services.id));
    return Promise.all(rows.map(withImage));
  }),
  service: publicQuery.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    const [service] = await db().select().from(services).where(and(eq(services.slug, input.slug), eq(services.isPublished, true))).limit(1);
    if (!service) throw new TRPCError({ code: "NOT_FOUND", message: "Service not found." });
    const related = await db().select().from(projects).where(and(eq(projects.serviceId, service.id), eq(projects.isPublished, true))).orderBy(desc(projects.isFeatured), desc(projects.createdAt));
    return { service: await withImage(service), projects: await Promise.all(related.map(withImage)) };
  }),
  projects: publicQuery.query(async () => {
    const rows = await db().select().from(projects).where(eq(projects.isPublished, true)).orderBy(desc(projects.isFeatured), desc(projects.createdAt));
    return Promise.all(rows.map(withImage));
  }),
  project: publicQuery.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    const [project] = await db().select().from(projects).where(and(eq(projects.slug, input.slug), eq(projects.isPublished, true))).limit(1);
    if (!project) throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });
    return withImage(project);
  }),
  posts: publicQuery.query(async () => {
    const rows = await db().select().from(blogPosts).where(eq(blogPosts.isPublished, true)).orderBy(desc(blogPosts.publishedAt));
    return Promise.all(rows.map(withImage));
  }),
  post: publicQuery.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    const [post] = await db().select().from(blogPosts).where(and(eq(blogPosts.slug, input.slug), eq(blogPosts.isPublished, true))).limit(1);
    if (!post) throw new TRPCError({ code: "NOT_FOUND", message: "Article not found." });
    return withImage(post);
  }),
  bookConsultation: publicQuery.input(z.object({
    name: z.string().trim().min(2).max(180), email: z.string().trim().email().max(320),
    phone: z.string().trim().min(7).max(50), company: z.string().trim().max(180).optional(),
    type: z.string().min(2).max(120), projectCategory: z.string().min(2).max(120),
    projectLocation: z.string().trim().min(2).max(180), description: z.string().trim().min(10).max(5000),
    preferredDate: z.string().min(8).max(30), preferredTime: z.string().min(3).max(30),
  })).mutation(async ({ input }) => {
    const email = input.email.toLowerCase();
    const config = await settingMap(["consultation.mode", "consultation.fee", ...BANK_KEYS]);
    const fee = config["consultation.mode"] === "paid" ? Math.max(0, Number(config["consultation.fee"] || 0)) : 0;
    const [existing] = await db().select().from(clients).where(or(eq(clients.email, email), eq(clients.phone, input.phone))).limit(1);
    let clientId = existing?.id;
    if (clientId) {
      await db().update(clients).set({ name: input.name, email, phone: input.phone, company: input.company || null, location: input.projectLocation, status: "consultation_booked" }).where(eq(clients.id, clientId));
    } else {
      [{ id: clientId }] = await db().insert(clients).values({ name: input.name, email, phone: input.phone, company: input.company || null, location: input.projectLocation, status: "consultation_booked" }).$returningId();
    }
    const ref = reference("SRC");
    const [{ id }] = await db().insert(consultations).values({
      reference: ref,
      clientId: clientId!,
      type: input.type,
      projectCategory: input.projectCategory,
      projectLocation: input.projectLocation,
      description: input.description,
      preferredDate: input.preferredDate,
      preferredTime: input.preferredTime,
      agreedFee: fee,
    }).$returningId();
    if (fee > 0) await db().insert(payments).values({ consultationId: id, amount: fee });
    await notify("consultation", "New consultation booked", `${input.name} · ${input.projectCategory} · ${input.preferredDate}`, "consultation", id);
    return {
      reference: ref, agreedFee: fee, email,
      bank: fee > 0 ? { bankName: config["payment.bank_name"], accountName: config["payment.account_name"], accountNumber: config["payment.account_number"] } : null,
    };
  }),
  booking: publicQuery.input(z.object({ reference: z.string().min(5), email: z.string().email() })).query(({ input }) => bookingWithPayment(input.reference, input.email)),
  submitPayment: publicQuery.input(z.object({ reference: z.string(), email: z.string().email(), evidence: fileInput })).mutation(async ({ input }) => {
    const booking = await bookingWithPayment(input.reference, input.email);
    if (!booking.payment) throw new TRPCError({ code: "BAD_REQUEST", message: "This booking does not require payment." });
    if (booking.payment.status === "verified") throw new TRPCError({ code: "CONFLICT", message: "This payment has already been verified." });
    const saved = await upload(input.evidence, "payment-evidence");
    await db().update(payments).set({ evidenceKey: saved.key, evidenceName: input.evidence.name, status: "evidence_submitted", submittedAt: new Date(), rejectionReason: null }).where(eq(payments.id, booking.payment.id));
    await notify("payment", "Payment evidence submitted", `${input.reference} is awaiting administrator verification.`, "payment", booking.payment.id);
    return { ok: true, status: "evidence_submitted" as const };
  }),
  networkApplication: publicQuery.input(z.object({
    type: z.enum(["business", "professional"]), name: z.string().trim().min(2).max(180),
    contactName: z.string().trim().min(2).max(180), email: z.string().trim().email(),
    phone: z.string().trim().min(7).max(50), location: z.string().trim().min(2),
    category: z.string().trim().min(2), affiliations: z.string().optional(),
    servicesOffered: z.string().trim().min(5), experience: z.string().optional(),
    website: z.string().optional(), details: z.string().optional(), document: fileInput.optional(),
  })).mutation(async ({ input }) => {
    const saved = input.document ? await upload(input.document, "network-applications") : null;
    const ref = reference(input.type === "business" ? "SRB" : "SRP");
    const { document: _document, ...data } = input;
    const [{ id }] = await db().insert(applications).values({ ...data, reference: ref, documentKey: saved?.key, documentName: input.document?.name }).$returningId();
    await notify("application", `New ${input.type} network application`, `${input.name} · ${input.category} · ${input.location}`, "application", id);
    return { ok: true, reference: ref };
  }),
  enquiry: publicQuery.input(z.object({
    name: z.string().trim().min(2), email: z.string().trim().email(), phone: z.string().optional(),
    subject: z.string().trim().min(2), message: z.string().trim().min(10).max(5000),
  })).mutation(async ({ input }) => {
    const [{ id }] = await db().insert(enquiries).values(input).$returningId();
    await notify("enquiry", "New website enquiry", `${input.name} · ${input.subject}`, "enquiry", id);
    return { ok: true };
  }),
});

const serviceInput = z.object({
  id: z.number().optional(), name: z.string().min(2), slug: z.string().optional(), category: z.string().min(2),
  summary: z.string().min(5), description: z.string().min(5), capabilities: z.array(z.string()),
  image: z.string().min(1), isPublished: z.boolean(), sortOrder: z.number().int(),
});
const projectInput = z.object({
  id: z.number().optional(), serviceId: z.number().nullable(), title: z.string().min(2), slug: z.string().optional(),
  category: z.string().min(2), location: z.string().min(2), summary: z.string().min(5), description: z.string().min(5),
  image: z.string().min(1), gallery: z.array(z.string()), stat: z.string().nullable(), completionDate: z.string().nullable(),
  status: z.enum(["ongoing", "completed", "upcoming"]), isFeatured: z.boolean(), isPublished: z.boolean(),
});
const postInput = z.object({
  id: z.number().optional(), title: z.string().min(2), slug: z.string().optional(), category: z.string().min(2),
  excerpt: z.string().min(5), body: z.string().min(10), image: z.string().min(1), readTime: z.string().min(2), isPublished: z.boolean(),
});

export const adminRouter = createRouter({
  dashboard: adminQuery.query(async () => {
    const [[allBookings], [newBookings], [allClients], [pendingApplications], [reviewPayments], [verifiedRevenue]] = await Promise.all([
      db().select({ value: sql<number>`count(*)` }).from(consultations),
      db().select({ value: sql<number>`count(*)` }).from(consultations).where(eq(consultations.status, "new_request")),
      db().select({ value: sql<number>`count(*)` }).from(clients),
      db().select({ value: sql<number>`count(*)` }).from(applications).where(eq(applications.status, "pending")),
      db().select({ value: sql<number>`count(*)` }).from(payments).where(sql`${payments.status} in ('evidence_submitted','under_verification')`),
      db().select({ value: sql<number>`coalesce(sum(${payments.amount}),0)` }).from(payments).where(eq(payments.status, "verified")),
    ]);
    const counts = {
      consultations: Number(allBookings?.value ?? 0),
      newConsultations: Number(newBookings?.value ?? 0),
      clients: Number(allClients?.value ?? 0),
      applications: Number(pendingApplications?.value ?? 0),
      payments: Number(reviewPayments?.value ?? 0),
      revenue: Number(verifiedRevenue?.value ?? 0),
    };
    const recent = await db().select({ consultation: consultations, client: clients, payment: payments }).from(consultations)
      .innerJoin(clients, eq(consultations.clientId, clients.id)).leftJoin(payments, eq(payments.consultationId, consultations.id))
      .orderBy(desc(consultations.createdAt)).limit(8);
    return { counts, recent };
  }),
  consultations: adminQuery.query(() => db().select({ consultation: consultations, client: clients, payment: payments }).from(consultations)
    .innerJoin(clients, eq(consultations.clientId, clients.id)).leftJoin(payments, eq(payments.consultationId, consultations.id)).orderBy(desc(consultations.createdAt))),
  updateConsultation: adminQuery.input(z.object({ id: z.number(), status: z.enum(consultationStatuses), notes: z.string().nullable(), preferredDate: z.string(), preferredTime: z.string() })).mutation(async ({ ctx, input }) => {
    await db().update(consultations).set(input).where(eq(consultations.id, input.id));
    await audit(ctx.user.id, "updated", "consultation", input.id, input.status);
    return { ok: true };
  }),
  updatePayment: adminQuery.input(z.object({ id: z.number(), status: z.enum(paymentStatuses), rejectionReason: z.string().optional() })).mutation(async ({ ctx, input }) => {
    if (input.status === "rejected" && !input.rejectionReason?.trim()) throw new TRPCError({ code: "BAD_REQUEST", message: "Give a reason for rejecting this evidence." });
    const [payment] = await db().select().from(payments).where(eq(payments.id, input.id)).limit(1);
    if (!payment) throw new TRPCError({ code: "NOT_FOUND" });
    await db().update(payments).set({ status: input.status, rejectionReason: input.rejectionReason || null, verifiedBy: input.status === "verified" ? ctx.user.id : null, verifiedAt: input.status === "verified" ? new Date() : null }).where(eq(payments.id, input.id));
    await audit(ctx.user.id, input.status === "verified" ? "verified_payment" : "updated_payment", "payment", input.id, input.rejectionReason);
    return { ok: true };
  }),
  evidenceUrl: adminQuery.input(z.object({ key: z.string() })).mutation(async ({ input }) => ({ url: await imageUrl(input.key) })),
  clients: adminQuery.query(() => db().select().from(clients).orderBy(desc(clients.createdAt))),
  updateClient: adminQuery.input(z.object({ id: z.number(), status: z.enum(["new_lead", "contacted", "consultation_booked", "proposal", "active", "completed", "archived"]), notes: z.string().nullable() })).mutation(async ({ ctx, input }) => {
    await db().update(clients).set(input).where(eq(clients.id, input.id)); await audit(ctx.user.id, "updated", "client", input.id, input.status); return { ok: true };
  }),
  applications: adminQuery.query(() => db().select().from(applications).orderBy(desc(applications.createdAt))),
  updateApplication: adminQuery.input(z.object({ id: z.number(), status: z.enum(applicationStatuses), notes: z.string().nullable(), isPublic: z.boolean() })).mutation(async ({ ctx, input }) => {
    await db().update(applications).set(input).where(eq(applications.id, input.id)); await audit(ctx.user.id, "updated", "application", input.id, input.status); return { ok: true };
  }),
  enquiries: adminQuery.query(() => db().select().from(enquiries).orderBy(desc(enquiries.createdAt))),
  respondEnquiry: adminQuery.input(z.object({ id: z.number(), isResponded: z.boolean() })).mutation(async ({ ctx, input }) => {
    await db().update(enquiries).set({ isResponded: input.isResponded }).where(eq(enquiries.id, input.id)); await audit(ctx.user.id, "updated", "enquiry", input.id); return { ok: true };
  }),
  services: adminQuery.query(() => db().select().from(services).orderBy(asc(services.sortOrder), asc(services.id))),
  saveService: adminQuery.input(serviceInput).mutation(async ({ ctx, input }) => {
    const data = { ...input, slug: slugify(input.slug || input.name) };
    if (input.id) await db().update(services).set(data).where(eq(services.id, input.id));
    else await db().insert(services).values(data);
    await audit(ctx.user.id, input.id ? "updated" : "created", "service", input.id, input.name); return { ok: true };
  }),
  deleteService: adminQuery.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    await db().update(projects).set({ serviceId: null }).where(eq(projects.serviceId, input.id));
    await db().delete(services).where(eq(services.id, input.id)); await audit(ctx.user.id, "deleted", "service", input.id); return { ok: true };
  }),
  projects: adminQuery.query(() => db().select().from(projects).orderBy(desc(projects.createdAt))),
  saveProject: adminQuery.input(projectInput).mutation(async ({ ctx, input }) => {
    const data = { ...input, slug: slugify(input.slug || input.title) };
    if (input.id) await db().update(projects).set(data).where(eq(projects.id, input.id));
    else await db().insert(projects).values(data);
    await audit(ctx.user.id, input.id ? "updated" : "created", "project", input.id, input.title); return { ok: true };
  }),
  deleteProject: adminQuery.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    await db().delete(projects).where(eq(projects.id, input.id)); await audit(ctx.user.id, "deleted", "project", input.id); return { ok: true };
  }),
  posts: adminQuery.query(() => db().select().from(blogPosts).orderBy(desc(blogPosts.publishedAt))),
  savePost: adminQuery.input(postInput).mutation(async ({ ctx, input }) => {
    const data = { ...input, slug: slugify(input.slug || input.title) };
    if (input.id) await db().update(blogPosts).set(data).where(eq(blogPosts.id, input.id));
    else await db().insert(blogPosts).values(data);
    await audit(ctx.user.id, input.id ? "updated" : "created", "blog", input.id, input.title); return { ok: true };
  }),
  deletePost: adminQuery.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    await db().delete(blogPosts).where(eq(blogPosts.id, input.id)); await audit(ctx.user.id, "deleted", "blog", input.id); return { ok: true };
  }),
  content: adminQuery.query(async () => ({ settings: await settingMap(), pages: await db().select().from(pageContent) })),
  updateSettings: adminQuery.input(z.object({ values: z.record(z.string(), z.string()) })).mutation(async ({ ctx, input }) => {
    for (const [key, value] of Object.entries(input.values)) {
      await db().insert(settings).values({ key, value, group: key.split(".")[0] }).onDuplicateKeyUpdate({ set: { value } });
    }
    await audit(ctx.user.id, "updated", "settings", undefined, Object.keys(input.values).join(", ")); return { ok: true };
  }),
  updatePage: adminQuery.input(z.object({ page: z.string(), content: z.record(z.string(), z.string()) })).mutation(async ({ ctx, input }) => {
    await db().insert(pageContent).values(input).onDuplicateKeyUpdate({ set: { content: input.content } });
    await audit(ctx.user.id, "updated", "page_content", undefined, input.page); return { ok: true };
  }),
  notifications: adminQuery.query(() => db().select().from(notifications).orderBy(desc(notifications.createdAt)).limit(100)),
  readNotification: adminQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await db().update(notifications).set({ isRead: true }).where(eq(notifications.id, input.id)); return { ok: true };
  }),
  readAllNotifications: adminQuery.mutation(async () => { await db().update(notifications).set({ isRead: true }).where(eq(notifications.isRead, false)); return { ok: true }; }),
  activity: adminQuery.query(() => db().select({ log: activityLogs, user: { name: sql<string>`(select name from users where id = ${activityLogs.userId})` } }).from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(200)),
  media: adminQuery.query(async () => {
    const rows = await db().select().from(mediaFiles).orderBy(desc(mediaFiles.createdAt));
    return rows.map((r) => ({ ...r, url: r.content ? `data:${r.contentType};base64,${r.content}` : `/api/media/${encodeURIComponent(r.key)}` }));
  }),
  uploadMedia: adminQuery.input(z.object({ file: fileInput })).mutation(async ({ ctx, input }) => {
    const saved = await upload(input.file, "media-library");
    await db().update(mediaFiles).set({ uploadedBy: ctx.user.id }).where(eq(mediaFiles.key, saved.key));
    await audit(ctx.user.id, "uploaded", "media", undefined, saved.key);
    return { key: saved.key, name: saved.fileName, url: `data:${saved.contentType};base64,${input.file.contentBase64}` };
  }),
  deleteMedia: adminQuery.input(z.object({ id: z.number(), key: z.string() })).mutation(async ({ ctx, input }) => {
    await db().delete(mediaFiles).where(eq(mediaFiles.id, input.id));
    await audit(ctx.user.id, "deleted", "media", input.id, input.key); return { ok: true };
  }),

  exportConsultations: adminQuery.query(async () => {
    const rows = await db().select({ consultation: consultations, client: clients, payment: payments }).from(consultations)
      .innerJoin(clients, eq(consultations.clientId, clients.id)).leftJoin(payments, eq(payments.consultationId, consultations.id)).orderBy(desc(consultations.createdAt));
    const headers = ["Reference", "Date", "Name", "Email", "Phone", "Company", "Type", "Category", "Location", "Preferred Date", "Preferred Time", "Agreed Fee", "Payment Status", "Consultation Status", "Notes"];
    const esc = (v: unknown) => `"${String(v).replace(/"/g, String.fromCharCode(34)+String.fromCharCode(34))}"`;
    const csv = [headers.join(","), ...rows.map((r) => [
      r.consultation.reference, r.consultation.createdAt.toISOString(), r.client.name, r.client.email, r.client.phone, r.client.company || "",
      r.consultation.type, r.consultation.projectCategory, r.consultation.projectLocation, r.consultation.preferredDate, r.consultation.preferredTime,
      r.consultation.agreedFee, r.payment?.status || "—", r.consultation.status, (r.consultation.notes || "").replace(/\n/g, " "),
    ].map(esc).join(","))].join("\n");
    return { csv, filename: `sr-consultations-${new Date().toISOString().split("T")[0]}.csv` };
  }),
  exportClients: adminQuery.query(async () => {
    const rows = await db().select().from(clients).orderBy(desc(clients.createdAt));
    const headers = ["ID", "Name", "Email", "Phone", "Company", "Location", "Status", "Notes", "Created"];
    const esc = (v: unknown) => `"${String(v).replace(/"/g, String.fromCharCode(34)+String.fromCharCode(34))}"`;
    const csv = [headers.join(","), ...rows.map((c) => [
      c.id, c.name, c.email, c.phone, c.company || "", c.location || "", c.status, (c.notes || "").replace(/\n/g, " "), c.createdAt.toISOString(),
    ].map(esc).join(","))].join("\n");
    return { csv, filename: `sr-clients-${new Date().toISOString().split("T")[0]}.csv` };
  }),
  exportApplications: adminQuery.query(async () => {
    const rows = await db().select().from(applications).orderBy(desc(applications.createdAt));
    const headers = ["Reference", "Date", "Type", "Name", "Contact", "Email", "Phone", "Location", "Category", "Services", "Experience", "Affiliations", "Website", "Status", "Notes"];
    const esc = (v: unknown) => `"${String(v).replace(/"/g, String.fromCharCode(34)+String.fromCharCode(34))}"`;
    const csv = [headers.join(","), ...rows.map((a) => [
      a.reference, a.createdAt.toISOString(), a.type, a.name, a.contactName, a.email, a.phone, a.location, a.category,
      a.servicesOffered, a.experience || "", a.affiliations || "", a.website || "", a.status, (a.notes || "").replace(/\n/g, " "),
    ].map(esc).join(","))].join("\n");
    return { csv, filename: `sr-applications-${new Date().toISOString().split("T")[0]}.csv` };
  }),
  exportEnquiries: adminQuery.query(async () => {
    const rows = await db().select().from(enquiries).orderBy(desc(enquiries.createdAt));
    const headers = ["ID", "Date", "Name", "Email", "Phone", "Subject", "Message", "Responded"];
    const esc = (v: unknown) => `"${String(v).replace(/"/g, String.fromCharCode(34)+String.fromCharCode(34))}"`;
    const csv = [headers.join(","), ...rows.map((e) => [
      e.id, e.createdAt.toISOString(), e.name, e.email, e.phone || "", e.subject, (e.message || "").replace(/\n/g, " "), e.isResponded ? "Yes" : "No",
    ].map(esc).join(","))].join("\n");
    return { csv, filename: `sr-enquiries-${new Date().toISOString().split("T")[0]}.csv` };
  }),
  exportPayments: adminQuery.query(async () => {
    const rows = await db().select({ payment: payments, client: clients, consultation: consultations }).from(payments)
      .innerJoin(consultations, eq(payments.consultationId, consultations.id))
      .innerJoin(clients, eq(consultations.clientId, clients.id))
      .where(eq(payments.status, "verified")).orderBy(desc(payments.verifiedAt));
    const headers = ["Payment ID", "Date", "Reference", "Client", "Email", "Amount", "Verified At", "Verified By"];
    const esc = (v: unknown) => `"${String(v).replace(/"/g, String.fromCharCode(34)+String.fromCharCode(34))}"`;
    const csv = [headers.join(","), ...rows.map((r) => [
      r.payment.id, r.payment.createdAt.toISOString(), r.consultation.reference, r.client.name, r.client.email,
      r.payment.amount, r.payment.verifiedAt?.toISOString() || "", r.payment.verifiedBy || "",
    ].map(esc).join(","))].join("\n");
    return { csv, filename: `sr-payments-${new Date().toISOString().split("T")[0]}.csv` };
  }),
});
