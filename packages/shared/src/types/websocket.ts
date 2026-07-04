import type { GuestbookEntry } from "./api";

export type WSMessageType = "CONTENT_UPDATED" | "GUESTBOOK_NEW";

export interface WSMessage {
  type: WSMessageType;
  entity: string;
  action: "create" | "update" | "delete";
  data?: unknown;
  timestamp: number;
}

export interface WSGuestbookMessage {
  type: "GUESTBOOK_NEW";
  entry: GuestbookEntry;
  timestamp: number;
}
