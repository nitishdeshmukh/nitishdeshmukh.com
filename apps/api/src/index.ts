import { Hono } from "hono";
import type { Env } from "./types";
import { corsMiddleware } from "./middleware/cors";
import { errorHandler } from "./middleware/error";
import { healthRoute } from "./routes/health";

const app = new Hono<Env>();

// Global CORS middleware
app.use("*", (c, next) => corsMiddleware(c.env.ALLOWED_ORIGINS)(c, next));

// Error handler
app.onError(errorHandler);

// Routes
app.route("/api/health", healthRoute);

export default app;
