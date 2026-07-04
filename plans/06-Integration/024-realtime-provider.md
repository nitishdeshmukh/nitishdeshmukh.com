# Plan 024: Real-Time Provider — Pusher + SWR Invalidation

## Status
- **Priority**: P1 | **Effort**: M (3-5h) | **Risk**: MED
- **Depends on**: 010 (Real-Time Broadcast Flow) | **Phase**: 06-Integration

## Objective (Kya)
Create a React context provider for `apps/web` that:
1. Connects to Pusher WebSocket on mount
2. Listens for `CONTENT_UPDATED` and `GUESTBOOK_NEW` events
3. Automatically invalidates SWR cache for the affected entity
4. Provides a `useRealtimeStatus()` hook showing connection state

## Timeline (Kab)
After Pusher API broadcasts (010) exist. Blocks end-to-end real-time sync (025).

## Implementation Strategy (Kaise)

### Install Dependencies
```bash
bun add pusher-js --filter=web
bun add pusher-js --filter=admin
```

### Provider architecture
```
providers/
└── realtime-provider.tsx       # React context + Pusher connection

hooks/
├── use-realtime.ts             # useRealtimeStatus() hook
└── use-api.ts                  # SWR-based data fetching hooks
```

### Provider implementation
```typescript
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Pusher from "pusher-js";
import { useSWRConfig } from "swr";
import type { WSMessage } from "@workspace/shared/types";

interface RealtimeContextValue {
  isConnected: boolean;
}

const RealtimeContext = createContext<RealtimeContextValue>({
  isConnected: false,
});

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { mutate } = useSWRConfig();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Enable pusher logging in dev only
    if (process.env.NODE_ENV === "development") {
      Pusher.logToConsole = true;
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || "", {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "",
    });

    pusher.connection.bind("connected", () => setIsConnected(true));
    pusher.connection.bind("disconnected", () => setIsConnected(false));

    const channel = pusher.subscribe("portfolio");

    channel.bind("update", (msg: WSMessage) => {
      switch (msg.type) {
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

    return () => {
      pusher.disconnect();
    };
  }, [mutate]);

  return (
    <RealtimeContext.Provider value={{ isConnected }}>
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
- [ ] `RealtimeProvider` connects to Pusher on mount
- [ ] `CONTENT_UPDATED` events invalidate the correct SWR cache
- [ ] `GUESTBOOK_NEW` events trigger guestbook re-fetch
- [ ] `useRealtimeStatus()` hook returns connection state
- [ ] Provider integrated into `app/layout.tsx`
- [ ] No memory leaks (Pusher disconnects on unmount)
- [ ] `plans/README.md` 024 → DONE

## STOP Conditions
- `pusher-js` package missing API keys — ensure they are set in `.env.local`.
- SWR mutate doesn't trigger re-render — check that SWR provider wraps the component tree.
