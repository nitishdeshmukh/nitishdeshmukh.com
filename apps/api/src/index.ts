import { Hono } from "hono";
import { cors } from "hono/cors";

export type Env = {
  DB: D1Database;
  ASSETS_BUCKET: R2Bucket;
  API_SECRET: string;
  ALLOWED_ORIGINS: string;
  PARTYKIT_HOST: string;
};

const app = new Hono<{ Bindings: Env }>();

// Global Error Handler
app.onError((err, c) => {
  console.error(`[Error] ${err.message}`);
  return c.json({ error: "Internal Server Error" }, 500);
});

// Middleware: CORS
app.use("*", async (c, next) => {
  const origins = (c.env.ALLOWED_ORIGINS || "").split(",");
  const corsMiddleware = cors({
    origin: (origin) => {
      if (!origin || origins.includes(origin)) return origin;
      return null;
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "x-api-key"],
    credentials: true,
  });
  return corsMiddleware(c, next);
});

// Health check
app.get("/api/health", (c) => c.json({ status: "ok" }));

export default app;
