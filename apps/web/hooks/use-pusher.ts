"use client";

import { useEffect, useRef } from "react";
import Pusher from "pusher-js";

// Keep a singleton instance so we don't create multiple connections
let pusherInstance: Pusher | null = null;

export function getPusherInstance() {
  if (typeof window === "undefined") return null;

  if (!pusherInstance) {
    pusherInstance = new Pusher(
      process.env.NEXT_PUBLIC_PUSHER_KEY || "6199411d091a7a24f4ce",
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap2",
      }
    );
  }
  return pusherInstance;
}

export function usePusher(
  channelName: string,
  eventName: string,
  callback: (data: any) => void
) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const pusher = getPusherInstance();
    if (!pusher) return;

    // Use a shared channel name like 'main-channel' or dynamically based on the resource
    // For our app, we use 'main-channel' for all broadcasts to simplify
    const channelToSubscribe = "main-channel";
    const channel = pusher.subscribe(channelToSubscribe);

    const handler = (data: any) => {
      // Since we multiplex events on 'main-channel', we check if the event matches
      // the requested channelName (e.g. 'guestbook') and eventName (e.g. 'update')
      // Our API sends: { channel: "guestbook", event: "update", payload: ... }
      if (data.channel === channelName && data.event === eventName) {
        savedCallback.current(data.payload);
      }
    };

    channel.bind("broadcast", handler);

    return () => {
      channel.unbind("broadcast", handler);
      // We don't unsubscribe from the channel completely here because other hooks might be using it
    };
  }, [channelName, eventName]);
}
