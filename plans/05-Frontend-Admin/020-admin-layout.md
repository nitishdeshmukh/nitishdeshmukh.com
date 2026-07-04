# Plan 020: Admin Layout + Dashboard

## Status
- **Priority**: P0 | **Effort**: M (3-5h) | **Risk**: LOW
- **Depends on**: 003 (workspace) | **Phase**: 05-Frontend-Admin

## Objective (Kya)
Build the admin panel shell for `apps/admin`:
1. Sidebar navigation with shadcn `Sidebar` component — links to all entity CRUD pages
2. Dashboard home page with entity counts (roles, projects, blog posts, guestbook, assets)
3. Responsive layout: collapsible sidebar on mobile
4. Sonner toast notifications for mutation feedback
5. API client utility that attaches `X-API-Key` header to all requests

## Timeline (Kab)
Start after workspace config (003). Blocks all admin CRUD pages (021-023).

## Implementation Strategy (Kaise)

### Directory structure
```
apps/admin/
├── app/
│   ├── layout.tsx              # Root layout with sidebar + sonner
│   ├── page.tsx                # Dashboard — entity count cards
│   ├── roles/page.tsx          # (created in 021)
│   ├── social-links/page.tsx
│   ├── stack/page.tsx
│   ├── experience/page.tsx
│   ├── education/page.tsx
│   ├── projects/page.tsx
│   ├── blog/page.tsx
│   ├── guestbook/page.tsx
│   ├── assets/page.tsx
│   └── settings/page.tsx
├── components/
│   ├── layout/
│   │   ├── admin-sidebar.tsx   # Sidebar with navigation links
│   │   └── sidebar-items.ts    # Navigation item definitions
│   └── api-provider.tsx        # React context with API client
└── lib/
    └── api-client.ts           # Fetch wrapper with API key header
```

### Sidebar navigation items
```typescript
const sidebarItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Roles", href: "/roles", icon: Tag },
  { title: "Social Links", href: "/social-links", icon: Link },
  { title: "Tech Stack", href: "/stack", icon: Layers },
  { title: "Experience", href: "/experience", icon: Briefcase },
  { title: "Education", href: "/education", icon: GraduationCap },
  { title: "Projects", href: "/projects", icon: FolderOpen },
  { title: "Blog", href: "/blog", icon: FileText },
  { title: "Guestbook", href: "/guestbook", icon: BookOpen },
  { title: "Assets", href: "/assets", icon: Music },
  { title: "Settings", href: "/settings", icon: Settings },
];
```

### API client — Secure Proxy Pattern

> ⚠️ **Security**: `API_SECRET` must NEVER be a `NEXT_PUBLIC_` env var. It would
> be bundled into the browser JS and visible to anyone via DevTools.
> The admin app proxies all requests through Next.js Route Handlers.

Architecture:
```
Admin Browser → POST /api/proxy/[...path] (Next.js Route Handler, server-side)
                  └── reads API_SECRET from server env (never sent to browser)
                  └── forwards to Hono Worker with X-API-Key header
```

`app/api/proxy/[...path]/route.ts` (server-side proxy):
```typescript
import { type NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_URL || "http://localhost:8787"; // no NEXT_PUBLIC_
const API_SECRET = process.env.API_SECRET || "";                 // no NEXT_PUBLIC_

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params.path, "GET");
}
export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params.path, "POST", await req.json());
}
export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params.path, "PUT", await req.json());
}
export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params.path, "DELETE");
}

async function proxy(req: NextRequest, path: string[], method: string, body?: unknown) {
  const url = `${API_BASE}/api/admin/${path.join("/")}`;
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", "X-API-Key": API_SECRET },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
```

`lib/api-client.ts` (browser-safe — calls the proxy, not the Worker directly):
```typescript
// Calls /api/proxy/* (the Next.js Route Handler above), NOT the Worker directly
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const proxyPath = endpoint.replace("/api/admin", "/api/proxy");
  const res = await fetch(proxyPath, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}
```

### Dashboard cards
Each card shows: entity icon, name, count, "Manage →" link.
Fetch counts via `GET /api/admin/{entity}` and count the results (or add
a dedicated `/api/admin/counts` endpoint if performance matters).

### Key design choices
- Admin uses `@workspace/ui` components (shared with public site)
- Sidebar uses shadcn `Sidebar`, `SidebarMenu`, `SidebarMenuItem`
- Toast notifications via `sonner` for all CRUD operations
- Protected by **Cloudflare Access** at the Pages level (no auth code in app)

**Verify**: `cd apps/admin && bun run dev` → admin panel loads on :3001 with sidebar.
**Verify**: Dashboard shows entity count cards.
**Verify**: Sidebar navigation works on desktop and mobile.

## Done Criteria
- [ ] Admin layout with sidebar navigation
- [ ] Dashboard page with entity count cards
- [ ] Sidebar responsive (collapsible on mobile)
- [ ] API client utility with API key header
- [ ] Sonner toast provider configured
- [ ] All navigation links point to correct routes
- [ ] `plans/README.md` 020 → DONE

## STOP Conditions
- `@workspace/ui` components not importable from admin app — ensure admin
  `package.json` has `"@workspace/ui": "workspace:*"` and `next.config.ts`
  has `transpilePackages: ["@workspace/ui"]`.
