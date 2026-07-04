import type * as Party from "partykit/server";

export default class RealtimeServer implements Party.Server {
  constructor(public room: Party.Room) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    console.log(`Connected: id ${conn.id} room ${this.room.id} url ${ctx.request.url}`);
    conn.send(JSON.stringify({ type: "CONNECTED", message: "Welcome to nitish-party" }));
  }

  onMessage(message: string, sender: Party.Connection) {
    console.log(`Message from ${sender.id}: ${message}`);
    // Broadcast to everyone else
    this.room.broadcast(message, [sender.id]);
  }
  
  async onRequest(req: Party.Request) {
    if (req.method === "POST") {
      const body = await req.text();
      this.room.broadcast(body);
      return new Response("OK", { status: 200 });
    }
    return new Response("Method not allowed", { status: 405 });
  }
}
