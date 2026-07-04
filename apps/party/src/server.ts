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
