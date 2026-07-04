import { Hono } from "hono";
import type { Env } from "../types";
import { createDb } from "@workspace/db/client";
import { projects } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";

export const projectsRoute = new Hono<Env>();

projectsRoute.get("/featured", async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select()
    .from(projects)
    .where(eq(projects.featured, true))
    .orderBy(projects.order)
    .limit(4);
  return c.json(items);
});

projectsRoute.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const db = createDb(c.env.DB);
  const [project] = await db.select().from(projects).where(eq(projects.slug, slug));
  
  if (!project) {
    return c.json({ error: "Project not found" }, 404);
  }
  return c.json(project);
});

projectsRoute.get("/", async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select().from(projects).orderBy(projects.order);
  return c.json(items);
});
