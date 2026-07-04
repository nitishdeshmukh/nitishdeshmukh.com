# Plan 008: SEO Outputs — RSS, llms.txt, llms-full.txt

## Status
- **Priority**: P2 | **Effort**: S (1-2h) | **Risk**: LOW
- **Depends on**: 005 (needs blog data) | **Phase**: 02-Backend-Core

## Objective (Kya)
Auto-generate three SEO/AI-optimized endpoints:
1. `GET /feed.xml` — RSS 2.0 feed of blog posts
2. `GET /llms.txt` — Site structure summary for LLM consumption
3. `GET /llms-full.txt` — Full content dump (all blog posts + project descriptions)

## Timeline (Kab)
Low priority — can be added anytime after blog API exists.

## Implementation Strategy (Kaise)

### RSS Feed (`src/lib/rss.ts`)
```typescript
export function generateRSS(posts: BlogPost[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Nitish Deshmukh — Blog</title>
    <link>https://nitishdeshmukh.com/blog</link>
    <description>Part-Time Web Developer</description>
    <atom:link href="https://nitishdeshmukh.com/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts.map(p => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>https://nitishdeshmukh.com/blog/${p.slug}</link>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt || "")}</description>
    </item>`).join("")}
  </channel>
</rss>`;
}
```

### llms.txt format
Follow the [llms.txt standard](https://llmstxt.org/):
```
# Nitish Deshmukh
> Part-Time Web Developer

## Pages
- [Home](https://nitishdeshmukh.com/): Portfolio home
- [Blog](https://nitishdeshmukh.com/blog): Technical blog
- [Projects](https://nitishdeshmukh.com/projects): Project archive
- [Guestbook](https://nitishdeshmukh.com/guestbook): Sign the guestbook
- [Meeting](https://nitishdeshmukh.com/meeting): Book a meeting

## Blog Posts
{dynamically list all published posts}
```

### llms-full.txt
Concatenates all blog post content + project descriptions in plain text for
LLMs to consume full context.

**Verify**: `curl http://localhost:8787/feed.xml` → valid RSS XML.
**Verify**: `curl http://localhost:8787/llms.txt` → structured text output.

## Done Criteria
- [ ] `GET /feed.xml` returns valid RSS 2.0 with `Content-Type: application/xml`
- [ ] `GET /llms.txt` returns site structure in llms.txt format
- [ ] `GET /llms-full.txt` returns full content dump
- [ ] XML content is properly escaped (no XSS via post titles)
- [ ] `plans/README.md` 008 → DONE
