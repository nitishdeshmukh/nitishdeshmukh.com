import { Hono } from "hono";
import type { Env } from "../types";
import { createDb } from "@workspace/db/client";
import { experience } from "@workspace/db/schema";
import { desc } from "drizzle-orm";

export const experienceRoute = new Hono<Env>();

experienceRoute.get("/", async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select().from(experience).orderBy(desc(experience.order));
  return c.json(items);
});
