import { createMiddleware } from "hono/factory";
import type { Env } from "../types";

export const authMiddleware = createMiddleware<Env>(async (c, next) => {
  const apiKey = c.req.header("X-API-Key");
  if (!apiKey || apiKey !== c.env.API_SECRET) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
});
