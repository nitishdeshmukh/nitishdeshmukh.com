import { Hono } from "hono";
import type { Env } from "../types";
import { createDb } from "@workspace/db/client";
import { assets } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";

export const assetsRoute = new Hono<Env>();

assetsRoute.get("/", async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select().from(assets).orderBy(desc(assets.createdAt));
  return c.json(items);
});

assetsRoute.get("/:id/stream", async (c) => {
  const idStr = c.req.param("id");
  const id = Number(idStr);
  
  if (isNaN(id)) {
    return c.json({ error: "Invalid ID" }, 400);
  }

  const db = createDb(c.env.DB);
  const [asset] = await db.select().from(assets).where(eq(assets.id, id));
  
  if (!asset) {
    return c.json({ error: "Asset metadata not found" }, 404);
  }

  const object = await c.env.ASSETS_BUCKET.get(asset.fileKey);
  
  if (!object) {
    return c.json({ error: "File not found in storage" }, 404);
  }

  return new Response(object.body, {
    headers: {
      "Content-Type": asset.mimeType,
      "Accept-Ranges": "bytes",
      "Content-Length": String(asset.sizeBytes ?? ""),
      "Cache-Control": "public, max-age=86400",
    },
  });
});
