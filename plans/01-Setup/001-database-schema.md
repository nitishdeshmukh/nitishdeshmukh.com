# Plan 001: Database Schema — Drizzle ORM + Cloudflare D1

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.

## Status

- **Priority**: P0 (must-have — everything depends on this)
- **Effort**: M (3-5h)
- **Risk**: LOW
- **Depends on**: —
- **Category**: setup, database
- **Phase**: 01-Setup

## Objective (Kya)

Create the `packages/db` workspace package containing:
1. Drizzle ORM schema definitions for all 10 D1 tables (SQLite dialect)
2. A typed database client factory `createDb(d1: D1Database)`
3. Auto-generated SQL migrations via `drizzle-kit generate`
4. A seed script with Nitish's profile data
5. Proper package exports so `apps/api` can `import { db, schema } from "@workspace/db"`

## Timeline (Kab)

**First task in the entire project** — blocks Phase 2 (API), Phase 4 (public
site data fetching), and Phase 5 (admin CRUD). Must be completed before any
API route can be written.

## Implementation Strategy (Kaise)

### Tech choices

| Tool | Version | Why |
|------|---------|-----|
| `drizzle-orm` | ^0.44 | Type-safe ORM, first-class D1/SQLite support |
| `drizzle-kit` | ^0.30 | Migration generation + studio (dev GUI) |
| `better-sqlite3` | ^11 | Local development without Cloudflare |

### Schema design rationale

D1 is SQLite under the hood. Key constraints:
- No `ENUM` type — use `TEXT` with Drizzle's type inference
- No `BOOLEAN` — use `INTEGER` (0/1) with Drizzle's boolean mode
- JSON stored as `TEXT` — Drizzle's `.json()` handles serialization
- Timestamps as `INTEGER` (Unix epoch) or `TEXT` (ISO string) — we use `TEXT`
  for human readability in D1 console

### Steps

#### Step 1: Create the package scaffold

```
packages/db/
├── package.json
├── tsconfig.json
├── drizzle.config.ts
└── src/
    ├── index.ts          # Re-exports schema + createDb
    ├── schema.ts          # All table definitions
    ├── client.ts          # createDb factory
    └── seed.ts            # Seed data
```

`package.json`:
```json
{
  "name": "@workspace/db",
  "version": "0.0.1",
  "type": "module",
  "private": true,
  "exports": {
    ".": "./src/index.ts",
    "./schema": "./src/schema.ts",
    "./client": "./src/client.ts"
  },
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx src/seed.ts",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "drizzle-orm": "^0.44.0"
  },
  "devDependencies": {
    "@workspace/typescript-config": "workspace:*",
    "drizzle-kit": "^0.30.0",
    "better-sqlite3": "^11.0.0",
    "@types/better-sqlite3": "^7.6.0",
    "tsx": "^4.0.0",
    "typescript": "^5"
  }
}
```

**Verify**: `cd packages/db && cat package.json` — file exists with correct content.

#### Step 2: Define the schema

`src/schema.ts` — define all 10 tables:

```typescript
// sql is required for default values like sql`(datetime('now'))`
import { sqliteTable, text, integer, sql } from "drizzle-orm/sqlite-core";

// 1. Roles — animated role text flip on hero
export const roles = sqliteTable("roles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),           // e.g. "Full Stack Developer"
  order: integer("order").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// 2. Social Links
export const socialLinks = sqliteTable("social_links", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  platform: text("platform").notNull(),     // "github", "linkedin", "twitter"
  url: text("url").notNull(),
  icon: text("icon").notNull(),             // Lucide icon name
  order: integer("order").notNull().default(0),
});

// 3. Tech Stack
export const stack = sqliteTable("stack", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  iconUrl: text("icon_url").notNull(),      // CDN URL to tech icon
  category: text("category").notNull(),     // "frontend", "backend", "tools"
  order: integer("order").notNull().default(0),
});

// 4. Experience Timeline
export const experience = sqliteTable("experience", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  company: text("company").notNull(),
  role: text("role").notNull(),
  description: text("description"),         // Markdown/plain text
  logoUrl: text("logo_url"),
  startDate: text("start_date").notNull(),  // "2024-01" format
  endDate: text("end_date"),                // null = present
  order: integer("order").notNull().default(0),
});

// 5. Education
export const education = sqliteTable("education", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  institution: text("institution").notNull(),
  degree: text("degree").notNull(),
  field: text("field").notNull(),
  logoUrl: text("logo_url"),
  startYear: integer("start_year").notNull(),
  endYear: integer("end_year"),             // null = ongoing
});

// 6. Projects
export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  contentMdx: text("content_mdx"),          // Full MDX content for detail page
  coverUrl: text("cover_url"),
  demoUrl: text("demo_url"),
  repoUrl: text("repo_url"),
  tags: text("tags", { mode: "json" }).$type<string[]>().default([]),
  featured: integer("featured", { mode: "boolean" }).default(false),
  order: integer("order").notNull().default(0),
  publishedAt: text("published_at").notNull().default(sql`(datetime('now'))`),
});

// 7. Blog Posts (metadata only — MDX content lives in filesystem or contentMdx)
export const blogPosts = sqliteTable("blog_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  contentMdx: text("content_mdx"),          // Full MDX content
  coverUrl: text("cover_url"),
  tags: text("tags", { mode: "json" }).$type<string[]>().default([]),
  readingTime: integer("reading_time"),     // minutes
  publishedAt: text("published_at"),        // null = draft
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

// 8. Guestbook
export const guestbook = sqliteTable("guestbook", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  message: text("message").notNull(),
  avatarUrl: text("avatar_url"),
  approved: integer("approved", { mode: "boolean" }).default(false),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// 9. Assets (audio files — metadata here, binary in R2)
export const assets = sqliteTable("assets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  artist: text("artist"),
  duration: integer("duration"),            // seconds
  fileKey: text("file_key").notNull(),      // R2 object key
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// 10. Site Config (key-value store for profile, bio, etc.)
export const siteConfig = sqliteTable("site_config", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});
```

