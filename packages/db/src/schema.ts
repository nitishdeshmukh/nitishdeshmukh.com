import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// 1. Roles — animated role text flip on hero
export const roles = sqliteTable("roles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// 2. Social Links
export const socialLinks = sqliteTable("social_links", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  platform: text("platform").notNull(),
  url: text("url").notNull(),
  icon: text("icon").notNull(),
  order: integer("order").notNull().default(0),
});

// 3. Tech Stack
export const stack = sqliteTable("stack", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  iconUrl: text("icon_url").notNull(),
  category: text("category").notNull(),
  order: integer("order").notNull().default(0),
});

// 4. Experience Timeline
export const experience = sqliteTable("experience", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  company: text("company").notNull(),
  role: text("role").notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  order: integer("order").notNull().default(0),
});

// 5. Education
export const education = sqliteTable("education", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  institution: text("institution").notNull(),
  degree: text("degree").notNull(),
  field: text("field").notNull(),
  logoUrl: text("logo_url"),
  startYear: integer("start_year").notNull(),
  endYear: integer("end_year"),
});

// 6. Projects
export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  contentMdx: text("content_mdx"),
  coverUrl: text("cover_url"),
  demoUrl: text("demo_url"),
  repoUrl: text("repo_url"),
  tags: text("tags", { mode: "json" }).$type<string[]>().default([]),
  featured: integer("featured", { mode: "boolean" }).default(false),
  order: integer("order").notNull().default(0),
  publishedAt: text("published_at").notNull().default(sql`(datetime('now'))`),
});

// 7. Blog Posts
export const blogPosts = sqliteTable("blog_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  contentMdx: text("content_mdx"),
  coverUrl: text("cover_url"),
  tags: text("tags", { mode: "json" }).$type<string[]>().default([]),
  readingTime: integer("reading_time"),
  publishedAt: text("published_at"),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

// 8. Guestbook
export const guestbook = sqliteTable("guestbook", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  message: text("message").notNull(),
  avatarUrl: text("avatar_url"),
  approved: integer("approved", { mode: "boolean" }).default(false),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// 9. Assets
export const assets = sqliteTable("assets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  artist: text("artist"),
  duration: integer("duration"),
  fileKey: text("file_key").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// 10. Site Config
export const siteConfig = sqliteTable("site_config", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});
