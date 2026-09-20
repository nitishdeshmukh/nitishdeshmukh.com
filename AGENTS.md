# AI agent guidelines for nitishdeshmukh.com

Next.js 16 (App Router) developer portfolio, blog, and showcase website.

**Stack**: TypeScript, Next.js 16 (Turbopack), React 19, Tailwind CSS v4, shadcn/ui, MDX, Motion, Vitest, Bun, Vercel

## Project structure

| Directory                              | Purpose                                                                                          |
| -------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `src/app/`                             | App Router pages, layouts, API routes, RSS, Open Graph routes, and LLM endpoints                 |
| `src/components/`                      | Shared UI components (`ui/` shadcn primitives, interactive brand marks, charts)                  |
| `src/features/`                        | Domain-driven feature modules (`portfolio`, `doc`, `blog`, `bookmark`, `cal`, `cv`, `sponsor`)   |
| `src/config/`                          | Site metadata (`site.ts`) and JSON-LD structured data (`json-ld.ts`)                             |
| `src/scripts/`                         | Build & automation scripts run with Bun (`capture.mts`, `capture-sync.mts`, `capture-cover.mts`) |
| `src/hooks/`, `src/lib/`, `src/utils/` | Reusable React hooks, audio/haptic/font libraries, and utility helper functions                  |
| `src/styles/`                          | Tailwind CSS v4 styles (`globals.css`, `typeset.css`, `scroll-fade-effect.css`)                  |

**Key files**:

- `package.json`: Project scripts, dependencies, and engines (`packageManager: "bun@1.3.14"`, `node: ">=22.x"`).
- `components.json`: shadcn/ui configuration with external registries (`@kibo-ui`, `@react-bits`, `@soundcn`, `@bklit`).
- `next.config.ts`: Next.js configuration, allowed dev origins, rewrites (markdown negotiation & LLM endpoints), and image domains.
- `src/features/portfolio/data/`: Core structured data files (`user.ts`, `projects.tsx`, `experiences.tsx`, `timeline.ts`, `tech-stack.tsx`, `social-links.ts`).
- `src/features/{bookmark,sponsor}/data.tsx`: Bookmark links and sponsorship tiers/backers.
- `.env.example`: Reference environment variables.

## Feature modules (`src/features/`)

The application organizes domain logic into feature folders:

- **`portfolio`**: Main profile header, avatar effects, bio, GitHub contributions graph, experience & project cards, timeline, tech stack, and stats.
- **`doc`**: Centralized documentation and MDX content layer (`content/blog/`, `data/documents.ts`, document types, page actions).
- **`blog`**: Blog article UI components, headings, social sharing, and reading list.
- **`bookmark`**: Curated bookmarks, category filters, and external link utilities.
- **`cal`**: Cal.com scheduling embed integration.
- **`cv`**: Resume presentation, vCard export, and PDF download handlers.
- **`sponsor`**: Sponsorship tiers, donor data, and carousel showcase.

## Content system (MDX)

All markdown content lives in `src/features/doc/content/blog/` as `.mdx` files.

- **Data layer**: `src/features/doc/data/documents.ts` uses `gray-matter` to parse frontmatter and content (`getAllDocs`, `getDocBySlug`, `getDocsByCategory`).
- **Category derivation**: The doc's category is derived from its immediate subfolder (`blog`), not declared in frontmatter.
- **Markdown negotiation**: Requests sending `Accept: text/markdown` or requesting `/blog/:slug.md` are rewritten to `/doc.md/:slug` to serve clean markdown for LLMs and AI agents.
- **LLM overview**: `/llms.txt` provides a comprehensive machine-readable site index.

## Coding guidelines

- **TypeScript**: Strict mode enabled; declare explicit prop types and interfaces.
- **File naming**: Use `kebab-case` for all files and directories (e.g. `profile-header.tsx`, `social-links.ts`).
- **Naming & Comments**: Choose semantic, self-explanatory names. Add comments only to explain "why", not "what".
- **Clean code**: No emojis in source code, comments, or commit messages.
- **Styling**: Tailwind CSS v4 syntax (`@theme`, CSS variables, OKLCH/color-mix). Always support both dark and light modes with seamless contrast.
- **React 19 & Next.js 16**: Use Server Components by default. Add `"use client"` only when interactive state, browser events, or Motion animations are required.
- **Headings**: Use sentence-case for headings and UI copy (capitalize only the first word and proper nouns).

## Commands

Use **Bun** as the package manager and script runner:

```bash
bun run dev                               # Start development server (http://localhost:3000)
bun run build                             # Create optimized production build
bun run start                             # Start production server
bun run preview                           # Build and start production server locally
bun run test                              # Vitest in watch mode
bun run test:run                          # Run Vitest test suite once (47 unit tests)
bun run lint                              # ESLint code quality check
bun run lint:fix                          # ESLint check with auto-fix
bun run format:check                      # Check formatting with Prettier
bun run format:write                      # Auto-format files with Prettier
bun run check-types                       # TypeScript type check (tsc --noEmit)
bun run capture                           # Capture automated screenshots with Puppeteer
bun run capture:sync                      # Sync screenshots to Cloudflare R2 bucket
bun run generate-libphonenumber-metadata  # Generate minimal phone metadata for supported countries (IN)
bun run upgrade:next                      # Upgrade Next.js via codemods
bun run upgrade:tailwind                  # Upgrade Tailwind CSS via codemods
```

> [!NOTE]
> On a fresh clone, run `bun run build` before `bun run check-types`. TypeScript (`tsc --noEmit`) relies on the ambient route and page types generated into `.next/types/**` by Next.js during build time.

## Local dev URL

The local development server runs at:

```
http://localhost:3000
```

For LAN or mobile device testing on the same Wi-Fi network, access via `http://<your-local-ip>:3000` (allowed development origins are configured in `next.config.ts`).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
