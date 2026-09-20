# Development guide

This guide provides instructions on how to set up, develop, test, and build the project locally.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (>= 22.x, see [.nvmrc](./.nvmrc))
- [Bun](https://bun.sh/) (>= 1.3.14, recommended package manager)
- [Git](https://git-scm.com/)

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/nitishdeshmukh/nitishdeshmukh.com.git
cd nitishdeshmukh.com
```

### 2. Install dependencies

```bash
bun install
```

### 3. Configure environment variables

Create a `.env.local` file based on `.env.example`:

```bash
# macOS / Linux
cp .env.example .env.local

# Windows (PowerShell)
copy .env.example .env.local
```

Configure the environment variables in `.env.local`:

- `NEXT_PUBLIC_APP_URL`: Canonical site URL (e.g. `http://localhost:3000` for local dev).
- `NEXT_PUBLIC_CV_URL`: Direct link to latest downloadable resume / CV PDF.
- `NEXT_PUBLIC_CAL_NAMESPACE` & `NEXT_PUBLIC_CAL_LINK`: Cal.com meeting booking namespace and link slug.
- `GITHUB_API_TOKEN`: Personal GitHub token (no scopes required) for repository star count.
- `NEXT_PUBLIC_GITHUB_CONTRIBUTIONS_API_URL`: Contributions API endpoint for the home page graph.
- `NEXT_PUBLIC_OPENPANEL_CLIENT_ID` & `OPENPANEL_*`: OpenPanel analytics configuration (optional for local dev).
- `R2_*` (`R2_S3_API`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`): Cloudflare R2 credentials for syncing screenshots (required for `bun run capture:sync`).

### 4. Run the development server

```bash
bun run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

For mobile and LAN testing on the same Wi-Fi network, access via `http://<your-local-ip>:3000` (allowed dev origins are configured in `next.config.ts`).

## Building for production

To create an optimized production build:

```bash
bun run build
```

To start the production server:

```bash
bun run start
```

Or build and run in a single preview command:

```bash
bun run preview
```

## Quality assurance and CI checks

These commands mirror the GitHub Actions CI workflow ([.github/workflows/ci.yml](./.github/workflows/ci.yml)). Run them locally before opening a pull request or pushing code:

```bash
bun run test:run        # Run test suite with Vitest (47 tests)
bun run lint            # Check code style and rules with ESLint
bun run lint:fix        # Automatically fix lint issues
bun run format:check    # Check formatting with Prettier
bun run format:write    # Auto-format all files with Prettier
bun run check-types     # Type check with TypeScript (tsc --noEmit)
bun run build           # Compile production build (generates .next/types)
```

> [!NOTE]
> On a fresh checkout, `bun run check-types` requires `bun run build` to run first because `tsc --noEmit` depends on the global types that Next.js generates in `.next/types/**`.

## Git hooks (Husky & Lint-Staged)

The project includes pre-commit hooks configured via Husky and `lint-staged`:

- On `git commit`, `lint-staged` automatically runs `eslint --fix` and `prettier --write` on staged `*.{js,jsx,ts,tsx}` and `*.mdx` files.

## Screenshots, blog covers, and asset sync

The project includes automated scripts in `src/scripts` to capture screenshots, process blog covers, and upload them to Cloudflare R2:

```bash
bun run capture       # Capture desktop, mobile, and OG screenshots into .nitish/screenshots
bun run capture:cover # Generate 1200x630 WebP covers for blog posts into .nitish/screenshots/blog
bun run capture:sync  # Sync captured screenshots and covers to Cloudflare R2 bucket (images/ folder)
```

### Blog cover generation (`capture:cover`)

The `capture:cover` script supports multiple flexible modes for generating 1200×630 WebP blog covers:

#### 1. Auto-detected custom image (Recommended)

Drop your raw image (any random dimensions/aspect ratio) in `src/assets/blog-covers/`:

```bash
# Place your image at: src/assets/blog-covers/<slug>.png (or .jpg, .webp, .svg, .avif)
bun run capture:cover <slug>
```

Options for custom images:

- `--fit contain` (default): Fits image on a 1200×630 dark canvas (`#09090b`) without distortion or cropping.
- `--fit blur`: Creates an ambient blurred backdrop with the sharp image centered in foreground (Apple/Stripe presentation style).
- `--fit cover`: Fills 1200×630 edge-to-edge using smart entropy focus.
- `--zoom <number>`: Adjust scaling/padding of the image (e.g. `--zoom 0.9` for extra matte padding).
- `--theme <dark|light>`: Canvas theme color (default: `dark`).

#### 2. Explicit source image

Process any image on your computer:

```bash
bun run capture:cover <slug> --source ./path/to/image.png [--fit contain|blur|cover]
```

#### 3. Live webpage / demo capture (Puppeteer)

Capture any live URL, local preview, or web app:

```bash
bun run capture:cover <slug> --url http://localhost:3000/demo [--theme dark|light] [--zoom 1.5] [--dpr 2]
```

- `--theme`: Emulates `prefers-color-scheme: dark` or `light`.
- `--zoom`: Scales webpage content before capture.
- `--dpr`: Device pixel ratio (use `2` for high-DPI retina rendering).

#### 4. Branded OG card fallback

If no custom image or URL is provided, the script automatically fetches the `/og/simple` route (rendering title, description, and the brand mark) and converts it to WebP.

#### Batch processing

Generate covers for all posts in `src/features/doc/content/blog/`:

```bash
bun run capture:cover --all [--force]
```

> [!IMPORTANT]
> `bun run capture:sync` requires the `R2_*` credentials to be set in `.env.local`. Output files in `.nitish/screenshots/blog/<slug>.webp` are synced to `images/blog/<slug>.webp` on Cloudflare R2 and served publicly via `https://assets.nitishdeshmukh.com/images/blog/<slug>.webp`.
>
> After a successful sync to R2, raw source images in `src/assets/blog-covers/` are automatically cleaned up (preserving `.gitkeep`) to prevent bloating the Git repository.

### Automated post-deploy capture (GitHub Actions)

The repository includes [.github/workflows/capture.yml](./.github/workflows/capture.yml) which automatically runs after every successful **Production** deployment on Vercel (via GitHub's native `deployment_status` event).

1. Vercel deploys the live site to `https://nitishdeshmukh.com` and notifies GitHub.
2. The `capture.yml` workflow triggers on `deployment_status: success` for `Production`.
3. Headless Chromium captures fresh desktop, mobile, and OpenGraph screenshots using `bun run capture --force`.
4. The screenshots are automatically uploaded to Cloudflare R2 using `bun run capture:sync`.

> [!TIP]
> You can also trigger this workflow manually at any time from the **Actions** tab on GitHub via `workflow_dispatch`. Ensure repository secrets `R2_S3_API`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, and `R2_BUCKET` are added under **Settings > Secrets and variables > Actions**.

## Utility commands

```bash
bun run generate-libphonenumber-metadata  # Generate minimal phone metadata for supported countries (IN)
bun run upgrade:next                      # Upgrade Next.js using official codemods
bun run upgrade:tailwind                  # Upgrade Tailwind CSS using the Tailwind codemod
```
