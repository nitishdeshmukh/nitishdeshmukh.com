# Plan 013: Home Page — All Sections

## Status
- **Priority**: P0 | **Effort**: XL (10h+) | **Risk**: LOW
- **Depends on**: 005 (API), 011 (layout) | **Phase**: 04-Frontend-Public

## Objective (Kya)
Build the complete home page with 8 sections, fetching data from the API Worker:
1. **Hero** — Profile image + name + animated role text flip
2. **About** — Short bio paragraph
3. **GitHub Contributions** — SVG heatmap graph
4. **Tech Stack** — Icon grid by category
5. **Experience** — Vertical timeline with collapsible cards
6. **Education** — Education cards
7. **Featured Projects** — Top 4 project cards
8. **Recent Blog Posts** — Latest 4 posts

## Timeline (Kab)
Critical path — the main page visitors see. Start as soon as API (005) and layout (011) are done.

## Implementation Strategy (Kaise)

### Data fetching
All sections use React Server Components (RSC) for data fetching:
```typescript
// app/page.tsx
async function HomePage() {
  const [profile, stack, experience, education, projects, posts, contributions] =
    await Promise.all([
      fetch(`${API_URL}/api/profile`).then(r => r.json()),
      fetch(`${API_URL}/api/stack`).then(r => r.json()),
      fetch(`${API_URL}/api/experience`).then(r => r.json()),
      fetch(`${API_URL}/api/education`).then(r => r.json()),
      fetch(`${API_URL}/api/projects/featured`).then(r => r.json()),
      fetch(`${API_URL}/api/blog/recent`).then(r => r.json()),
      fetch(`${API_URL}/api/github/contributions`).then(r => r.json()),
    ]);
  // Render sections...
}
```

### Component breakdown

| Component | Features | Animation |
|-----------|----------|-----------|
| `hero.tsx` | Profile image (rounded, ring), name (h1), role flip | Framer Motion `AnimatePresence` — roles cycle every 3s with slide-up/fade transition |
| `github-graph.tsx` | SVG grid of contribution squares, 52 weeks × 7 days | Theme-aware fill: `muted-foreground/5` → `muted-foreground/80` for levels 0-4 |
| `tech-stack.tsx` | Grid of icons grouped by category headers | Hover: scale + tooltip with tech name |
| `experience-timeline.tsx` | Vertical line with dots, company logos, collapsible descriptions | Collapsible via shadcn `Collapsible` — like bucharitesh.in project panels |
| `education.tsx` | Simple cards with institution, degree, years | Subtle fade-in on scroll |
| `featured-projects.tsx` | 4 cards with cover image, title, description, tags | Hover lift effect (translateY -2px + shadow) |
| `recent-posts.tsx` | Compact list with date, title, reading time | Link hover underline animation |

### Role text flip animation (hero)

> **Package**: Use `motion` (not `framer-motion`). Install: `bun add motion --filter=web`
> Import: `import { motion, AnimatePresence } from "motion/react"`

```typescript
// Uses motion/react AnimatePresence (React 19 compatible)
const [currentRole, setCurrentRole] = useState(0);
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentRole(prev => (prev + 1) % roles.length);
  }, 3000);
  return () => clearInterval(interval);
}, [roles.length]);

<AnimatePresence mode="wait">
  <motion.span
    key={roles[currentRole].id}
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -20, opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {roles[currentRole].title}
  </motion.span>
</AnimatePresence>
```

### Layout per section
Each section: `<section className="mt-12">` with `<h2>` heading — consistent vertical rhythm.
Overall page container: `max-w-2xl mx-auto px-4` (compact, content-focused like bucharitesh.in).

**Verify**: All 8 sections render with data from API.
**Verify**: Role text cycles every 3 seconds with smooth animation.
**Verify**: GitHub graph shows real contribution data for `nitishdeshmukh`.

## Done Criteria
- [ ] `app/page.tsx` renders all 8 sections
- [ ] Each section component created in `components/home/`
- [ ] Role text flip animates via Framer Motion
- [ ] GitHub graph renders as themed SVG
- [ ] Experience timeline is collapsible
- [ ] Featured projects show top 4 with hover effects
- [ ] Recent posts show latest 4 with links
- [ ] Responsive on mobile
- [ ] `plans/README.md` 013 → DONE

## STOP Conditions
- API returns empty data — run seed script (Plan 001): `bun run db:seed`.
- `motion` import not resolving — ensure you installed `motion` not `framer-motion`.
  `bun add motion --filter=web` and import from `motion/react`.
