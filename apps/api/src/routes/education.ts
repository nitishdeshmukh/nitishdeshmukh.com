import { Hono } from "hono";
import type { Env } from "../types";
import { createDb } from "@workspace/db/client";
import { education } from "@workspace/db/schema";
import { desc } from "drizzle-orm";

export const educationRoute = new Hono<Env>();

educationRoute.get("/", async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select().from(education).orderBy(desc(education.startYear));
  return c.json(items);
});
