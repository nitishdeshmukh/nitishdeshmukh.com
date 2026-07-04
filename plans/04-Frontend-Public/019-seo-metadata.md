# Plan 019: SEO Metadata — Sitemap, Robots, OG, JSON-LD

## Status
- **Priority**: P1 | **Effort**: S (1-2h) | **Risk**: LOW
- **Depends on**: 013, 014 (needs pages to exist) | **Phase**: 04-Frontend-Public

## Objective (Kya)
Implement comprehensive SEO across all pages:
1. Dynamic sitemap (`app/sitemap.ts`)
2. robots.txt (`app/robots.ts`)
3. `generateMetadata()` on every page with OG image, description, title
4. JSON-LD structured data (Person schema on home, BlogPosting on posts)

## Timeline (Kab)
After main pages exist. Quick task — mostly metadata configuration.

## Implementation Strategy (Kaise)

### Sitemap
```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await fetch(`${API_URL}/api/projects`).then(r => r.json());
  const posts = await fetch(`${API_URL}/api/blog`).then(r => r.json());

  return [
    { url: "https://nitishdeshmukh.com", lastModified: new Date() },
    { url: "https://nitishdeshmukh.com/blog", lastModified: new Date() },
    { url: "https://nitishdeshmukh.com/projects", lastModified: new Date() },
    { url: "https://nitishdeshmukh.com/guestbook", lastModified: new Date() },
    { url: "https://nitishdeshmukh.com/meeting", lastModified: new Date() },
    { url: "https://nitishdeshmukh.com/music", lastModified: new Date() },
    ...posts.map((p) => ({ url: `https://nitishdeshmukh.com/blog/${p.slug}`, lastModified: p.updatedAt })),
    ...projects.map((p) => ({ url: `https://nitishdeshmukh.com/projects/${p.slug}`, lastModified: p.publishedAt })),
  ];
}
```

### robots.txt
```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/"] },
    sitemap: "https://nitishdeshmukh.com/sitemap.xml",
  };
}
```

### Per-page metadata (example)
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await fetch(`${API_URL}/api/blog/${params.slug}`).then(r => r.json());
  return {
    title: `${post.title} — Nitish Deshmukh`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      images: [post.coverUrl || "/og-default.png"],
    },
    twitter: { card: "summary_large_image" },
  };
}
```

### JSON-LD
```typescript
// On home page
<script type="application/ld+json">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Nitish Deshmukh",
  url: "https://nitishdeshmukh.com",
  sameAs: ["https://github.com/nitishdeshmukh", "https://linkedin.com/in/nitish-deshmukh"],
  jobTitle: "Part-Time Web Developer",
})}
</script>
```

## Done Criteria
- [ ] `/sitemap.xml` generates with all dynamic routes
- [ ] `/robots.txt` blocks `/api/` and `/admin/`
- [ ] Every page has `generateMetadata()` with title, description, OG
- [ ] Home page has JSON-LD Person schema
- [ ] Blog posts have JSON-LD BlogPosting schema
- [ ] `plans/README.md` 019 → DONE
