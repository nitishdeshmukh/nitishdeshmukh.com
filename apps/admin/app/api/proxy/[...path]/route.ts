import { type NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_URL || "http://localhost:8787";
const API_SECRET = process.env.API_SECRET || ""; // Never prefix with NEXT_PUBLIC_

export async function GET(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
  return proxy(req, params.path, "GET");
}

export async function POST(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
  const body = await req.json().catch(() => undefined);
  return proxy(req, params.path, "POST", body);
}

export async function PUT(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
  const body = await req.json().catch(() => undefined);
  return proxy(req, params.path, "PUT", body);
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
  return proxy(req, params.path, "DELETE");
}

async function proxy(req: NextRequest, path: string[], method: string, body?: unknown) {
  // Construct the url query params
  const { searchParams } = new URL(req.url);
  const queryString = searchParams.toString();
  
  let url = `${API_BASE}/api/admin/${path.join("/")}`;
  if (queryString) {
    url += `?${queryString}`;
  }

  try {
    const res = await fetch(url, {
      method,
      headers: { 
        "Content-Type": "application/json", 
        "X-API-Key": API_SECRET 
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    
    // We try to parse JSON, if it's not JSON we can just send text or 204
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: "Internal Proxy Error", details: error.message }, { status: 500 });
  }
}
