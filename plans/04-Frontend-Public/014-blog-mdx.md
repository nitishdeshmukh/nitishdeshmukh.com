# Plan 014: Blog — MDX Rendering (chanhdai.com-inspired)

## Status
- **Priority**: P0 | **Effort**: L (6-10h) | **Risk**: LOW
- **Depends on**: 005 (blog API), 011 (layout) | **Phase**: 04-Frontend-Public

## Objective (Kya)
Build the blog system with chanhdai.com-inspired design:
1. `/blog` — Index page with bordered panel cards, tag filtering
2. `/blog/[slug]` — Post page with MDX rendering, syntax highlighting (shiki), TOC, reading time, share buttons

## Timeline (Kab)
Core feature — start alongside home page (013).

## Implementation Strategy (Kaise)

### Libraries
| Library | Purpose |
|---------|---------|
| `next-mdx-remote` | Server-side MDX rendering |
| `shiki` | Syntax highlighting (100+ languages) |
| `rehype-pretty-code` | Shiki integration for rehype |
| `remark-gfm` | GitHub-flavored markdown (tables, strikethrough) |

### Blog index (`app/blog/page.tsx`)
- Fetch all published posts from `GET /api/blog`
- Render as bordered panel cards (chanhdai.com style — `border-x border-line`)
- Each card: title, date, excerpt, tags, reading time
- Tag filter: clickable tag badges that filter the list client-side
- Section headers with `screen-line-top/bottom` dividers

### Blog post (`app/blog/[slug]/page.tsx`)
- Fetch post from `GET /api/blog/:slug`
- Render MDX via `next-mdx-remote` with custom components:
  - **Code blocks**: shiki with theme-aware highlighting
  - **Callouts**: `> [!NOTE]`, `> [!WARNING]` etc.
  - **Images**: Next.js Image with blur placeholder
  - **Links**: External links open in new tab
- **Table of Contents**: Auto-generated from headings, sidebar (desktop), collapsible (mobile)
- **Reading time**: Displayed in header
- **Share buttons**: Copy link, Twitter/X share

### Custom MDX components (`components/blog/mdx-components.tsx`)
```typescript
export const mdxComponents = {
  h1: (props) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
  h2: (props) => <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />,
  code: (props) => <code className="bg-muted px-1.5 py-0.5 rounded text-sm" {...props} />,
  pre: (props) => <pre className="overflow-x-auto rounded-lg border p-4" {...props} />,
  a: (props) => <a className="underline underline-offset-4" target={props.href?.startsWith("http") ? "_blank" : undefined} {...props} />,
  // ... more
};
```

**Verify**: `/blog` renders post cards with tags.
**Verify**: `/blog/[slug]` renders MDX with syntax highlighting.
**Verify**: TOC auto-generates from headings and scroll-spies.

## Done Criteria
- [ ] Blog index with tag filtering
- [ ] Blog post with full MDX rendering
- [ ] Shiki syntax highlighting (dark + light themes)
- [ ] Auto-generated TOC with scroll-spy
- [ ] Reading time + share buttons
- [ ] `generateMetadata()` with OG tags per post
- [ ] `plans/README.md` 014 → DONE
