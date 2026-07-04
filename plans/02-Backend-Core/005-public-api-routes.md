# Plan 005: Public API Routes

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. Stop and report at STOP conditions.

## Status

- **Priority**: P0
- **Effort**: L (6-10h)
- **Risk**: LOW
- **Depends on**: 004 (Hono scaffold)
- **Category**: backend, API
- **Phase**: 02-Backend-Core

## Objective (Kya)

Implement all **public** (unauthenticated) API endpoints in the Hono Worker:
1. Profile + roles + social links
2. Tech stack
3. Experience timeline
4. Education
5. Projects (all, featured, by slug)
6. Blog posts (all, recent, by slug)
7. Guestbook (approved entries, submit new — with rate limiting)
8. Audio assets (list, stream from R2)

Each endpoint queries D1 via Drizzle ORM and returns typed JSON.

## Timeline (Kab)

After 004. Can run in parallel with 006 (admin routes). Blocks all frontend
data-fetching in Phase 4.

## Implementation Strategy (Kaise)

### Route file pattern

Each route file exports a Hono instance mounted under `/api`:

```typescript
// src/routes/profile.ts
import { Hono } from "hono";
import type { Env } from "../types";
import { createDb } from "@workspace/db/client";
import { roles, socialLinks, siteConfig } from "@workspace/db/schema";

export const profileRoute = new Hono<Env>();

profileRoute.get("/profile", async (c) => {
  const db = createDb(c.env.DB);

  const [config, rolesList, links] = await Promise.all([
    db.select().from(siteConfig),
    db.select().from(roles).orderBy(roles.order),
    db.select().from(socialLinks).orderBy(socialLinks.order),
  ]);

  const configMap = Object.fromEntries(config.map(r => [r.key, r.value]));

  return c.json({
    name: configMap.name,
    bio: configMap.bio,
    profileImage: configMap.profileImage,
    location: configMap.location,
    roles: rolesList,
    socialLinks: links,
  });
});
```

### All route files to create

| File | Endpoints | D1 Tables |
|------|-----------|-----------|
| `routes/profile.ts` | `GET /api/profile` | `siteConfig`, `roles`, `socialLinks` |
| `routes/stack.ts` | `GET /api/stack` | `stack` |
| `routes/experience.ts` | `GET /api/experience` | `experience` |
| `routes/education.ts` | `GET /api/education` | `education` |
| `routes/projects.ts` | `GET /api/projects`, `GET /api/projects/featured`, `GET /api/projects/:slug` | `projects` |
| `routes/blog.ts` | `GET /api/blog`, `GET /api/blog/recent`, `GET /api/blog/:slug` | `blogPosts` |
| `routes/guestbook.ts` | `GET /api/guestbook`, `POST /api/guestbook` | `guestbook` |
| `routes/assets.ts` | `GET /api/assets`, `GET /api/assets/:id/stream` | `assets` + R2 |

### Key implementation details

- **Route ordering in Hono**: Specific routes MUST be registered before parameterized
  ones to avoid conflicts. Register `GET /api/projects/featured` BEFORE
  `GET /api/projects/:slug` — otherwise `:slug` catches `featured` first.

- **Projects featured**: `WHERE featured = true ORDER BY order LIMIT 4`
- **Blog recent**: `WHERE publishedAt IS NOT NULL ORDER BY publishedAt DESC LIMIT 4`
- **Guestbook GET**: Only returns `WHERE approved = true`
- **Guestbook POST**: Validates with Zod schema from `@workspace/shared`, inserts
  with `approved = false`
- **Assets stream**: Fetches from R2 bucket, returns with `Content-Type: audio/*`
  and `Accept-Ranges: bytes` headers for browser audio streaming / seek support
- All list endpoints support optional `?page=1&limit=20` query params

### Guestbook POST — Rate Limiting (Critical)

> ⚠️ Without rate limiting, bots can spam the guestbook and flood the admin queue.

**Option A (Recommended — zero code)**: Add a Cloudflare Rate Limiting rule in
the Cloudflare Dashboard after deploying Plan 026:
- Rule: `api.nitishdeshmukh.com/api/guestbook` (POST only)
- Limit: 5 requests per IP per minute
- Action: Block (returns 429)
- Cost: Free (included in Cloudflare free tier)

**Option B (Code-based fallback)**: Use `CF-Connecting-IP` header in a middleware:
```typescript
// src/middleware/rate-limit.ts
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
    requestCounts.set(ip, { count: 1, resetAt: now + 60_000 });
  }

  await next();
});
```

Apply this middleware only on `POST /api/guestbook`:
```typescript
guestbookRoute.post("/guestbook", guestbookRateLimitMiddleware, async (c) => { ... });
```

> Note: Option B is an in-memory store that resets on Worker cold-starts.
> Option A (Cloudflare Dashboard rule) is persistent and recommended.

### Audio streaming details

```typescript
// src/routes/assets.ts
assetsRoute.get("/assets/:id/stream", async (c) => {
  const { id } = c.req.param();
  const db = createDb(c.env.DB);
  const [asset] = await db.select().from(assets).where(eq(assets.id, Number(id)));
  if (!asset) return c.json({ error: "Not found" }, 404);

  const object = await c.env.ASSETS_BUCKET.get(asset.fileKey);
  if (!object) return c.json({ error: "File not found in storage" }, 404);

  return new Response(object.body, {
    headers: {
      "Content-Type": asset.mimeType,
      "Accept-Ranges": "bytes",  // enables browser audio seek
      "Content-Length": String(asset.sizeBytes ?? ""),
      "Cache-Control": "public, max-age=86400",
    },
  });
});
```

### Step-by-step

1. Create each route file under `src/routes/`
2. Mount each route in `src/index.ts` — specific routes before parameterized
3. Test each endpoint: `curl http://localhost:8787/api/{endpoint}`
4. Verify TypeScript: `npx tsc --noEmit`

**Verify per route**: `curl http://localhost:8787/api/{endpoint}` returns expected JSON.
**Verify**: `POST /api/guestbook` with missing fields returns validation errors.
**Verify**: `GET /api/assets/:id/stream` returns audio with `Accept-Ranges` header.
**Verify**: `npx tsc --noEmit` exits 0.

## Done Criteria

- [ ] All 8 route files created under `src/routes/`
- [ ] All routes mounted in `src/index.ts` (specific before parameterized)
- [ ] `GET /api/projects/featured` registered BEFORE `GET /api/projects/:slug`
- [ ] Each GET endpoint returns correct JSON structure
- [ ] `POST /api/guestbook` validates with Zod, inserts with `approved=false`
- [ ] Rate limiting on `POST /api/guestbook` (Option A or B)
- [ ] `GET /api/assets/:id/stream` streams audio from R2 with proper headers
- [ ] `npx tsc --noEmit` exits 0
- [ ] `plans/README.md` 005 → DONE

## STOP Conditions

- D1 query returns empty results — verify seed data exists (run Plan 001 seed
  script: `bun run db:seed`).
- R2 bucket binding not available locally — run `wrangler dev --local --persist`
  (the `--persist` flag keeps local R2 state between restarts).
- Drizzle query syntax doesn't match D1 driver — report the exact TypeScript or
  runtime error.
- `GET /api/projects/:slug` catches `featured` — ensure `featured` route is
  registered before `:slug` route in `projects.ts`.
