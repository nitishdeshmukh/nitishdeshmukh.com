# Plan 002: Shared Types Package — `packages/shared`

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise.

## Status

- **Priority**: P0
- **Effort**: S (1-2h)
- **Risk**: LOW
- **Depends on**: 001 (needs schema types)
- **Category**: setup, types
- **Phase**: 01-Setup

## Objective (Kya)

Create the `packages/shared` workspace package containing:
1. TypeScript interfaces for all API request/response shapes
2. Zod validation schemas for admin form inputs (shared between admin UI + API)
3. WebSocket message type definitions for PartyKit real-time events
4. Constants: route map, API base URLs, weather code → visual state mapping

This ensures `apps/web`, `apps/admin`, and `apps/api` all share the same types
without duplication.

## Timeline (Kab)

Second task — blocks API route typing (004-006) and admin form validation (021).
Small effort, do immediately after 001.

## Implementation Strategy (Kaise)

### Step 1: Create package scaffold

```
packages/shared/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts              # Barrel export
    ├── types/
    │   ├── api.ts            # API response shapes
    │   ├── websocket.ts      # WebSocket message types
    │   └── index.ts          # Barrel
    ├── schemas/
    │   ├── admin.ts          # Zod schemas for admin forms
    │   └── index.ts          # Barrel
    └── constants/
        ├── routes.ts         # Route definitions
        ├── weather.ts        # WMO code → visual state mapping
        └── index.ts          # Barrel
```

`package.json`:
```json
{
  "name": "@workspace/shared",
  "version": "0.0.1",
  "type": "module",
  "private": true,
  "exports": {
    ".": "./src/index.ts",
    "./types": "./src/types/index.ts",
    "./schemas": "./src/schemas/index.ts",
    "./constants": "./src/constants/index.ts"
  },
  "dependencies": {
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "@workspace/typescript-config": "workspace:*",
    "typescript": "^5"
  }
}
```

### Step 2: API response types (`src/types/api.ts`)

Typed interfaces inferred from the schema in 001, but decoupled (API layer may
shape data differently from DB rows):

```typescript
export interface ProfileResponse {
  name: string;
  bio: string;
  email: string;
  profileImage: string;
  location: string;
  roles: Role[];
  socialLinks: SocialLink[];
}

export interface Role { id: number; title: string; order: number; }
export interface SocialLink { id: number; platform: string; url: string; icon: string; }
export interface StackItem { id: number; name: string; iconUrl: string; category: string; }
export interface ExperienceEntry { ... }
export interface EducationEntry { ... }
export interface Project { ... }
export interface BlogPost { ... }
export interface GuestbookEntry { id: number; name: string; message: string; createdAt: string; }
export interface AudioAsset { ... }

// Paginated response wrapper
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

### Step 3: WebSocket message types (`src/types/websocket.ts`)

```typescript
export type WSMessageType = "CONTENT_UPDATED" | "GUESTBOOK_NEW";

export interface WSMessage {
  type: WSMessageType;
  entity: string;        // "roles" | "projects" | "blog_posts" | ...
  action: "create" | "update" | "delete";
  data?: unknown;
  timestamp: number;
}

export interface WSGuestbookMessage {
  type: "GUESTBOOK_NEW";
  entry: GuestbookEntry;
  timestamp: number;
}
```

### Step 4: Zod admin schemas (`src/schemas/admin.ts`)

```typescript
import { z } from "zod";

export const createRoleSchema = z.object({
  title: z.string().min(1).max(100),
  order: z.number().int().min(0).default(0),
});

export const createProjectSchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  contentMdx: z.string().optional(),
  coverUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
});

export const createBlogPostSchema = z.object({ ... });
export const createGuestbookSchema = z.object({
  name: z.string().min(1).max(50),
  message: z.string().min(1).max(500),
});
// ... schemas for all entities
```

### Step 5: Constants (`src/constants/routes.ts`, `src/constants/weather.ts`)

```typescript
// routes.ts
export const API_BASE = "/api";
export const ROUTES = {
  home: "/",
  blog: "/blog",
  projects: "/projects",
  guestbook: "/guestbook",
  meeting: "/meeting",
  music: "/music",
} as const;

// weather.ts — WMO weather interpretation codes
export const WEATHER_STATES = {
  sunny: [0, 1],                    // Clear sky, mainly clear
  cloudy: [2, 3, 45, 48],          // Partly cloudy, overcast, fog
  rainy: [51, 53, 55, 61, 63, 65, 80, 81, 82], // Drizzle, rain, showers
  snowy: [71, 73, 75, 77, 85, 86], // Snow, snow grains, snow showers
  stormy: [95, 96, 99],            // Thunderstorm
} as const;

export type WeatherState = keyof typeof WEATHER_STATES | "night";
```

**Verify**: `cd packages/shared && npx tsc --noEmit` — exits 0.
**Verify**: `cd /home/nitish/Project/nitish && bun install` — `@workspace/shared` resolves.

## Done Criteria

- [ ] `packages/shared/package.json` with exports and Zod dependency
- [ ] API response types cover all 10 entities
- [ ] WebSocket message types defined
- [ ] Zod schemas for all admin form inputs
- [ ] Constants for routes and weather codes
- [ ] `npx tsc --noEmit` exits 0
- [ ] `bun install` at root resolves the package
- [ ] `plans/README.md` status row for 002 updated to DONE

## STOP Conditions

- Zod v4 API has changed from v3 and schemas don't compile — report the specific
  error. The project uses `zod@^4.4.3` (already in `packages/ui`).
- Circular dependency between `@workspace/db` and `@workspace/shared` — these
  packages must NOT depend on each other. `shared` defines its own interface types
  independent of Drizzle schema. Report if a circular dep is detected.
