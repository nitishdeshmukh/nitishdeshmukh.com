# Plan 024: Real-Time Provider — WebSocket + SWR Invalidation

## Status
- **Priority**: P1 | **Effort**: M (3-5h) | **Risk**: MED
- **Depends on**: 009 (PartyKit server) | **Phase**: 06-Integration

## Objective (Kya)
Create a React context provider for `apps/web` that:
1. Connects to PartyKit WebSocket on mount
2. Listens for `CONTENT_UPDATED` and `GUESTBOOK_NEW` messages
3. Automatically invalidates SWR cache for the affected entity
4. Provides a `useRealtimeStatus()` hook showing connection state

## Timeline (Kab)
After PartyKit server (009) exists. Blocks end-to-end real-time sync (025).

## Implementation Strategy (Kaise)

### Provider architecture
```
providers/
└── realtime-provider.tsx       # React context + PartySocket connection

hooks/
├── use-realtime.ts             # useRealtimeStatus() hook
└── use-api.ts                  # SWR-based data fetching hooks
```

### Provider implementation
```typescript
"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import PartySocket from "partysocket";
import { useSWRConfig } from "swr";
import type { WSMessage } from "@workspace/shared/types";

interface RealtimeContextValue {
  isConnected: boolean;
  connectionCount: number;
}

const RealtimeContext = createContext<RealtimeContextValue>({
  isConnected: false,
  connectionCount: 0,
});

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { mutate } = useSWRConfig();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionCount, setConnectionCount] = useState(0);
  const wsRef = useRef<PartySocket | null>(null);

  useEffect(() => {
    const ws = new PartySocket({
      host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999",
      room: "main",
    });

    ws.addEventListener("open", () => setIsConnected(true));
    ws.addEventListener("close", () => setIsConnected(false));

    ws.addEventListener("message", (event) => {
      const msg: WSMessage = JSON.parse(event.data);

      switch (msg.type) {
        case "CONNECTED":
          setConnectionCount(msg.connections);
          break;
        case "CONTENT_UPDATED":
          // Invalidate SWR cache for the affected entity
          mutate(`/api/${msg.entity}`);
          mutate((key) => typeof key === "string" && key.startsWith(`/api/${msg.entity}`), undefined, { revalidate: true });
          break;
        case "GUESTBOOK_NEW":
          mutate("/api/guestbook");
          break;
      }
    });

    wsRef.current = ws;
    return () => ws.close();
  }, [mutate]);

  return (
    <RealtimeContext.Provider value={{ isConnected, connectionCount }}>
      {children}
    </RealtimeContext.Provider>
  );
}

export const useRealtimeStatus = () => useContext(RealtimeContext);
```

### SWR data hooks
```typescript
// hooks/use-api.ts
import useSWR from "swr";

const fetcher = (url: string) => fetch(`${API_BASE}${url}`).then(r => r.json());

export function useProfile() { return useSWR("/api/profile", fetcher); }
export function useProjects() { return useSWR("/api/projects", fetcher); }
export function useBlogPosts() { return useSWR("/api/blog", fetcher); }
export function useGuestbook() { return useSWR("/api/guestbook", fetcher); }
// ... etc
```

When the real-time provider calls `mutate("/api/guestbook")`, any component
using `useGuestbook()` automatically re-fetches.

### Integration into layout
```typescript
// app/layout.tsx
import { RealtimeProvider } from "@/providers/realtime-provider";
import { SWRConfig } from "swr";

export default function Layout({ children }) {
  return (
    <SWRConfig value={{ revalidateOnFocus: false }}>
      <RealtimeProvider>
        {children}
      </RealtimeProvider>
    </SWRConfig>
  );
}
```

**Verify**: Open two browser tabs → admin changes content → web tab updates without refresh.
**Verify**: Connection status indicator shows "connected" state.

## Done Criteria
- [ ] `RealtimeProvider` connects to PartyKit on mount
- [ ] `CONTENT_UPDATED` messages invalidate the correct SWR cache
- [ ] `GUESTBOOK_NEW` messages trigger guestbook re-fetch
- [ ] `useRealtimeStatus()` hook returns connection state
- [ ] Provider integrated into `app/layout.tsx`
- [ ] No memory leaks (WebSocket cleaned up on unmount)
- [ ] `plans/README.md` 024 → DONE

## STOP Conditions
- `partysocket` package not compatible with Next.js 16 — try raw `WebSocket` API instead.
- SWR mutate doesn't trigger re-render — check that SWR provider wraps the component tree.
