# Plan 006: Admin API Routes + R2 Upload

> **Executor instructions**: Follow this plan step by step.

## Status

- **Priority**: P0
- **Effort**: L (6-10h)
- **Risk**: LOW
- **Depends on**: 004 (Hono scaffold)
- **Category**: backend, API, admin
- **Phase**: 02-Backend-Core

## Objective (Kya)

Implement all **admin** (API-key-authenticated) CRUD endpoints:
1. Full CRUD for: roles, social_links, stack, experience, education, projects, blog_posts, site_config
2. Guestbook moderation (approve/delete)
3. R2 file upload endpoint (audio files, images)
4. After each mutation, POST to PartyKit to broadcast real-time update (wired in plan 010)

## Timeline (Kab)

Can run in parallel with 005. Blocks admin panel (Phase 5).

## Implementation Strategy (Kaise)

### Route pattern — generic CRUD factory

Create a reusable CRUD route factory to avoid repetition:

```typescript
// src/lib/crud-factory.ts
import { Hono } from "hono";
import type { Env } from "../types";
import { createDb } from "@workspace/db/client";
import { eq } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth";

export function createCrudRoutes<T>(
  tableName: string,
  table: any,
  zodSchema: ZodSchema,
) {
  const routes = new Hono<Env>();
  routes.use("*", authMiddleware);

  // GET all
  routes.get(`/${tableName}`, async (c) => { ... });
  // GET by id
  routes.get(`/${tableName}/:id`, async (c) => { ... });
  // POST create
  routes.post(`/${tableName}`, async (c) => { ... });
  // PUT update
  routes.put(`/${tableName}/:id`, async (c) => { ... });
  // DELETE
  routes.delete(`/${tableName}/:id`, async (c) => { ... });

  return routes;
}
```

### R2 upload endpoint

```typescript
// src/routes/admin-upload.ts
adminRoutes.post("/upload", authMiddleware, async (c) => {
  const formData = await c.req.formData();
  const file = formData.get("file") as File;
  if (!file) return c.json({ error: "No file provided" }, 400);

  const key = `uploads/${Date.now()}-${file.name}`;
  await c.env.ASSETS_BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  return c.json({ key, url: `/api/assets/stream/${key}` });
});
```

### All admin route files

| File | Endpoints | Zod Schema |
|------|-----------|------------|
| `routes/admin/roles.ts` | CRUD `/admin/roles` | `createRoleSchema` |
| `routes/admin/social-links.ts` | CRUD `/admin/social-links` | `createSocialLinkSchema` |
| `routes/admin/stack.ts` | CRUD `/admin/stack` | `createStackSchema` |
| `routes/admin/experience.ts` | CRUD `/admin/experience` | `createExperienceSchema` |
| `routes/admin/education.ts` | CRUD `/admin/education` | `createEducationSchema` |
| `routes/admin/projects.ts` | CRUD `/admin/projects` | `createProjectSchema` |
| `routes/admin/blog.ts` | CRUD `/admin/blog` | `createBlogPostSchema` |
| `routes/admin/guestbook.ts` | `PUT /admin/guestbook/:id/approve`, `DELETE /admin/guestbook/:id` | — |
| `routes/admin/config.ts` | `GET/PUT /admin/config` | — |
| `routes/admin/upload.ts` | `POST /admin/upload` | — |

### PartyKit broadcast stub

Each mutation handler ends with a PartyKit broadcast (implemented fully in 010):

```typescript
// After successful mutation:
await notifyPartyKit(c.env.PARTYKIT_HOST, {
  type: "CONTENT_UPDATED",
  entity: tableName,
  action: "create", // or "update" or "delete"
  timestamp: Date.now(),
});
```

**Verify**: `curl -H "X-API-Key: test" http://localhost:8787/api/admin/roles` → returns data.
**Verify**: `curl -X POST -H "X-API-Key: test" -H "Content-Type: application/json" -d '{"title":"Test"}' http://localhost:8787/api/admin/roles` → creates entry.

## Done Criteria

- [ ] CRUD routes for all 8 entity types
- [ ] Guestbook moderation (approve/delete)
- [ ] R2 upload endpoint
- [ ] All admin routes protected by `authMiddleware`
- [ ] Zod validation on all POST/PUT bodies
- [ ] PartyKit broadcast stub in each mutation handler
- [ ] `npx tsc --noEmit` exits 0
- [ ] `plans/README.md` 006 → DONE

## STOP Conditions

- R2 upload fails with `FormData` parsing error — Cloudflare Workers may need
  specific handling. Report the error.
- Auth middleware doesn't apply to all admin routes — ensure `routes.use("*", authMiddleware)`.
