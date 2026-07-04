import { Hono } from "hono";
import type { Env } from "../types";

export const healthRoute = new Hono<Env>();

healthRoute.get("/", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});
