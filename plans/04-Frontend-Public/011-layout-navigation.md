# Plan 011: Layout + Floating Dock Navigation

## Status
- **Priority**: P0 | **Effort**: M (3-5h) | **Risk**: LOW
- **Depends on**: 003 (workspace) | **Phase**: 04-Frontend-Public

## Objective (Kya)
Build the root layout and navigation system for `apps/web`:
1. Root `layout.tsx` with Inter + Geist Mono fonts, dark mode, metadata
2. **Floating dock** navigation (macOS-style, like bucharitesh.in) — fixed bottom bar with icons for Home, Blog, Projects, Guestbook, Calendar, Music, plus social links section
3. **Mobile header** — sticky top header with hamburger drawer for mobile
4. Scroll-to-top button
5. Theme toggle (sun/moon) in the dock

## Timeline (Kab)
First frontend task. Blocks all pages — every page uses this layout.

## Implementation Strategy (Kaise)

### Floating dock (desktop)
Inspired by bucharitesh.in's bottom dock:
- Fixed at bottom center, z-40, rounded-full with border + shadow
- Icons: `House`, `Pencil` (blog), `FolderOpen` (projects), `BookOpen` (guestbook), `Calendar`, `Music` — all from `lucide-react`
- Divider between nav icons and social icons
- Social links: GitHub, LinkedIn, Mail
- Theme toggle at the end
- **`motion`** spring animation on hover (icons scale up)
- Blur backdrop behind dock

### Mobile header
- Sticky top, h-12, show on `lg:hidden`
- Hamburger → sheet/drawer with full navigation
- Site name with scroll reveal animation

### Files to create
| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout: fonts, providers, metadata, dock + mobile header |
| `components/navigation/floating-dock.tsx` | macOS-style floating dock |
| `components/navigation/dock-icon.tsx` | Individual dock icon with hover animation |
| `components/navigation/mobile-header.tsx` | Sticky mobile header + drawer |
| `components/navigation/scroll-to-top.tsx` | Floating scroll-to-top button |
| `components/theme-provider.tsx` | Already exists — keep as-is |

### Key design details
- Dock background: `bg-white dark:bg-neutral-900` with `border border-gray-200 dark:border-gray-800`
- Box shadow: `shadow-[0_30px_60px_rgba(0,0,0,0.12)]`
- Bottom gradient mask above dock: linear-gradient to hide content scroll behind it
- Active route indicator: filled background on the active icon

**Verify**: `bun run dev` → web app shows floating dock at bottom (desktop) and sticky header (mobile).

> **Note**: Install the `motion` package (not `framer-motion`). The package is
> now called `motion` and the import is `motion/react` for React 19 support:
> ```bash
> bun add motion --filter=web
> ```
> Import: `import { motion, AnimatePresence } from "motion/react"`

## Done Criteria

- [ ] Root layout with Inter + Geist Mono fonts, dark mode
- [ ] Floating dock renders with all nav + social icons
- [ ] Dock icons have hover scale animation (`motion/react`)
- [ ] Active route highlighted
- [ ] Mobile header with drawer navigation
- [ ] Theme toggle works (light/dark/system)
- [ ] Scroll-to-top button appears on scroll
- [ ] `plans/README.md` 011 → DONE
