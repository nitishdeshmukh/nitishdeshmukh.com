import { useRealtimeStatus } from "../providers/realtime-provider";

export function useRealtime() {
  return useRealtimeStatus();
}
