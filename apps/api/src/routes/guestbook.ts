import { Hono } from "hono";
import type { Env } from "../types";
import { createDb } from "@workspace/db/client";
import { guestbook } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { createGuestbookSchema } from "@workspace/shared";
import { guestbookRateLimitMiddleware } from "../middleware/rate-limit";

export const guestbookRoute = new Hono<Env>();

guestbookRoute.get("/", async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select()
    .from(guestbook)
    .where(eq(guestbook.approved, true))
    .orderBy(desc(guestbook.createdAt));
  return c.json(items);
});

guestbookRoute.post("/", guestbookRateLimitMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const data = createGuestbookSchema.parse(body);
    
    const db = createDb(c.env.DB);
    const [inserted] = await db.insert(guestbook).values({
      name: data.name,
      message: data.message,
      approved: false, // Must be approved by admin
    }).returning();
    
    return c.json(inserted, 201);
  } catch (error: any) {
    return c.json({ error: "Invalid data", details: error.errors || error.message }, 400);
  }
});
