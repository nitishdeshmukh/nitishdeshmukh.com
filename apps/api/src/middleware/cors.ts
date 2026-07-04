import { cors } from "hono/cors";

export const corsMiddleware = (allowedOrigins: string) =>
  cors({
    origin: allowedOrigins.split(","),
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "X-API-Key"],
  });
