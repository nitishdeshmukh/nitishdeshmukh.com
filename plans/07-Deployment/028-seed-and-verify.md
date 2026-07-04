# Plan 028: Seed Data + Lighthouse Audit + Final Verification

## Status
- **Priority**: P1 | **Effort**: M (3-5h) | **Risk**: LOW
- **Depends on**: 027 (deploy pipeline) | **Phase**: 07-Deployment

## Objective (Kya)
Final verification pass:
1. Seed production D1 with Nitish's real profile data
2. Upload sample audio assets to R2
3. Create sample blog posts and projects
4. Run Lighthouse audit — target 95+ across all categories
5. Verify all features work on production URLs
6. Check SEO outputs (RSS, llms.txt, sitemap)

## Timeline (Kab)
Last task — everything else must be deployed first.

## Implementation Strategy (Kaise)

### Step 1: Seed production database
```bash
# Use the seed SQL generated from plan 001
wrangler d1 execute nitish-portfolio --file=packages/db/seed.sql --remote
```

Seed data includes:
- Profile: Nitish Deshmukh, Part-Time Web Developer
- 3 roles for text flip animation
- 3 social links (GitHub, LinkedIn, website)
- Tech stack items (React, Node.js, TypeScript, etc.)
- 1-2 sample experience entries
- 1-2 sample education entries
- 2-3 sample projects
- 1-2 sample blog posts

### Step 2: Upload sample audio
```bash
# Upload via admin panel or CLI
curl -X POST https://api.nitishdeshmukh.com/api/admin/upload \
  -H "X-API-Key: $API_SECRET" \
  -F "file=@sample-track.mp3"
```

### Step 3: Lighthouse audit
Run against production URLs:

```bash
# Install Lighthouse CLI
npx lighthouse https://nitishdeshmukh.com --output=json --output=html --output-path=./lighthouse

# Or via Chrome DevTools → Lighthouse tab
```

**Target scores:**
| Category | Target | Notes |
|----------|--------|-------|
| Performance | ≥95 | Edge delivery via Cloudflare CDN helps |
| Accessibility | ≥95 | Proper ARIA, color contrast, semantic HTML |
| Best Practices | ≥95 | HTTPS, no console errors, no deprecated APIs |
| SEO | ≥95 | Meta tags, sitemap, robots.txt, JSON-LD |

### Step 4: Feature verification checklist

| Feature | URL | Test |
|---------|-----|------|
| Home hero + role flip | `/` | Profile image loads, roles cycle |
| GitHub graph | `/` | Contribution heatmap renders |
| Tech stack | `/` | Icons display in grid |
| Experience timeline | `/` | Timeline renders, collapsible |
| Featured projects | `/` | 4 project cards show |
| Recent posts | `/` | 4 blog post links show |
| Weather background | `/` | Background changes (test with geolocation) |
| Blog index | `/blog` | Posts list, tag filter |
| Blog post | `/blog/[slug]` | MDX renders, code highlighting, TOC |
| Projects archive | `/projects` | Grid with filter |
| Guestbook | `/guestbook` | Submit form + message list |
| Meeting | `/meeting` | Cal.com widget loads |
| Music | `/music` | Track list + player |
| RSS feed | `/feed.xml` | Valid XML |
| llms.txt | `/llms.txt` | Structured text |
| Sitemap | `/sitemap.xml` | Lists all URLs |
| Admin CRUD | `admin.*/roles` | Create/edit/delete works |
| Real-time sync | Admin → Web | Changes reflect instantly |
| Dark mode | Toggle | All pages support dark mode |
| Mobile | Resize | Responsive on all pages |

### Step 5: Performance fixes (if needed)
- Images: ensure Next.js `<Image>` with `priority` on above-fold images
- Fonts: verify `next/font` subsetting (Inter + Geist Mono)
- Bundle: check for unnecessary client-side JS
- Caching: verify API responses have proper `Cache-Control` headers

**Verify**: All checklist items pass on production.
**Verify**: Lighthouse scores ≥ 95 across all categories.

## Done Criteria
- [ ] Production D1 seeded with real data
- [ ] Sample audio uploaded and playable
- [ ] Sample blog posts render correctly
- [ ] Lighthouse: Performance ≥95, Accessibility ≥95, Best Practices ≥95, SEO ≥95
- [ ] All 20 feature verification items pass
- [ ] No console errors on any page
- [ ] `plans/README.md` 028 → DONE
