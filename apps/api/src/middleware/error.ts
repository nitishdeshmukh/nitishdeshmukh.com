import type { Context } from "hono";

export function errorHandler(err: Error, c: Context) {
  console.error("Worker error:", err.message);
  return c.json({ error: "Internal Server Error", message: err.message }, 500);
}
