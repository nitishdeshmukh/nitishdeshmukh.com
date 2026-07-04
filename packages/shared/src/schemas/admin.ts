import { z } from "zod";

export const createRoleSchema = z.object({
  title: z.string().min(1).max(100),
  order: z.number().int().min(0).default(0),
});

export const createSocialLinkSchema = z.object({
  platform: z.string().min(1),
  url: z.string().url(),
  icon: z.string().min(1),
  order: z.number().int().min(0).default(0),
});

export const createStackItemSchema = z.object({
  name: z.string().min(1),
  iconUrl: z.string().url(),
  category: z.string().min(1),
  order: z.number().int().min(0).default(0),
});

export const createExperienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  description: z.string().optional(),
  logoUrl: z.string().url().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}$/, "Must be YYYY-MM"),
  endDate: z.string().regex(/^\d{4}-\d{2}$/, "Must be YYYY-MM").optional(),
  order: z.number().int().min(0).default(0),
});

export const createEducationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  field: z.string().min(1),
  logoUrl: z.string().url().optional(),
  startYear: z.number().int().min(1900),
  endYear: z.number().int().min(1900).optional(),
});

export const createProjectSchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  contentMdx: z.string().optional(),
  coverUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

export const createBlogPostSchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(200),
  excerpt: z.string().optional(),
  contentMdx: z.string().optional(),
  coverUrl: z.string().url().optional(),
  tags: z.array(z.string()).default([]),
  readingTime: z.number().int().min(1).optional(),
  publishedAt: z.string().datetime().optional(),
});

export const createGuestbookSchema = z.object({
  name: z.string().min(1).max(50),
  message: z.string().min(1).max(500),
});

export const createAssetSchema = z.object({
  title: z.string().min(1),
  artist: z.string().optional(),
  duration: z.number().int().min(1).optional(),
  fileKey: z.string().min(1),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().min(1).optional(),
});

export const updateSiteConfigSchema = z.object({
  value: z.string().min(1),
});
