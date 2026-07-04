import { Hono } from "hono";
import type { Env } from "../types";
import { createDb } from "@workspace/db/client";
import { stack } from "@workspace/db/schema";

export const stackRoute = new Hono<Env>();

stackRoute.get("/", async (c) => {
  const db = createDb(c.env.DB);
  const stackItems = await db.select().from(stack).orderBy(stack.order);
  return c.json(stackItems);
});
