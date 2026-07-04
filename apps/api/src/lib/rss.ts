function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

interface BlogPostForRSS {
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
}

export function generateRSS(posts: BlogPostForRSS[]): string {
  const items = posts
    .filter((p) => p.publishedAt)
    .map(
      (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>https://nitishdeshmukh.com/blog/${p.slug}</link>
      <guid isPermaLink="true">https://nitishdeshmukh.com/blog/${p.slug}</guid>
      <pubDate>${new Date(p.publishedAt!).toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt || "")}</description>
    </item>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Nitish Deshmukh — Blog</title>
    <link>https://nitishdeshmukh.com/blog</link>
    <description>Part-Time Web Developer</description>
    <language>en-us</language>
    <atom:link href="https://nitishdeshmukh.com/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;
}
