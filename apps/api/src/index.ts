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

import { adminRolesRoute } from "./routes/admin/roles";
import { adminSocialLinksRoute } from "./routes/admin/social-links";
import { adminStackRoute } from "./routes/admin/stack";
import { adminExperienceRoute } from "./routes/admin/experience";
import { adminEducationRoute } from "./routes/admin/education";
import { adminProjectsRoute } from "./routes/admin/projects";
import { adminBlogRoute } from "./routes/admin/blog";
import { adminGuestbookRoute } from "./routes/admin/guestbook";
import { adminConfigRoute } from "./routes/admin/config";
import { adminUploadRoute } from "./routes/admin/upload";

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

// Admin Routes
app.route("/api/admin/roles", adminRolesRoute);
app.route("/api/admin/social-links", adminSocialLinksRoute);
app.route("/api/admin/stack", adminStackRoute);
app.route("/api/admin/experience", adminExperienceRoute);
app.route("/api/admin/education", adminEducationRoute);
app.route("/api/admin/projects", adminProjectsRoute);
app.route("/api/admin/blog", adminBlogRoute);
app.route("/api/admin/guestbook", adminGuestbookRoute);
app.route("/api/admin/config", adminConfigRoute);
app.route("/api/admin/upload", adminUploadRoute);

export default app;
