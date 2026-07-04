# Master Development Plan — nitishdeshmukh.com

> **Portfolio for Nitish Deshmukh** — Full-stack developer portfolio deployed on
> Cloudflare's free-tier edge network (Pages + Workers + D1 + R2) with real-time
> sync via PartyKit, admin CRUD panel, MDX blog, guestbook, weather-dynamic
> backgrounds, musical asset store, and AI/SEO-optimized outputs.
>
> ✅ **Plan reviewed by Senior Full Stack Developer on 2026-07-02**
> All 5 critical issues resolved. Plans updated accordingly.

---

## Architecture Summary

```
nitish/
├── apps/
│   ├── web/              # Public portfolio — Next.js 16 → Cloudflare Pages (:3000)
│   ├── admin/            # Admin panel — Next.js 16 → Cloudflare Pages (:3001)
│   ├── api/              # Cloudflare Worker (Hono) — REST API (:8787)
│   └── party/            # PartyKit server — real-time WebSocket sync (:1999)
├── packages/
│   ├── ui/               # Shared shadcn/ui components (existing)
│   ├── db/               # Drizzle ORM schema + D1 client
│   ├── shared/           # Shared types, constants, Zod schemas
│   ├── eslint-config/    # (existing)
│   └── typescript-config/ # (existing)
└── content/              # MDX blog posts (filesystem-based)
```

## Technology Decisions

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 16 + `@opennextjs/cloudflare` | RSC, App Router, edge support |
| Styling | Tailwind CSS v4 + shadcn/ui | Already configured |
| API | Hono v4 on Cloudflare Workers | Edge-native, typed, lightweight |
| Database | Drizzle ORM + Cloudflare D1 (SQLite) | Free tier, type-safe |
| Storage | Cloudflare R2 | Free 10GB, S3-compatible |
| Real-time | PartyKit | Free 20 concurrent connections |
| Auth | Cloudflare Access (admin) + API key (worker) | Free ≤50 users |
| Weather | Open-Meteo API | Free, no API key required |
| Animations | `motion` (not `framer-motion`) | React 19 compatible, tree-shakeable |
| Blog | next-mdx-remote + shiki | MDX with syntax highlighting |
| MDX Editor Preview | `@mdx-js/mdx evaluate()` | Browser-safe (serialize() is Node.js-only) |

## Plan Directory Structure

```
plans/
├── README.md                                      ← You are here
├── 01-Setup/
│   ├── 001-database-schema.md                     ← D1 schema with Drizzle ORM
│   ├── 002-shared-types-package.md                ← Shared types + Zod schemas
│   └── 003-turborepo-config.md                    ← Workspace + Turbo pipeline + port assignments
├── 02-Backend-Core/
│   ├── 004-hono-worker-scaffold.md                ← Hono app + wrangler.toml (no wrangler in app devDeps)
│   ├── 005-public-api-routes.md                   ← All public GET endpoints + guestbook rate limiting
│   ├── 006-admin-api-routes.md                    ← Admin CRUD + R2 upload (secure API key)
│   ├── 007-github-contributions-proxy.md          ← GitHub graph proxy + edge/local cache guard
│   └── 008-seo-outputs.md                         ← RSS, llms.txt, llms-full.txt
├── 03-Realtime/
│   ├── 009-partykit-server.md                     ← PartyKit server (port 1999)
│   └── 010-realtime-broadcast.md                  ← API → PartyKit → client flow
├── 04-Frontend-Public/
│   ├── 011-layout-navigation.md                   ← Root layout + floating dock (motion/react)
│   ├── 012-weather-background.md                  ← Dynamic weather CSS layer
│   ├── 013-home-page.md                           ← Hero + role flip (motion/react) + all sections
│   ├── 014-blog-mdx.md                            ← Blog index + post pages + MDX rendering
│   ├── 015-projects-archive.md                    ← Projects index + detail pages
│   ├── 016-guestbook.md                           ← Submit + real-time messages (motion/react)
│   ├── 017-meeting-page.md                        ← Cal.com embed
│   ├── 018-music-player.md                        ← Audio library + sticky player
│   └── 019-seo-metadata.md                        ← Sitemap, robots, OG, JSON-LD
├── 05-Frontend-Admin/
│   ├── 020-admin-layout.md                        ← Sidebar + secure proxy pattern (no NEXT_PUBLIC_API_KEY)
│   ├── 021-admin-crud-pages.md                    ← CRUD for all entities
│   ├── 022-mdx-editor.md                          ← MDX editor (@mdx-js/mdx evaluate, NOT serialize)
│   └── 023-asset-upload.md                        ← Drag-and-drop R2 upload UI
├── 06-Integration/
│   ├── 024-realtime-provider.md                   ← WebSocket provider + SWR invalidation
│   └── 025-admin-to-web-sync.md                   ← End-to-end real-time flow verification
└── 07-Deployment/
    ├── 026-cloudflare-setup.md                    ← D1, R2, Pages, Access config
    ├── 027-deploy-pipeline.md                     ← Build + deploy (turbo --filter, not cd)
    ├── 028-seed-and-verify.md                     ← Seed data + Lighthouse audit
    └── 029-ci-pipeline.md                         ← CI/CD: build→typecheck order, secrets table
```