**Verify**: `cd packages/db && npx tsc --noEmit` — no type errors.

#### Step 3: Create the client factory

`src/client.ts`:
```typescript
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function createDb(d1: D1Database) {
  return drizzle(d1, { schema });
}

export type Database = ReturnType<typeof createDb>;
```

#### Step 4: Create the barrel export

`src/index.ts`:
```typescript
export * from "./schema";
export { createDb, type Database } from "./client";
```

#### Step 5: Generate migrations

```bash
cd packages/db
npx drizzle-kit generate
```

This creates `migrations/0001_*.sql` with all CREATE TABLE statements.

**Verify**: `ls migrations/` — at least one `.sql` file exists.
**Verify**: Read the generated SQL — all 10 tables present with correct columns.

#### Step 6: Create the seed script

`src/seed.ts` — inserts Nitish's real profile data:

```typescript
// Seed data for nitishdeshmukh.com
// Run: bun run db:seed (after D1 database is created)

const seedData = {
  siteConfig: [
    { key: "name", value: "Nitish Deshmukh" },
    { key: "bio", value: "Part-Time Web Developer" },
    { key: "email", value: "contact@nitishdeshmukh.com" },
    { key: "profileImage", value: "/images/profile.jpg" },
    { key: "location", value: "India" },
  ],
  roles: [
    { title: "Full Stack Developer", order: 1 },
    { title: "Part-Time Web Developer", order: 2 },
    { title: "Open Source Enthusiast", order: 3 },
  ],
  socialLinks: [
    { platform: "github", url: "https://github.com/nitishdeshmukh", icon: "Github", order: 1 },
    { platform: "linkedin", url: "https://linkedin.com/in/nitish-deshmukh", icon: "Linkedin", order: 2 },
    { platform: "website", url: "https://nitishdeshmukh.com", icon: "Globe", order: 3 },
  ],
};
```

**Verify**: `npx tsc --noEmit` — seed file type-checks.

#### Step 7: Add to root workspace

Ensure `packages/db` is picked up by the root `"workspaces": ["apps/*", "packages/*"]`
in the root `package.json` — it already matches since `packages/db` is under `packages/`.

**Verify**: `cd /home/nitish/Project/nitish && bun install` — `@workspace/db` resolves.

## Test Plan

No unit tests for schema definitions (they are type-checked by TypeScript and
validated by Drizzle Kit's migration generator). The real test is:

1. `npx tsc --noEmit` passes in `packages/db`
2. `drizzle-kit generate` produces valid SQL
3. The generated SQL can be executed against a local SQLite database
4. Importing `@workspace/db` from `apps/api` resolves correctly

## Done Criteria

ALL must hold:

- [ ] `packages/db/package.json` exists with correct dependencies
- [ ] `packages/db/src/schema.ts` defines all 10 tables
- [ ] `packages/db/src/client.ts` exports `createDb` and `Database` type
- [ ] `packages/db/src/index.ts` barrel-exports everything
- [ ] `npx tsc --noEmit` exits 0 in `packages/db`
- [ ] `drizzle-kit generate` produces migration SQL
- [ ] `packages/db/src/seed.ts` exists with Nitish's profile data
- [ ] `bun install` at root resolves `@workspace/db`
- [ ] `plans/README.md` status row for 001 updated to DONE

## STOP Conditions

Stop and report back (do not improvise) if:

- Drizzle ORM does not support the D1 driver in the installed version — report
  the version number and error message.
- `drizzle-kit generate` fails — report the error. The schema may use unsupported
  SQLite features.
- `bun install` fails to resolve workspace dependencies — report the error and
  check the root `package.json` workspace config.
- TypeScript reports errors in the schema that cannot be resolved by adjusting
  types — report the exact error.

## Maintenance Notes

- When adding new tables, update `schema.ts`, run `drizzle-kit generate` to
  create a new migration, and update the seed script if needed.
- The `tags` columns use Drizzle's JSON mode (`{ mode: "json" }`) — under the
  hood this is `TEXT` in SQLite with automatic JSON.parse/stringify.
- `better-sqlite3` is a dev dependency for local development only. In production,
  the D1 binding is used directly via `drizzle-orm/d1`.
