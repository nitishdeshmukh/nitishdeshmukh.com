# Plan 010: Real-Time Broadcast Flow — API → PartyKit → Client

## Status
- **Priority**: P1 | **Effort**: M (3-5h) | **Risk**: MED
- **Depends on**: 006 (admin routes), 009 (PartyKit) | **Phase**: 03-Realtime

## Objective (Kya)
Wire the end-to-end real-time flow:
1. Admin makes a mutation via API Worker
2. Worker POSTs to PartyKit server via HTTP
3. PartyKit broadcasts to all connected WS clients
4. Client receives update and triggers SWR cache revalidation

## Timeline (Kab)
After both API admin routes and PartyKit server exist.

## Implementation Strategy (Kaise)

### API Worker → PartyKit notification helper
```typescript
// apps/api/src/lib/notify.ts
export async function notifyPartyKit(
  host: string,
  message: { type: string; entity: string; action: string }
) {
  try {
    await fetch(`https://${host}/parties/main`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...message, timestamp: Date.now() }),
    });
  } catch (e) {
    // Non-blocking — log but don't fail the mutation
    console.error("PartyKit notification failed:", e);
  }
}
```

### Integration into admin mutation handlers
Update each CRUD handler from plan 006 to call `notifyPartyKit()` after
successful DB operations, using `c.executionCtx.waitUntil()` for non-blocking.

### Message types (from `@workspace/shared`)
```typescript
{ type: "CONTENT_UPDATED", entity: "roles", action: "create", timestamp: ... }
{ type: "CONTENT_UPDATED", entity: "projects", action: "update", timestamp: ... }
{ type: "GUESTBOOK_NEW", entry: { name: "...", message: "..." }, timestamp: ... }
```

**Verify**: Admin creates a role → PartyKit broadcasts → connected client receives message.

## Done Criteria
- [ ] `notifyPartyKit()` helper created
- [ ] All admin mutation handlers call `notifyPartyKit()` via `waitUntil()`
- [ ] End-to-end test: mutation → broadcast → client receives message
- [ ] `plans/README.md` 010 → DONE
