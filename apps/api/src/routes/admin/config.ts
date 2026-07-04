import { Hono } from "hono";
import type { Env } from "../../types";
import { createDb } from "@workspace/db/client";
import { siteConfig } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { authMiddleware } from "../../middleware/auth";
import { updateSiteConfigSchema } from "@workspace/shared";
import { notifyPusher } from "../../lib/pusher";

export const adminConfigRoute = new Hono<Env>();

adminConfigRoute.use("*", authMiddleware);

adminConfigRoute.get("/", async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select().from(siteConfig);
  return c.json(items);
});

adminConfigRoute.put("/:key", async (c) => {
  const key = c.req.param("key");

  try {
    const body = await c.req.json();
    const data = updateSiteConfigSchema.parse(body);

    const db = createDb(c.env.DB);
    const [updated] = await db.update(siteConfig)
      .set({ value: data.value, updatedAt: new Date().toISOString() })
      .where(eq(siteConfig.key, key))
      .returning();
    
    if (!updated) {
      // Upsert if not found
      const [inserted] = await db.insert(siteConfig)
        .values({ key, value: data.value })
        .returning();
      
      c.executionCtx.waitUntil(notifyPusher(c.env, "site_config", "create"));
      return c.json(inserted);
    }

    c.executionCtx.waitUntil(notifyPusher(c.env, "site_config", "update"));
    return c.json(updated);
  } catch (error: any) {
    return c.json({ error: "Invalid data", details: error.errors || error.message }, 400);
  }
});
