# Plan 009: PartyKit WebSocket Server — `apps/party`

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on.

## Status

- **Priority**: P1
- **Effort**: S (1-2h)
- **Risk**: LOW
- **Depends on**: —
- **Phase**: 03-Realtime

## Objective (Kya)

Create a PartyKit server that:
1. Accepts WebSocket connections from portfolio visitors
2. Receives HTTP POST broadcasts from the API Worker after admin mutations
3. Broadcasts update messages to all connected clients instantly
4. Free hobby tier: 20 concurrent connections (more than enough)

## Timeline (Kab)

Independent — can start anytime. Blocks real-time features (016 guestbook, 024 provider).

## Implementation Strategy (Kaise)

### Directory structure

```
apps/party/
├── package.json
├── partykit.json
└── src/
    └── server.ts
```

### `package.json`

```json
{
  "name": "party",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "partykit dev --port 1999",
    "build": "echo 'No build step for PartyKit'",
    "deploy": "npx partykit deploy",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "partykit": "^0.0.111"
  },
  "devDependencies": {
    "@workspace/typescript-config": "workspace:*",
    "typescript": "^5"
  }
}
```

> **Port 1999**: `partykit dev --port 1999` is required so all 4 dev servers
> can run simultaneously without port conflicts (see Plan 003).

### `partykit.json`

```json
{
  "$schema": "https://www.partykit.io/schema.json",
  "name": "nitish-party",
  "main": "src/server.ts",
  "compatibilityDate": "2025-01-01"
}
```

### `src/server.ts`

```typescript
import type * as Party from "partykit/server";

export default class SyncServer implements Party.Server {
  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection) {
    // Welcome message with live connection count
    conn.send(JSON.stringify({
      type: "CONNECTED",
      connections: [...this.room.getConnections()].length,
    }));
  }

  // HTTP POST from API Worker → broadcast to all WS clients
  async onRequest(req: Party.Request) {
    if (req.method === "POST") {
      const message = await req.json();
      this.room.broadcast(JSON.stringify(message));
      return new Response("OK", { status: 200 });
    }
    return new Response("Method not allowed", { status: 405 });
  }

  onMessage(message: string, sender: Party.Connection) {
    // Relay server-to-client only — no client-to-client messages needed yet
    // Future: add chat or cursor position sync here
  }

  onClose(conn: Party.Connection) {
    // Cleanup is automatic — PartyKit handles connection lifecycle
  }
}
```

**Verify**: `npx partykit dev --port 1999` starts successfully in `apps/party/`.
**Verify**: Connect via WebSocket in DevTools → receives `CONNECTED` message.
**Verify**: `curl -X POST http://localhost:1999/party/main -H "Content-Type: application/json" -d '{"type":"test"}' ` → broadcasts `{"type":"test"}` to connected WebSocket clients.

## Done Criteria

- [ ] `apps/party/` created with package.json, partykit.json, src/server.ts
- [ ] `partykit dev --port 1999` starts successfully
- [ ] `dev` script in `package.json` uses `--port 1999` (matches Plan 003 port assignments)
- [ ] WebSocket connections receive `CONNECTED` message
- [ ] HTTP POST to party server broadcasts JSON to all connected clients
- [ ] `plans/README.md` 009 → DONE

## STOP Conditions

- PartyKit CLI not available — `npm i -g partykit` or use `npx partykit dev`.
- PartyKit requires login — free signup at partykit.io; run `npx partykit login`.
- Port 1999 in use — check with `lsof -i :1999` in WSL, kill conflicting process.
