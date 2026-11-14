import {
  mysqlTable, mysqlEnum, serial, varchar, text, longtext, int, bigint, boolean,
  timestamp, json, index, uniqueIndex,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  passwordHash: varchar("password_hash", { length: 255 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  adminRole: varchar("admin_role", { length: 40 }).default("super_admin"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const settings = mysqlTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("setting_key", { length: 120 }).notNull().unique(),
  value: text("setting_value").notNull(),
  group: varchar("setting_group", { length: 60 }).default("general").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export const pageContent = mysqlTable("page_content", {
  id: serial("id").primaryKey(),
  page: varchar("page", { length: 60 }).notNull().unique(),
  content: json("content").$type<Record<string, string>>().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export const services = mysqlTable("services", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  category: varchar("category", { length: 100 }).notNull(),
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  capabilities: json("capabilities").$type<string[]>().notNull(),
  image: text("image").notNull(),
  isPublished: boolean("is_published").default(true).notNull(),
  sortOrder: int("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = mysqlTable("projects", {
  id: serial("id").primaryKey(),
  serviceId: bigint("service_id", { mode: "number", unsigned: true }).references(() => services.id),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  category: varchar("category", { length: 100 }).notNull(),
  location: varchar("location", { length: 180 }).notNull(),
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  gallery: json("gallery").$type<string[]>().notNull(),
  stat: varchar("stat", { length: 100 }),
  completionDate: varchar("completion_date", { length: 60 }),
  status: mysqlEnum("status", ["ongoing", "completed", "upcoming"]).default("completed").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isPublished: boolean("is_published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogPosts = mysqlTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 220 }).notNull(),
  slug: varchar("slug", { length: 240 }).notNull().unique(),
  category: varchar("category", { length: 100 }).notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  image: text("image").notNull(),
  readTime: varchar("read_time", { length: 40 }).default("5 min read").notNull(),
  isPublished: boolean("is_published").default(true).notNull(),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const clients = mysqlTable("clients", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 180 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  company: varchar("company", { length: 180 }),
  location: varchar("location", { length: 180 }),
  status: mysqlEnum("status", ["new_lead", "contacted", "consultation_booked", "proposal", "active", "completed", "archived"]).default("new_lead").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [uniqueIndex("uq_client_email_phone").on(t.email, t.phone)]);

export const consultations = mysqlTable("consultations", {
  id: serial("id").primaryKey(),
  reference: varchar("reference", { length: 30 }).notNull().unique(),
  clientId: bigint("client_id", { mode: "number", unsigned: true }).notNull().references(() => clients.id),
  type: varchar("type", { length: 120 }).notNull(),
  projectCategory: varchar("project_category", { length: 120 }).notNull(),
  projectLocation: varchar("project_location", { length: 180 }).notNull(),
  description: text("description").notNull(),
  preferredDate: varchar("preferred_date", { length: 30 }).notNull(),
  preferredTime: varchar("preferred_time", { length: 30 }).notNull(),
  agreedFee: int("agreed_fee").default(0).notNull(),
  status: mysqlEnum("status", ["new_request", "pending_confirmation", "confirmed", "rescheduled", "completed", "cancelled"]).default("new_request").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [index("idx_consultation_date").on(t.preferredDate)]);

export const payments = mysqlTable("payments", {
  id: serial("id").primaryKey(),
  consultationId: bigint("consultation_id", { mode: "number", unsigned: true }).notNull().unique().references(() => consultations.id),
  amount: int("amount").notNull(),
  status: mysqlEnum("status", ["awaiting_payment", "evidence_submitted", "under_verification", "verified", "rejected"]).default("awaiting_payment").notNull(),
  evidenceKey: varchar("evidence_key", { length: 512 }),
  evidenceName: varchar("evidence_name", { length: 255 }),
  rejectionReason: text("rejection_reason"),
  verifiedBy: bigint("verified_by", { mode: "number", unsigned: true }).references(() => users.id),
  submittedAt: timestamp("submitted_at"),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const applications = mysqlTable("applications", {
  id: serial("id").primaryKey(),
  reference: varchar("reference", { length: 30 }).notNull().unique(),
  type: mysqlEnum("type", ["business", "professional"]).notNull(),
  name: varchar("name", { length: 180 }).notNull(),
  contactName: varchar("contact_name", { length: 180 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  location: varchar("location", { length: 180 }).notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  affiliations: text("affiliations"),
  servicesOffered: text("services_offered").notNull(),
  experience: varchar("experience", { length: 60 }),
  website: varchar("website", { length: 255 }),
  details: text("details"),
  documentKey: varchar("document_key", { length: 512 }),
  documentName: varchar("document_name", { length: 255 }),
  status: mysqlEnum("status", ["pending", "under_review", "approved", "rejected", "more_info"]).default("pending").notNull(),
  notes: text("notes"),
  isPublic: boolean("is_public").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const enquiries = mysqlTable("enquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 180 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  subject: varchar("subject", { length: 200 }).notNull(),
  message: text("message").notNull(),
  isResponded: boolean("is_responded").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = mysqlTable("notifications", {
  id: serial("id").primaryKey(),
  category: mysqlEnum("category", ["consultation", "payment", "application", "enquiry", "system"]).notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  description: text("description").notNull(),
  recordType: varchar("record_type", { length: 60 }),
  recordId: bigint("record_id", { mode: "number", unsigned: true }),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const activityLogs = mysqlTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).references(() => users.id),
  action: varchar("action", { length: 160 }).notNull(),
  module: varchar("module", { length: 80 }).notNull(),
  recordId: bigint("record_id", { mode: "number", unsigned: true }),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mediaFiles = mysqlTable("media_files", {
  id: serial("id").primaryKey(),
  key: varchar("file_key", { length: 512 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  contentType: varchar("content_type", { length: 100 }).notNull(),
  size: int("size").notNull(),
  content: longtext("content"),
  uploadedBy: bigint("uploaded_by", { mode: "number", unsigned: true }).references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
