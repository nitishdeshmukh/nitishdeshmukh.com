import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export const dynamic = "force-dynamic";

export async function GET() {
  const profile = await fetch(`${API_BASE}/api/profile`).then(res => res.json());
  const posts = await fetch(`${API_BASE}/api/blog`).then(res => res.json());
  
  const siteUrl = "https://nitishdeshmukh.com";

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>${profile.name}</title>
      <link>${siteUrl}</link>
      <description>${profile.bio}</description>
      ${posts.map((post: any) => `
        <item>
          <title><![CDATA[${post.title}]]></title>
          <link>${siteUrl}/blog/${post.slug}</link>
          <pubDate>${new Date(post.publishedAt || post.createdAt).toUTCString()}</pubDate>
          <description><![CDATA[${post.excerpt}]]></description>
        </item>
      `).join("")}
    </channel>
  </rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