---

## Task Tracker

| #   | Task                                | Phase        | Priority | Effort | Depends on | Status |
|-----|-------------------------------------|--------------|----------|--------|------------|--------|
| 001 | Database schema (Drizzle + D1)      | 01-Setup     | P0       | M      | —          | TODO   |
| 002 | Shared types package                | 01-Setup     | P0       | S      | 001        | TODO   |
| 003 | [Turborepo Config](./01-Setup/003-turborepo-config.md) | Update workspace graph and ports | ✅ DONE | —          | DONE   |
| 004 | [Hono Worker Scaffold](./02-Backend-Core/004-hono-worker-scaffold.md) | Initial API setup + middlewares | ✅ DONE | M | 001, 003 | DONE |
| 005 | Public API routes + rate limiting   | 02-Backend   | P0       | L      | 004        | TODO   |
| 006 | [Admin API Routes](./02-Backend-Core/006-admin-api-routes.md) | Admin CRUD & Upload endpoints | ✅ DONE |
| 007 | [GitHub Contributions Proxy](./02-Backend-Core/007-github-contributions-proxy.md) | Cached proxy for GitHub graph | ✅ DONE |
| 008 | [SEO Outputs](./02-Backend-Core/008-seo-outputs.md) | RSS, llms.txt, llms-full.txt | ✅ DONE |
| 009 | PartyKit → Pusher (replaced) | 03-Realtime | P1 | S | — | ✅ DONE (Pusher) |
| 010 | [Real-time broadcast flow](./03-Realtime/010-realtime-broadcast.md) | API → Pusher → Client | ✅ DONE |
| 011 | [Layout + Floating Dock](./04-Frontend-Public/011-layout-navigation.md) | Root layout, dock, mobile nav | ✅ DONE |
| 012 | [Weather Background](./04-Frontend-Public/012-weather-background.md) | Dynamic CSS weather + geolocation | ✅ DONE |
| 013 | [Home Page](./04-Frontend-Public/013-home-page.md) | Profile, graph, experience, stack | ✅ DONE |
| 014 | [Blog (MDX + shiki)](./04-Frontend-Public/014-blog-mdx.md) | Index cards, tag filtering, MDX rendering, syntax highlighting | ✅ DONE |
| 015 | [Projects archive](./04-Frontend-Public/015-projects-archive.md) | Grid, MDX detail page, URL tags | ✅ DONE |
| 016 | [Guestbook (real-time + motion)](./04-Frontend-Public/016-guestbook.md) | Form, validation, SWR, Pusher hooks, motion animations | ✅ DONE |
| 017 | [Meeting page (Cal.com)](./04-Frontend-Public/017-meeting-page.md) | Cal.com scheduling widget embed | ✅ DONE |
| 018 | [Music player](./04-Frontend-Public/018-music-player.md) | Audio tracks list, sticky global audio player | ✅ DONE |
| 019 | [SEO metadata](./04-Frontend-Public/019-seo-metadata.md) | Sitemap, robots.txt, dynamic OG, JSON-LD schema | ✅ DONE |
| 020 | [Admin layout + secure proxy](./05-Frontend-Admin/020-admin-layout.md) | Secure proxy pattern, shadcn sidebar layout | ✅ DONE |
| 021 | [Admin CRUD pages](./05-Frontend-Admin/021-admin-crud-pages.md) | 05-Admin     | P0       | XL     | 006, 020   | ✅ DONE |
| 022 | [MDX editor (@mdx-js/mdx)](./05-Frontend-Admin/022-mdx-editor.md) | 05-Admin     | P1       | L      | 021        | ✅ DONE |
| 023 | [Asset upload UI](./05-Frontend-Admin/023-asset-upload.md) | 05-Admin     | P1       | M      | 006, 020   | ✅ DONE |
| 024 | [Real-time provider](./06-Integration/024-realtime-provider.md) | 06-Integ     | P1       | M      | 009        | ✅ DONE |
| 025 | [Admin-to-web sync verification](./06-Integration/025-admin-to-web-sync.md) | 06-Integ     | P1       | M      | 010, 024   | ✅ DONE |
| 026 | [Cloudflare setup (D1, R2, Pages)](./07-Deployment/026-cloudflare-setup.md) | 07-Deploy    | P0       | M      | —          | ✅ DONE |
| 027 | [Deploy pipeline (turbo --filter)](./07-Deployment/027-deploy-pipeline.md) | 07-Deploy    | P1       | M      | 026        | ✅ DONE |
| 028 | [Seed + Lighthouse verify](./07-Deployment/028-seed-and-verify.md) | 07-Deploy    | P1       | M      | 027        | ✅ DONE |
| 029 | CI/CD pipeline (build→typecheck)    | 07-Deploy    | P1       | S      | 027        | TODO   |

