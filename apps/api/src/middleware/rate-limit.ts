import { createMiddleware } from "hono/factory";

const requestCounts = new Map<string, { count: number; resetAt: number }>();

export const guestbookRateLimitMiddleware = createMiddleware(async (c, next) => {
  const ip = c.req.header("CF-Connecting-IP") ?? "unknown";
  const now = Date.now();
  const entry = requestCounts.get(ip);

  if (entry && now < entry.resetAt) {
    if (entry.count >= 5) {
      return c.json({ error: "Too many requests. Please try again later." }, 429);
    }
    entry.count++;
  } else {
    requestCounts.set(ip, { count: 1, resetAt: now + 60_000 }); // 1 minute
  }

  await next();
});
