import { Hono } from "hono";
import type { Env } from "../types";
import { createDb } from "@workspace/db/client";
import { blogPosts } from "@workspace/db/schema";
import { isNotNull, desc, eq } from "drizzle-orm";

export const blogRoute = new Hono<Env>();

blogRoute.get("/recent", async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select()
    .from(blogPosts)
    .where(isNotNull(blogPosts.publishedAt))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(4);
  return c.json(items);
});

blogRoute.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const db = createDb(c.env.DB);
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
  
  if (!post) {
    return c.json({ error: "Blog post not found" }, 404);
  }
  return c.json(post);
});

blogRoute.get("/", async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select()
    .from(blogPosts)
    .where(isNotNull(blogPosts.publishedAt))
    .orderBy(desc(blogPosts.publishedAt));
  return c.json(items);
});