**Effort key**: S = 1-2h, M = 3-5h, L = 6-10h, XL = 10h+
**Priority key**: P0 = must-have, P1 = should-have, P2 = nice-to-have

---

## Pre-flight Checklist (Before Writing Any Code)

- [ ] Cloudflare account created (free — cloudflare.com)
- [ ] `nitishdeshmukh.com` domain added to Cloudflare
- [ ] GitHub repo created with `main` branch (for CI/CD)
- [ ] Wrangler authenticated: `npx wrangler whoami`
- [ ] Bun working in WSL: `bun --version`
- [ ] PartyKit account: `npx partykit login`

---

## Recommended Execution Order

```
PHASE 0 — Pre-flight
  □ Complete all Pre-flight Checklist items above

PHASE 1 — Deployment Infrastructure (deploy first — validate hosting from day 1)
  026 → 027 → 029

PHASE 2 — Foundation
  001 → 002 → 003

PHASE 3 — API Layer
  004 → [005 + 006 in parallel] → 007 → 008

PHASE 4 — Real-time
  009 → 010

PHASE 5 — Public Site (after API + real-time)
  011 → [013 + 014 in parallel] → 015 → 016 → 012 → 017 → 018 → 019

PHASE 6 — Admin Panel
  020 → 021 → 022 → 023

PHASE 7 — Integration
  024 → 025

PHASE 8 — Polish
  028
```

---

## Resolved Decisions

| Decision | Choice |
|----------|--------|
| GitHub username | `nitishdeshmukh` |
| Cal.com username | `nitish-deshmukh-24` |
| Domain | `nitishdeshmukh.com` |
| Admin subdomain | `admin.nitishdeshmukh.com` |
| API subdomain | `api.nitishdeshmukh.com` |
| Name / Bio | Nitish Deshmukh / Part-Time Web Developer |
| Socials | GitHub: nitishdeshmukh, LinkedIn: nitish-deshmukh |
| Animation library | `motion` package, import from `motion/react` |
| MDX live preview | `@mdx-js/mdx evaluate()` (browser-safe) |
| Admin API security | Next.js Route Handler proxy (no `NEXT_PUBLIC_` secret) |
| Rate limiting | Cloudflare Dashboard rule (free) + code fallback |
| Wrangler version | Root workspace `wrangler@^4` only — not in app `devDependencies` |

---

## Free Tier Limits

| Service | Free Tier | Status |
|---------|-----------|--------|
| Cloudflare Workers | 100K req/day | ✅ Portfolio gets <1K/day |
| Cloudflare D1 | 5M reads/day, 5GB storage | ✅ ~100 rows total |
| Cloudflare R2 | 10GB, 1M ops/mo | ✅ Few audio files |
| Cloudflare Pages | 500 builds/mo | ✅ |
| Cloudflare Access | 50 users | ✅ 1 admin user |
| Cloudflare Rate Limiting | 10K requests/mo | ✅ Low traffic portfolio |
| PartyKit | 20 concurrent connections | ✅ Portfolio = 1-5 visitors |

---

## Critical Issues Fixed (Review 2026-07-02)

| # | Issue | Fixed In |
|---|-------|---------|
| 1 | `NEXT_PUBLIC_API_KEY` exposed admin secret in browser | Plan 020 |
| 2 | `wrangler` version conflict (v3 in app vs v4 in root) | Plans 004, 027, 029 |
| 3 | `next-mdx-remote serialize()` is Node.js-only, not browser-safe | Plan 022 |
| 4 | No rate limiting on public `POST /api/guestbook` | Plan 005 |
| 5 | Missing `sql` import in `drizzle-orm/sqlite-core` | Plan 001 |

---

Status values: `TODO` | `IN PROGRESS` | `DONE` | `BLOCKED: <reason>` | `REJECTED: <rationale>`
