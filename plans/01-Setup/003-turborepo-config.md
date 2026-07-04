# Plan 003: Turborepo Configuration Updates

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise.

## Status

- **Priority**: P0
- **Effort**: S (1-2h)
- **Risk**: LOW
- **Depends on**: —
- **Category**: setup, tooling
- **Phase**: 01-Setup

## Objective (Kya)

Update the Turborepo monorepo configuration to:
1. Register new workspace packages (`packages/db`, `packages/shared`)
2. Register new apps (`apps/api`, `apps/party`)
3. Add task pipelines for database, deploy, and party commands
4. Update `turbo.json` with correct build outputs for Workers/PartyKit
5. Add convenience root scripts
6. Set explicit dev ports for all 4 apps so `bun turbo dev` runs without conflicts

## Timeline (Kab)

Can run in parallel with 001. Unblocks all downstream app development.

## Implementation Strategy (Kaise)

### Step 1: Verify workspace detection

The root `package.json` already has `"workspaces": ["apps/*", "packages/*"]`.
New packages under these directories are auto-detected. Verify:

```bash
bun install
```

**Verify**: `bun install` completes without errors and all new packages resolve.

### Step 2: Update `turbo.json`

Replace the existing `turbo.json` with:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**", ".wrangler/**", ".open-next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "format": {
      "dependsOn": ["^format"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    },
    "db:generate": {
      "cache": false
    },
    "db:migrate": {
      "cache": false
    },
    "db:seed": {
      "cache": false
    },
    "deploy": {
      "dependsOn": ["build"],
      "cache": false
    }
  }
}
```

Key changes from existing `turbo.json`:
- `build.outputs` — added `dist/**`, `.wrangler/**`, `.open-next/**`
- New `db:*` tasks — cache: false (mutations)
- New `deploy` task — runs after build, cache: false

### Step 3: Set explicit dev ports for each app

To run all 4 dev servers simultaneously without port conflicts:

```json
// apps/web/package.json  — port 3000 (Next.js public site)
"dev": "next dev --port 3000"

// apps/admin/package.json — port 3001 (Next.js admin panel)
"dev": "next dev --port 3001"

// apps/api/package.json — port 8787 (Wrangler / Hono Worker)
"dev": "wrangler dev --port 8787"

// apps/party/package.json — port 1999 (PartyKit)
"dev": "partykit dev --port 1999"
```

With these set, `bun turbo dev` will start all 4 servers at the same time in
the Turborepo TUI.

### Step 4: Add root convenience scripts

Update root `package.json` scripts:

```json
{
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "format": "turbo format",
    "typecheck": "turbo typecheck",
    "db:generate": "turbo db:generate --filter=@workspace/db",
    "db:migrate": "turbo db:migrate --filter=@workspace/db",
    "db:seed": "turbo db:seed --filter=@workspace/db",
    "deploy:api": "turbo run deploy --filter=api",
    "deploy:web": "turbo run deploy --filter=web",
    "deploy:admin": "turbo run deploy --filter=admin",
    "deploy:party": "turbo run deploy --filter=party",
    "deploy:all": "turbo run deploy"
  }
}
```

> **Note**: Deploy scripts use `turbo run deploy --filter=<app>` instead of
> `cd apps/<app> && ...` because `cd` in bun scripts behaves inconsistently
> across shells (PowerShell vs bash). Turborepo's `--filter` flag is the
> idiomatic, cross-platform approach.

### Step 5: Verify task graph

```bash
bun turbo build --dry
```

**Verify**: Output shows all workspaces: `web`, `admin`, `api`, `party`,
`@workspace/db`, `@workspace/shared`, `@workspace/ui`.

**Verify**: `bun turbo typecheck` — runs typecheck across all packages.

## Done Criteria

- [ ] `turbo.json` updated with new tasks (`db:*`, `deploy`)
- [ ] `turbo.json` build outputs include `dist/**`, `.wrangler/**`, `.open-next/**`
- [ ] Root `package.json` has convenience scripts for db and deploy
- [ ] Explicit dev ports set in all 4 app `package.json` files
- [ ] `bun turbo build --dry` shows correct task graph including all 4 apps
- [ ] `bun turbo typecheck` passes for existing packages
- [ ] `plans/README.md` status row for 003 updated to DONE

## STOP Conditions

- Turborepo version incompatibility with new task config — report the error and
  the current turbo version (`npx turbo --version`).
- Workspace resolution fails after adding new packages — check that each new
  package has a valid `package.json` with a unique `name` field.
- Port conflict when running `bun turbo dev` — check that no other process
  uses ports 3000, 3001, 8787, or 1999 (`lsof -i :3000` in WSL).
