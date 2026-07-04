import { Hono } from "hono";
import type { Env } from "../types";

const CACHE_TTL = 3600; // 1 hour in seconds
const API_URL = "https://github-contributions-api.jogruber.de/v4/nitishdeshmukh?y=last";

// Local dev in-memory fallback (resets on Worker restart, fine for dev)
const devCache = new Map<string, { data: unknown; expiresAt: number }>();

export const githubRoute = new Hono<Env>();

githubRoute.get("/contributions", async (c) => {
  const canUseEdgeCache = typeof caches !== "undefined";

  // --- Production: use Cloudflare Cache API ---
  if (canUseEdgeCache) {
    const cache = caches.default;
    const cacheKey = new Request("https://cache/github-contributions");
    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    const res = await fetch(API_URL);
    const data = await res.json();
    const response = Response.json(data, {
      headers: {
        "Cache-Control": `public, max-age=${CACHE_TTL}`,
      },
    });
    c.executionCtx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  }

  // --- Local dev: use in-memory fallback ---
  const now = Date.now();
  const hit = devCache.get("contributions");
  if (hit && hit.expiresAt > now) {
    return c.json(hit.data);
  }

  const res = await fetch(API_URL);
  const data = await res.json();
  devCache.set("contributions", { data, expiresAt: now + CACHE_TTL * 1000 });
  return c.json(data);
});
