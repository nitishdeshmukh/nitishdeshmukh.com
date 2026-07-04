# Plan 004: Hono Worker Scaffold — `apps/api`

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise.

## Status

- **Priority**: P0
- **Effort**: M (3-5h)
- **Risk**: LOW
- **Depends on**: 001 (schema), 003 (workspace config)
- **Category**: backend, infrastructure
- **Phase**: 02-Backend-Core

## Objective (Kya)

Create the `apps/api` Cloudflare Worker application using the **Hono** framework:
1. Hono app with typed environment bindings (D1, R2, API_SECRET)
2. `wrangler.toml` with D1 database + R2 bucket bindings
3. CORS middleware (allow `nitishdeshmukh.com` + localhost)
4. Auth middleware for admin routes (API key validation)
5. Error handling middleware with structured JSON responses
6. Health check endpoint (`GET /api/health`)
7. Local dev working via `wrangler dev --port 8787`

## Timeline (Kab)

First backend task. Blocks all API routes (005-008). Start immediately after
Phase 1 is complete.

## Implementation Strategy (Kaise)

### Tech choices

| Tool | Why |
|------|-----|
| **Hono** v4 | Ultralight (14KB), edge-native, typed middleware, Workers-first |
| **Wrangler** v4 | Root-level install (`wrangler@^4.106.0` in root `package.json`) — do NOT add separately to `apps/api` |
| **drizzle-orm/d1** | Already set up in packages/db |

> ⚠️ **Wrangler version**: The root `package.json` already has `wrangler@^4.106.0`.
> Do NOT add `wrangler` to `apps/api/package.json` — it would create a version
> conflict. Reference the root `wrangler` from scripts directly (Bun workspace
> resolution finds it automatically).

### Directory structure

```
apps/api/
├── package.json
├── tsconfig.json
├── wrangler.toml
└── src/
    ├── index.ts              # Hono app entry point + exports
    ├── types.ts              # Env bindings type
    ├── middleware/
    │   ├── auth.ts           # API key validation for admin routes
    │   ├── cors.ts           # CORS configuration
    │   └── error.ts          # Global error handler
    ├── routes/               # Route handlers (created in 005, 006)
    │   └── health.ts         # Health check (created here)
    └── lib/
        └── db.ts             # createDb helper using env binding
```

### Step 1: Create package scaffold

`package.json`:
```json
{
  "name": "api",
  "version": "0.0.1",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "wrangler dev --port 8787",
    "build": "wrangler deploy --dry-run --outdir=dist",
    "deploy": "wrangler deploy",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "hono": "^4.7.0",
    "drizzle-orm": "^0.44.0",
    "@workspace/db": "workspace:*",
    "@workspace/shared": "workspace:*"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.0.0",
    "@workspace/typescript-config": "workspace:*",
    "typescript": "^5"
  }
}
```

> Note: No `wrangler` in `devDependencies` — it comes from the root workspace.

`wrangler.toml`:
```toml
name = "nitish-api"
main = "src/index.ts"
compatibility_date = "2025-01-01"
compatibility_flags = ["nodejs_compat"]
account_id = "a9374218e0d83ce555b45637269582f1"

[vars]
ALLOWED_ORIGINS = "https://nitishdeshmukh.com,https://admin.nitishdeshmukh.com,http://localhost:3000,http://localhost:3001"
PARTYKIT_HOST = "nitish-party.partykit.dev"

# Set via `bun run wrangler secret put API_SECRET` — never commit this value
# API_SECRET = "..."

[[d1_databases]]
binding = "DB"
database_name = "nitish-portfolio"
database_id = "adc18aa4-27dd-47e3-b0fb-554474c73bd5"

[[r2_buckets]]
binding = "ASSETS_BUCKET"
bucket_name = "nitishdeshmukh-assets"
```

### Step 2: Define environment type

`src/types.ts`:
```typescript
export type Env = {
  Bindings: {
    DB: D1Database;
    ASSETS_BUCKET: R2Bucket;
    API_SECRET: string;
    ALLOWED_ORIGINS: string;
    PARTYKIT_HOST: string;
  };
};
```

### Step 3: Create middleware

**Auth** (`src/middleware/auth.ts`):
```typescript
import { createMiddleware } from "hono/factory";
import type { Env } from "../types";

export const authMiddleware = createMiddleware<Env>(async (c, next) => {
  const apiKey = c.req.header("X-API-Key");
  if (!apiKey || apiKey !== c.env.API_SECRET) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
});
```

**CORS** (`src/middleware/cors.ts`):
```typescript
import { cors } from "hono/cors";

export const corsMiddleware = (allowedOrigins: string) =>
  cors({
    origin: allowedOrigins.split(","),
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "X-API-Key"],
  });
```

**Error handler** (`src/middleware/error.ts`):
```typescript
import type { Context } from "hono";

export function errorHandler(err: Error, c: Context) {
  console.error("Worker error:", err.message);
  return c.json({ error: "Internal Server Error", message: err.message }, 500);
}
```

### Step 4: Health check route

`src/routes/health.ts`:
```typescript
import { Hono } from "hono";
import type { Env } from "../types";

export const healthRoute = new Hono<Env>();

healthRoute.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});
```

### Step 5: Create Hono app entry point

`src/index.ts`:
```typescript
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
app.route("/api", healthRoute);

// Route stubs (filled in plans 005, 006):
// app.route("/api", profileRoute);
// app.route("/api", stackRoute);
// app.route("/api", experienceRoute);
// app.route("/api", educationRoute);
// app.route("/api", projectsRoute);
// app.route("/api", blogRoute);
// app.route("/api", guestbookRoute);
// app.route("/api", assetsRoute);
// app.route("/api", githubRoute);
// app.route("/api", seoRoute);
// app.route("/api/admin", adminRoutes);

export default app;
```

**Verify**: `wrangler dev --port 8787` starts successfully (run from `apps/api/`).
**Verify**: `curl http://localhost:8787/api/health` → `{"status":"ok","timestamp":"..."}`.
**Verify**: `npx tsc --noEmit` → exits 0.

## Done Criteria

- [ ] `apps/api/` created with package.json, wrangler.toml, tsconfig.json, src/
- [ ] `wrangler dev --port 8787` starts successfully
- [ ] `GET /api/health` returns `{"status":"ok"}`
- [ ] Auth middleware rejects requests without valid `X-API-Key` header
- [ ] CORS headers present in responses
- [ ] No `wrangler` in `apps/api/devDependencies` (uses root version)
- [ ] `npx tsc --noEmit` exits 0
- [ ] `plans/README.md` status 004 → DONE

## STOP Conditions

- `wrangler` command not found — ensure the root `bun install` was run and
  `wrangler@^4.106.0` is in root `devDependencies`. Do NOT add a separate
  `wrangler` version to `apps/api/package.json`.
- `hono` doesn't support Cloudflare Workers in the installed version — report
  the version (`bun pm ls hono`) and the error.
- D1 binding fails in local dev — run `wrangler dev --local` and add
  `--persist` flag if needed for persistent local D1 storage.
- Wrangler reports that `database_id` is a placeholder — that's expected at
  this stage. It will be replaced with the real ID from Plan 026.
