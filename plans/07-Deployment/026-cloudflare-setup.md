# Plan 026: Cloudflare Setup — D1, R2, Pages, Access

## Status
- **Priority**: P0 | **Effort**: M (3-5h) | **Risk**: LOW
- **Depends on**: — (can start early) | **Phase**: 07-Deployment

## Objective (Kya)
Set up all Cloudflare resources for production:
1. Create D1 database and run migrations
2. Create R2 bucket for assets
3. Create two Cloudflare Pages projects (web, admin)
4. Configure Cloudflare Access for admin protection
5. Set API secrets via `wrangler secret`
6. Configure custom domain `nitishdeshmukh.com`

## Timeline (Kab)
Can start anytime — independent of code. Must be done before first deploy.

---

## ✅ Confirmed Credentials

| Resource | Value |
|----------|-------|
| **Account Email** | `nitishdeshmukh24@gmail.com` |
| **Account ID** | `a9374218e0d83ce555b45637269582f1` |
| **D1 Database ID** | `adc18aa4-27dd-47e3-b0fb-554474c73bd5` |
| **D1 Database Name** | `nitish-portfolio` |
| **R2 Bucket Name** | `nitishdeshmukh-assets` |
| **Pages: Web** | `nitish-web` → `https://nitishdeshmukh.com/` |
| **Pages: Admin** | `nitish-admin` → `https://admin.nitishdeshmukh.com/` |
| **API Secret** | `b09c411c9e26350ce69faecc99b2e9538486c006bee28edf8af999e090b0a7e2` |

> ⚠️ **Store the API Secret securely** — save it in a password manager.
> It must be set as a wrangler secret AND in Cloudflare Pages env vars.

---

## Implementation Strategy (Kaise)

### Step 1: Create Cloudflare D1 database — ✅ DONE
```
Database: nitish-portfolio
Database ID: adc18aa4-27dd-47e3-b0fb-554474c73bd5
Region: APAC
```
Use this ID in `apps/api/wrangler.toml`.

### Step 2: Run migrations — ⏳ After Plan 001
```bash
bun run wrangler d1 execute nitish-portfolio \
  --file=packages/db/migrations/0001_init.sql \
  --remote
```

### Step 3: Seed the database — ⏳ After Plan 001
```bash
bun run wrangler d1 execute nitish-portfolio \
  --file=packages/db/seed.sql \
  --remote
```

### Step 4: Create R2 bucket — ✅ DONE
```bash
bun run wrangler r2 bucket create nitishdeshmukh-assets
```

### Step 5: Set Worker API secret — ⏳ After Plan 004 (apps/api scaffold exists)
```bash
# From monorepo root — runs in apps/api context via turbo
cd apps/api
bun run wrangler secret put API_SECRET
# Paste: b09c411c9e26350ce69faecc99b2e9538486c006bee28edf8af999e090b0a7e2
```

### Step 6: Create Cloudflare Pages projects — ✅ DONE
```
nitish-web   → https://nitishdeshmukh.com/ (and https://nitish-web.pages.dev/)
nitish-admin → https://admin.nitishdeshmukh.com/ (and https://nitish-admin.pages.dev/)
```

### Step 7: Configure custom domain — ✅ DONE
In Cloudflare Dashboard (`nitishdeshmukh.com` is added):
1. Go to Pages → `nitish-web` → Custom Domains → Add `nitishdeshmukh.com`
2. Go to Pages → `nitish-admin` → Custom Domains → Add `admin.nitishdeshmukh.com`
3. Go to Workers → `nitish-api` → Custom Domains → Add `api.nitishdeshmukh.com`

### Step 8: Configure Cloudflare Access (free tier) — ⏳ After deploy
In Cloudflare Zero Trust Dashboard:
1. Create Access Application for `admin.nitishdeshmukh.com`
2. Add Access Policy: "Allow" → email = `nitishdeshmukh24@gmail.com`
3. This protects the entire admin subdomain — no auth code needed in the app

### Step 9: Environment variables for Pages — ⏳ After first deploy
Set in Cloudflare Pages dashboard → Settings → Environment Variables:

**For `nitish-web`** (public site):
```
NEXT_PUBLIC_API_URL        = https://api.nitishdeshmukh.com
NEXT_PUBLIC_PARTYKIT_HOST  = nitish-party.partykit.dev
```

**For `nitish-admin`** (admin panel — server-side only, no NEXT_PUBLIC_):
```
API_URL      = https://api.nitishdeshmukh.com
API_SECRET   = b09c411c9e26350ce69faecc99b2e9538486c006bee28edf8af999e090b0a7e2
```

> ⚠️ `API_SECRET` must NOT have `NEXT_PUBLIC_` prefix. It is read only inside
> Next.js Route Handlers (server-side). See Plan 020 for the secure proxy pattern.

---

## Done Criteria
- [x] D1 database created (`nitish-portfolio`, ID: `adc18aa4-27dd-47e3-b0fb-554474c73bd5`)
- [ ] D1 migrations run (after Plan 001)
- [ ] D1 database seeded (after Plan 001)
- [x] R2 bucket created (`nitishdeshmukh-assets`)
- [ ] API Worker secret set (after Plan 004)
- [x] Pages projects created (`nitish-web`, `nitish-admin`)
- [x] Custom domain configured (`nitishdeshmukh.com`)
- [ ] Cloudflare Access protecting admin (after first deploy)
- [ ] Env vars set in Pages (after first deploy)
- [ ] `plans/README.md` 026 → DONE

## STOP Conditions
- Custom domain DNS propagation taking time — wait a few minutes before verifying URLs.
