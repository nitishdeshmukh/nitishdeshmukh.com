import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export const dynamic = "force-dynamic";

export async function GET() {
  const profile = await fetch(`${API_BASE}/api/profile`).then(res => res.json());
  const projects = await fetch(`${API_BASE}/api/projects`).then(res => res.json());
  
  const text = `
# ${profile.name} - System Instructions
${profile.bio}

## Projects
${projects.map((p: any) => `- ${p.title}: ${p.description} (URL: ${p.url})`).join("\n")}

## Contact
Email: nitishdeshmukh24@gmail.com
`.trim();

  return new NextResponse(text, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
