import Pusher from "pusher";
import type { Env } from "../types";

export async function notifyPusher(env: Env["Bindings"], entity: string, action: "create" | "update" | "delete"): Promise<void> {
  try {
    const pusher = new Pusher({
      appId: env.PUSHER_APP_ID,
      key: env.PUSHER_KEY,
      secret: env.PUSHER_SECRET,
      cluster: env.PUSHER_CLUSTER,
      useTLS: true,
    });

    await pusher.trigger("nitish-portfolio", "CONTENT_UPDATED", {
      entity,
      action,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Failed to notify Pusher:", error);
  }
}
