import { Hono } from "hono";
import type { Env } from "../types";
import { createDb } from "@workspace/db/client";
import { eq } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth";
import { notifyPusher } from "./pusher";
import type { ZodSchema } from "zod";

export function createCrudRoutes(
  tableName: string,
  table: any,
  zodSchema: ZodSchema
) {
  const routes = new Hono<Env>();
  
  routes.use("*", authMiddleware);

  // GET all
  routes.get("/", async (c) => {
    const db = createDb(c.env.DB);
    const items = await db.select().from(table);
    return c.json(items);
  });

  // GET by id
  routes.get("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);

    const db = createDb(c.env.DB);
    const [item] = (await db.select().from(table).where(eq(table.id, id))) as any[];
    if (!item) return c.json({ error: "Not found" }, 404);
    
    return c.json(item);
  });

  // POST create
  routes.post("/", async (c) => {
    try {
      const body = await c.req.json();
      const data = zodSchema.parse(body);

      const db = createDb(c.env.DB);
      const [inserted] = (await db.insert(table).values(data as any).returning()) as any[];

      c.executionCtx.waitUntil(notifyPusher(c.env, tableName, "create"));

      return c.json(inserted, 201);
    } catch (error: any) {
      return c.json({ error: "Invalid data", details: error.errors || error.message }, 400);
    }
  });

  // PUT update
  routes.put("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);

    try {
      const body = await c.req.json();
      const data = zodSchema.parse(body);

      const db = createDb(c.env.DB);
      const [updated] = (await db.update(table).set(data as any).where(eq(table.id, id)).returning()) as any[];
      
      if (!updated) return c.json({ error: "Not found" }, 404);

      c.executionCtx.waitUntil(notifyPusher(c.env, tableName, "update"));

      return c.json(updated);
    } catch (error: any) {
      return c.json({ error: "Invalid data", details: error.errors || error.message }, 400);
    }
  });

  // DELETE
  routes.delete("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);

    const db = createDb(c.env.DB);
    const [deleted] = (await db.delete(table).where(eq(table.id, id)).returning()) as any[];
    
    if (!deleted) return c.json({ error: "Not found" }, 404);

    c.executionCtx.waitUntil(notifyPusher(c.env, tableName, "delete"));

    return c.json({ success: true });
  });

  return routes;
}
