import { Hono } from "hono";
import type { Env } from "./types";
import { corsMiddleware } from "./middleware/cors";
import { errorHandler } from "./middleware/error";
import { healthRoute } from "./routes/health";
import { profileRoute } from "./routes/profile";
import { stackRoute } from "./routes/stack";
import { experienceRoute } from "./routes/experience";
import { educationRoute } from "./routes/education";
import { projectsRoute } from "./routes/projects";
import { blogRoute } from "./routes/blog";
import { guestbookRoute } from "./routes/guestbook";
import { assetsRoute } from "./routes/assets";

const app = new Hono<Env>();

// Global CORS middleware
app.use("*", (c, next) => corsMiddleware(c.env.ALLOWED_ORIGINS)(c, next));

// Error handler
app.onError(errorHandler);

// Routes
app.route("/api/health", healthRoute);
app.route("/api/profile", profileRoute);
app.route("/api/stack", stackRoute);
app.route("/api/experience", experienceRoute);
app.route("/api/education", educationRoute);
app.route("/api/projects", projectsRoute);
app.route("/api/blog", blogRoute);
app.route("/api/guestbook", guestbookRoute);
app.route("/api/assets", assetsRoute);

export default app;
