# Plan 015: Projects Archive

## Status
- **Priority**: P1 | **Effort**: M (3-5h) | **Risk**: LOW
- **Depends on**: 005, 011 | **Phase**: 04-Frontend-Public

## Objective (Kya)
1. `/projects` — Filterable grid of all projects with tag badges
2. `/projects/[slug]` — Detail page with MDX content, tech tags, demo/repo links

## Timeline (Kab)
After home page. Projects are already shown on home (top 4), this is the full archive.

## Implementation Strategy (Kaise)
- Fetch from `GET /api/projects`
- Grid layout: 1 col mobile, 2 cols desktop
- Project cards: cover image, title, description, tags, demo/repo links
- Tag filter: same pattern as blog (client-side filtering)
- Detail page: renders `contentMdx` via `next-mdx-remote`

## Done Criteria
- [ ] `/projects` renders filterable project grid
- [ ] `/projects/[slug]` renders project detail with MDX
- [ ] Tags filter works
- [ ] Demo + repo link buttons
- [ ] `plans/README.md` 015 → DONE
