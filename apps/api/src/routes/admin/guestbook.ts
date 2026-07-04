import { Hono } from "hono";
import type { Env } from "../../types";
import { createDb } from "@workspace/db/client";
import { guestbook } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { authMiddleware } from "../../middleware/auth";
import { notifyPusher } from "../../lib/pusher";

export const adminGuestbookRoute = new Hono<Env>();

adminGuestbookRoute.use("*", authMiddleware);

adminGuestbookRoute.get("/", async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select().from(guestbook).orderBy(desc(guestbook.createdAt));
  return c.json(items);
});

adminGuestbookRoute.put("/:id/approve", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);

  const db = createDb(c.env.DB);
  const [updated] = await db.update(guestbook)
    .set({ approved: true })
    .where(eq(guestbook.id, id))
    .returning();
  
  if (!updated) return c.json({ error: "Not found" }, 404);

  c.executionCtx.waitUntil(notifyPusher(c.env, "guestbook", "update"));

  return c.json(updated);
});

adminGuestbookRoute.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);

  const db = createDb(c.env.DB);
  const [deleted] = await db.delete(guestbook).where(eq(guestbook.id, id)).returning();
  
  if (!deleted) return c.json({ error: "Not found" }, 404);

  c.executionCtx.waitUntil(notifyPusher(c.env, "guestbook", "delete"));

  return c.json({ success: true });
});
