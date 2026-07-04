"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Pusher from "pusher-js";
import { mutate, SWRConfig } from "swr";
import type { WSMessage } from "@workspace/shared/types";

export interface RealtimeContextValue {
  isConnected: boolean;
}

const RealtimeContext = createContext<RealtimeContextValue>({
  isConnected: false,
});

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
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

    const channel = pusher.subscribe("nitish-portfolio");

    channel.bind("CONTENT_UPDATED", (msg: WSMessage) => {
      let endpoint = `/api/${msg.entity}`;
      
      // Map database entities to the endpoints used by SWR hooks
      if (msg.entity === "blog_posts") {
        endpoint = "/api/blog";
      } else if (["roles", "social_links", "site_config"].includes(msg.entity)) {
        endpoint = "/api/profile";
      }

      mutate(endpoint);
      mutate((key) => typeof key === "string" && key.startsWith(endpoint), undefined, { revalidate: true });
    });

    return () => {
      pusher.disconnect();
    };
  }, []);

  return (
    <SWRConfig value={{ revalidateOnFocus: false }}>
      <RealtimeContext.Provider value={{ isConnected }}>
        {children}
      </RealtimeContext.Provider>
    </SWRConfig>
  );
}

export const useRealtimeStatus = () => useContext(RealtimeContext);
