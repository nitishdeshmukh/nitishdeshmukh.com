# Plan 010: Real-Time Broadcast Flow — API → Pusher → Client

## Status
- **Priority**: P1 | **Effort**: M (3-5h) | **Risk**: MED
- **Depends on**: 006 (admin routes) | **Phase**: 03-Realtime

## Objective (Kya)
Wire the end-to-end real-time flow:
1. Admin makes a mutation via API Worker
2. Worker triggers a Pusher event via HTTP
3. Pusher broadcasts to all connected WS clients
4. Client receives update and triggers SWR cache revalidation

## Timeline (Kab)
After API admin routes exist.

## Implementation Strategy (Kaise)

### Install Dependencies
```bash
bun add pusher --filter=api
```

### API Worker → Pusher notification helper
```typescript
// apps/api/src/lib/notify.ts
import Pusher from "pusher";

// Initialize Pusher in your route handler using environment variables
export async function notifyPusher(
  env: Env,
  message: { type: string; entity: string; action: string }
) {
  try {
    const pusher = new Pusher({
      appId: env.PUSHER_APP_ID,
      key: env.PUSHER_KEY,
      secret: env.PUSHER_SECRET,
      cluster: env.PUSHER_CLUSTER,
      useTLS: true,
    });

    await pusher.trigger("portfolio", "update", {
      ...message,
      timestamp: Date.now()
    });
  } catch (e) {
    // Non-blocking — log but don't fail the mutation
    console.error("Pusher notification failed:", e);
  }
}
```

### Integration into admin mutation handlers
Update each CRUD handler from plan 006 to call `notifyPusher(c.env, ...)` after
successful DB operations, using `c.executionCtx.waitUntil()` for non-blocking.

### Message types (from `@workspace/shared`)
```typescript
{ type: "CONTENT_UPDATED", entity: "roles", action: "create", timestamp: ... }
{ type: "CONTENT_UPDATED", entity: "projects", action: "update", timestamp: ... }
{ type: "GUESTBOOK_NEW", entry: { name: "...", message: "..." }, timestamp: ... }
```

**Verify**: Admin creates a role → Pusher broadcasts → connected client receives message.

## Done Criteria
- [ ] `notifyPusher()` helper created
- [ ] All admin mutation handlers call `notifyPusher()` via `waitUntil()`
- [ ] End-to-end test: mutation → broadcast → client receives message
- [ ] `plans/README.md` 010 → DONE
