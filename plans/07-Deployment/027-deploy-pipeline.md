# Plan 027: Deploy Pipeline — Build + Deploy Commands

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on.

## Status

- **Priority**: P1
- **Effort**: M (3-5h)
- **Risk**: MED
- **Depends on**: 026 (Cloudflare setup)
- **Phase**: 07-Deployment

## Objective (Kya)

Configure and test the full deployment pipeline for all 4 apps:
1. API Worker → `wrangler deploy`
2. Web (public) → `@opennextjs/cloudflare` build → Cloudflare Pages
3. Admin → `@opennextjs/cloudflare` build → Cloudflare Pages
4. PartyKit → `wrangler deploy` (via partyserver)

## Timeline (Kab)

After Cloudflare resources exist (026). Must work locally before CI/CD pipeline (029).

## Implementation Strategy (Kaise)

### Step 1: Add deploy scripts to each app

Each app gets its own `deploy` script in `package.json`. The root uses
`turbo run deploy --filter=<app>` (not `cd apps/... &&` which is shell-dependent):

**`apps/api/package.json`**:
```json
"scripts": {
  "dev": "wrangler dev --port 8787",
  "build": "wrangler deploy --dry-run --outdir=dist",
  "deploy": "wrangler deploy",
  "typecheck": "tsc --noEmit"
}
```
> No `wrangler` in `devDependencies` — uses root `wrangler@^4.106.0`.

**`apps/web/package.json`**:
```json
"scripts": {
  "dev": "next dev --port 3000",
  "build": "next build",
  "deploy": "npx opennextjs-cloudflare build && wrangler pages deploy .open-next/assets --project-name=nitish-web",
  "typecheck": "tsc --noEmit"
}
```

**`apps/admin/package.json`**:
```json
"scripts": {
  "dev": "next dev --port 3001",
  "build": "next build",
  "deploy": "npx opennextjs-cloudflare build && wrangler pages deploy .open-next/assets --project-name=nitish-admin",
  "typecheck": "tsc --noEmit"
}
```

**`apps/party/package.json`**:
```json
"scripts": {
  "dev": "wrangler dev",
  "deploy": "wrangler deploy",
  "typecheck": "tsc --noEmit"
}
```

**Root `package.json`** — using `turbo run deploy --filter` (cross-platform, idiomatic):
```json
"scripts": {
  "deploy:api":   "turbo run deploy --filter=api",
  "deploy:web":   "turbo run deploy --filter=web",
  "deploy:admin": "turbo run deploy --filter=admin",
  "deploy:party": "turbo run deploy --filter=party",
  "deploy:all":   "turbo run deploy"
}
```

> ⚠️ **Why not `cd apps/api && wrangler deploy`?**
> `cd` in npm/bun scripts changes directory for that command only, but behaves
> inconsistently across PowerShell, CMD, and bash. The `turbo run deploy --filter`
> approach is cross-platform and the intended Turborepo pattern.

### Step 2: Configure `@opennextjs/cloudflare` for Web + Admin

Install in both Next.js apps:
```bash
bun add -D @opennextjs/cloudflare --filter=web
bun add -D @opennextjs/cloudflare --filter=admin
```

Add `open-next.config.ts` to **both** `apps/web/` and `apps/admin/`:
```typescript
import type { OpenNextConfig } from "@opennextjs/cloudflare";

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
    },
  },
};

export default config;
```

Update `next.config.ts` in both apps to use the adapter:
```typescript
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

// Only needed for local dev with CF bindings
if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

const nextConfig = {
  // ...existing config
};
export default nextConfig;
```

### Step 3: Deploy order (matters)

```
1. API Worker  → must be live before web/admin can call it at build time
2. PartyKit    → must be live before web includes its WS URL
3. Web         → builds with API_URL + PARTYKIT_HOST set in env
4. Admin       → builds with API_URL set in env
```

Verify each step before proceeding to the next.

### Step 4: Local deployment test (run in WSL)

```bash
# From monorepo root
bun run deploy:api
# Verify: https://api.nitishdeshmukh.com/api/health → {"status":"ok"}

bun run deploy:party
# Verify: connect WS to wss://nitish-party.<username>.workers.dev → CONNECTED message

bun run deploy:web
# Verify: https://nitishdeshmukh.com → portfolio home page loads

bun run deploy:admin
# Verify: https://admin.nitishdeshmukh.com → admin dashboard loads (or Cloudflare Access login)
```

### Step 5: Set env vars in Cloudflare Pages Dashboard

**For Web (`nitish-web`)** — in CF Pages → Settings → Environment Variables:
```
NEXT_PUBLIC_API_URL    = https://api.nitishdeshmukh.com
NEXT_PUBLIC_PARTYKIT_HOST = nitish-party.<your-username>.workers.dev
```

**For Admin (`nitish-admin`)** — in CF Pages → Settings → Environment Variables:
```
API_URL      = https://api.nitishdeshmukh.com   (server-side only — no NEXT_PUBLIC_)
API_SECRET   = <same value as wrangler secret API_SECRET>
```

> ⚠️ `API_SECRET` for admin must NOT have the `NEXT_PUBLIC_` prefix.
> It is only read inside Next.js Route Handlers (server-side), never in the
> browser. See Plan 020 for the secure proxy pattern.

**Verify**: `bun run deploy:all` → all 4 apps deploy successfully.
**Verify**: `https://api.nitishdeshmukh.com/api/health` → `{"status": "ok"}`
**Verify**: `https://nitishdeshmukh.com` → portfolio home page loads.
**Verify**: `https://admin.nitishdeshmukh.com` → Cloudflare Access login → admin panel.

## Done Criteria

- [ ] `deploy` script added to all 4 app `package.json` files
- [ ] `@opennextjs/cloudflare` configured for web and admin (open-next.config.ts)
- [ ] Root deploy scripts use `turbo run deploy --filter` (not `cd`)
- [ ] Env vars set correctly in Cloudflare Pages (no `NEXT_PUBLIC_API_SECRET`)
- [ ] All 4 deploy commands run successfully
- [ ] Production URLs respond correctly
- [ ] `plans/README.md` 027 → DONE

## STOP Conditions

- `@opennextjs/cloudflare` build fails with Next.js 16 — this is experimental.
  Fallback: downgrade web/admin to Next.js 15 (`bun add next@15 --filter=web`).
  Report the exact error output from `npx opennextjs-cloudflare build`.
- Cloudflare Pages deploy fails with "too many files" (>20,000 limit) — exclude
  the build cache by adding `!.next/cache/**` to your `.gitignore` and ensuring
  the Pages project's excluded files list is set.
- `wrangler: command not found` in deploy step — ensure root `bun install` was
  run so `wrangler@^4` from root devDependencies is available on PATH.
