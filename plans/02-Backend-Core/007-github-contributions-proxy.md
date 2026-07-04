# Plan 007: GitHub Contributions Proxy

## Status
- **Priority**: P1 | **Effort**: S (1-2h) | **Risk**: LOW
- **Depends on**: 004 | **Phase**: 02-Backend-Core

## Objective (Kya)
Create a cached proxy endpoint `GET /api/github/contributions` that fetches the
GitHub contribution graph for `nitishdeshmukh` and caches it for 1 hour in the
Worker's Cache API to stay within free tier limits.

## Timeline (Kab)
After 004. Low priority — home page can show a skeleton while this is built.

## Implementation Strategy (Kaise)

### API source
Use the free `github-contributions-api.jogruber.de` service:
```
GET https://github-contributions-api.jogruber.de/v4/nitishdeshmukh?y=last
```
Returns JSON with contribution data per day (date, count, level 0-4).

### Caching strategy

Use Cloudflare's Cache API (free, edge-native). However, `caches.default` is
**only available in deployed Workers** — it is NOT available in `wrangler dev`
locally. Wrap all cache usage with an availability check:

```typescript
const CACHE_TTL = 3600; // 1 hour

// Local dev in-memory fallback (resets on restart, that's fine for dev)
const devCache = new Map<string, { data: unknown; expiresAt: number }>();

githubRoute.get("/github/contributions", async (c) => {
  const canUseEdgeCache = typeof caches !== "undefined";

  // --- Production: use Cloudflare Cache API ---
  if (canUseEdgeCache) {
    const cache = caches.default;
    const cacheKey = new Request("https://cache/github-contributions");
    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    const res = await fetch(
      "https://github-contributions-api.jogruber.de/v4/nitishdeshmukh?y=last"
    );
    const data = await res.json();
    const response = c.json(data);
    response.headers.set("Cache-Control", `public, max-age=${CACHE_TTL}`);
    c.executionCtx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  }

  // --- Local dev: use in-memory fallback ---
  const now = Date.now();
  const hit = devCache.get("contributions");
  if (hit && hit.expiresAt > now) {
    return c.json(hit.data);
  }

  const res = await fetch(
    "https://github-contributions-api.jogruber.de/v4/nitishdeshmukh?y=last"
  );
  const data = await res.json();
  devCache.set("contributions", { data, expiresAt: now + CACHE_TTL * 1000 });
  return c.json(data);
});
```

**Verify**: `curl http://localhost:8787/api/github/contributions` → returns contribution JSON.
**Verify**: Second request within 1h returns cached response (check response time).

## Done Criteria
- [ ] `src/routes/github.ts` exists with cached proxy
- [ ] Returns valid contribution data for `nitishdeshmukh`
- [ ] Cached for 1 hour via Cache API
- [ ] `plans/README.md` 007 → DONE

## STOP Conditions
- `github-contributions-api.jogruber.de` is down — use fallback:
  `https://github-contributions.vercel.app/api/v1/nitishdeshmukh`
- Cache API not available in local `wrangler dev` — works in production only;
  use a simple in-memory cache for local dev.
