# Plan 029: CI/CD Pipeline Setup

## Status
- **Priority**: P1 | **Effort**: S (1-2h) | **Risk**: LOW
- **Depends on**: 003, 027 (deploy scripts) | **Phase**: 07-Deployment

## Objective (Kya)
Create a GitHub Actions CI/CD pipeline that automatically:
1. Installs dependencies and checks types on every PR to `main`
2. Lints all workspaces
3. Auto-deploys all 4 apps (Web, Admin, API, PartyKit) on merge to `main`

## Timeline (Kab)
Final step. The deployment scripts (027) must work locally first.

## Implementation Strategy (Kaise)

### Step 1: CI Workflow (PR checks)
Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2

      - name: Install dependencies
        run: bun install

      - name: Lint
        run: bun run lint

      # Build MUST run before typecheck.
      # Next.js generates .next/types/** during build which contains
      # the PageProps global required by tsc --noEmit.
      # Running typecheck on a fresh checkout (no .next/) fails with
      # "Cannot find name 'PageProps'" — this is expected, not a code error.
      - name: Build
        run: bun run build
        env:
          # Provide non-secret public URLs so Next.js can prerender pages
          NEXT_PUBLIC_API_URL: http://localhost:8787
          NEXT_PUBLIC_PARTYKIT_HOST: localhost:1999

      - name: Typecheck
        run: bun run typecheck
```

### Step 2: CD Workflow (Deploy on merge)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
      CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
      PARTYKIT_TOKEN: ${{ secrets.PARTYKIT_TOKEN }}
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2

      - name: Install dependencies
        run: bun install

      # Deploy order matters: API first (web depends on it), then PartyKit,
      # then web and admin (they call the API at build/prerender time).
      - name: Deploy API
        working-directory: apps/api
        run: bun run deploy  # uses root wrangler@^4 via workspace

      - name: Deploy PartyKit
        working-directory: apps/party
        run: npx partykit deploy

      - name: Deploy Web
        working-directory: apps/web
        run: npx opennextjs-cloudflare build && npx wrangler pages deploy .open-next/assets --project-name=nitish-web
        env:
          NEXT_PUBLIC_API_URL: https://api.nitishdeshmukh.com
          NEXT_PUBLIC_PARTYKIT_HOST: nitish-party.partykit.dev

      - name: Deploy Admin
        working-directory: apps/admin
        run: npx opennextjs-cloudflare build && npx wrangler pages deploy .open-next/assets --project-name=nitish-admin
        env:
          API_URL: https://api.nitishdeshmukh.com
          API_SECRET: ${{ secrets.API_SECRET }}
```

> ⚠️ **Note**: Admin's `API_SECRET` is a server-side env var injected at deploy time.
> It is never a `NEXT_PUBLIC_` variable. See Plan 020 for the secure proxy pattern.

### Step 3: GitHub Secrets setup
Add these in **GitHub → Repo → Settings → Secrets → Actions**:

| Secret | How to get it |
|--------|---------------|
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard → right sidebar |
| `CLOUDFLARE_API_TOKEN` | CF Dashboard → Profile → API Tokens → Create Token (Pages + Workers + D1 + R2 Edit) |
| `PARTYKIT_TOKEN` | Run `npx partykit login` locally, then `cat ~/.config/partykit/config.json` |
| `API_SECRET` | The same secret set via `wrangler secret put API_SECRET` in Plan 026 |

### Step 4: Fix wrangler version conflict

Root `package.json` already has `wrangler@^4.106.0`. Do NOT add a separate
`wrangler` dependency to `apps/api/package.json`. Use the root version by
referencing `wrangler` directly in scripts — Bun's workspace resolution will
find the root install:

```json
// apps/api/package.json
"scripts": {
  "dev": "wrangler dev --port 8787",
  "deploy": "wrangler deploy",
  "typecheck": "tsc --noEmit"
}
// NO wrangler in devDependencies here — use root version
```

### Step 5: Fix dev port assignments

To run all apps simultaneously without conflicts via `bun turbo dev`:

```json
// apps/web/package.json
"dev": "next dev --port 3000"

// apps/admin/package.json
"dev": "next dev --port 3001"

// apps/api/package.json
"dev": "wrangler dev --port 8787"

// apps/party/package.json
"dev": "partykit dev --port 1999"
```

## Done Criteria
- [ ] `.github/workflows/ci.yml` created
- [ ] `.github/workflows/deploy.yml` created
- [ ] Required secrets documented
- [ ] `plans/README.md` updated with Plan 029 → DONE

## STOP Conditions
- Deploy scripts failing locally — ensure plan 027 is fully tested before pushing to CI.
