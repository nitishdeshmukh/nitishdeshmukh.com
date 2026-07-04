# Plan 016: Guestbook — Real-Time (bucharitesh.in-inspired)

## Status
- **Priority**: P1 | **Effort**: M (3-5h) | **Risk**: MED
- **Depends on**: 005 (guestbook API), 009 (PartyKit) | **Phase**: 04-Frontend-Public

## Objective (Kya)
Build `/guestbook` with:
1. Submit form (name + message) with Zod validation
2. Real-time message list that updates instantly via PartyKit WebSocket
3. New messages animate in from top (`motion/react` — install: `bun add motion --filter=web`)
4. Only approved messages shown (admin approves via admin panel)

## Timeline (Kab)
After API and PartyKit are ready. Uses real-time — needs 009 completed.

## Implementation Strategy (Kaise)

### Components
- `submit-form.tsx` — Name + message inputs, Zod validation, POST to `/api/guestbook`
- `message-list.tsx` — Fetches approved messages via SWR, subscribes to PartyKit for live updates
- New entry flow: submit → API inserts (approved=false) → admin approves → API notifies PartyKit → all clients see it

### Real-time integration
```typescript
// Uses partysocket for WebSocket connection
import PartySocket from "partysocket";

const ws = new PartySocket({
  host: PARTYKIT_HOST,
  room: "main",
});

ws.addEventListener("message", (event) => {
  const msg = JSON.parse(event.data);
  if (msg.type === "GUESTBOOK_NEW") {
    // Prepend to message list with animation
    mutate("/api/guestbook"); // SWR revalidation
  }
});
```

### Message animation

```typescript
import { motion, AnimatePresence } from "motion/react"; // use motion, not framer-motion

<AnimatePresence>
  {messages.map(msg => (
    <motion.div
      key={msg.id}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <GuestbookMessage {...msg} />
    </motion.div>
  ))}
</AnimatePresence>
```

## Done Criteria
- [ ] Submit form with validation
- [ ] Message list renders approved entries
- [ ] Real-time updates via PartyKit
- [ ] New messages animate in
- [ ] Handles empty state (no messages yet)
- [ ] `plans/README.md` 016 → DONE
