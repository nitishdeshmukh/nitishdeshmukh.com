# Plan 009: Realtime WebSocket Server (partyserver) — `apps/party`

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on.

## Status

- **Priority**: P1
- **Effort**: S (1-2h)
- **Risk**: LOW
- **Depends on**: —
- **Phase**: 03-Realtime

## Objective (Kya)

Create a WebSocket server running directly on Cloudflare Workers that:
1. Accepts WebSocket connections from portfolio visitors
2. Receives HTTP POST broadcasts from the API Worker after admin mutations
3. Broadcasts update messages to all connected clients instantly
4. Uses `partyserver` to run natively on your Cloudflare account (avoiding PartyKit's shared zone limits).

## Timeline (Kab)

Independent — can start anytime. Blocks real-time features (016 guestbook, 024 provider).

## Implementation Strategy (Kaise)

### Directory structure

```
apps/party/
├── package.json
├── wrangler.toml
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
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "partyserver": "^0.5.8"
  },
  "devDependencies": {
    "@workspace/typescript-config": "workspace:*",
    "typescript": "^5",
    "wrangler": "latest"
  }
}
```

### `wrangler.toml`

```toml
name = "nitish-party"
main = "src/server.ts"
compatibility_date = "2026-07-04"

[observability]
enabled = true

[[durable_objects.bindings]]
name = "RealtimeServer"
class_name = "RealtimeServer"

[[migrations]]
tag = "v1"
new_classes = ["RealtimeServer"]
```

### `src/server.ts`

```typescript
import { Server, routePartykitRequest } from "partyserver";

export class RealtimeServer extends Server {
  onConnect(conn: any, ctx: any) {
    console.log(`Connected: id ${conn.id} room ${this.name} url ${ctx.request.url}`);
    conn.send(JSON.stringify({ type: "CONNECTED", message: "Welcome to nitish-party" }));
  }

  onMessage(message: string, sender: any) {
    console.log(`Message from ${sender.id}: ${message}`);
    // Broadcast to everyone else
    this.broadcast(message, [sender.id]);
  }
  
  async onRequest(req: Request) {
    if (req.method === "POST") {
      const body = await req.text();
      this.broadcast(body);
      return new Response("OK", { status: 200 });
    }
    return new Response("Method not allowed", { status: 405 });
  }
}

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext) {
    return (
      (await routePartykitRequest(request, env)) ||
      new Response("Not found", { status: 404 })
    );
  }
} satisfies ExportedHandler<any>;
```

**Verify**: `wrangler dev` starts successfully in `apps/party/`.
**Verify**: Connect via WebSocket in DevTools → receives `CONNECTED` message.
**Verify**: HTTP POST broadcasts to connected WebSocket clients.

## Done Criteria

- [x] `apps/party/` migrated to partyserver and wrangler.toml
- [x] WebSocket connections receive `CONNECTED` message
- [x] `plans/README.md` 009 → DONE

## STOP Conditions

- Cloudflare CLI (wrangler) not available.
