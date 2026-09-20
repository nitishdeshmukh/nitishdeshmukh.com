import fs from "node:fs"
import path from "node:path"
import { parseArgs } from "node:util"
import matter from "gray-matter"
import puppeteer from "puppeteer"
import sharp from "sharp"

const COVER = { width: 1200, height: 630 } as const

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nitishdeshmukh.com"
const blogDir = path.join(process.cwd(), "src/features/doc/content/blog")
const blogCoversDir = path.join(process.cwd(), "src/assets/blog-covers")
const outputDir = path.join(process.cwd(), ".nitish/screenshots/blog")

const SUPPORTED_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".svg",
]

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    all: { type: "boolean", default: false },
    url: { type: "string" },
    source: { type: "string" },
    fit: { type: "string", default: "contain" }, // "contain" | "blur" | "cover"
    theme: { type: "string", default: "dark" }, // "dark" | "light"
    zoom: { type: "string", default: "1" },
    dpr: { type: "string", default: "1" },
    quality: { type: "string", default: "90" },
    force: { type: "boolean", default: false },
  },
})

const slug = positionals[0]
const isAll = Boolean(values.all)
const customUrl = values.url
const explicitSource = values.source
const fitMode = (values.fit as "contain" | "blur" | "cover") || "contain"
const theme = (values.theme as "dark" | "light") || "dark"
const zoom = Math.max(0.1, Number(values.zoom) || 1)
const dpr = Math.max(1, Number(values.dpr) || 1)
const quality = Math.min(100, Math.max(1, Number(values.quality) || 90))
const isForce = Boolean(values.force)

if (!slug && !isAll && !customUrl) {
  console.log(`
Usage:
  bun run capture:cover <slug> [options]
  bun run capture:cover --all [options]

Modes:
  1. Auto-detected custom image:
     Place raw image in "src/assets/blog-covers/<slug>.(png|jpg|jpeg|webp)"
     bun run capture:cover <slug> [--fit contain|blur|cover] [--zoom 1]

  2. Explicit source image:
     bun run capture:cover <slug> --source ./path/to/image.png [--fit contain|blur|cover]

  3. Live URL / Webpage screenshot (Puppeteer):
     bun run capture:cover <slug> --url http://localhost:3000/demo [--theme dark|light] [--zoom 1.5] [--dpr 2]

  4. Branded OG Card Fallback:
     When no custom image or URL is provided, automatically generates cover from /og/simple.

Options:
  --all               Process all blog posts in src/features/doc/content/blog/
  --source <path>     Path to custom input image
  --url <url>         Capture live webpage via Puppeteer
  --fit <mode>        Fit mode for custom images: contain (default), blur, or cover
  --theme <theme>     Color theme: dark (default) or light
  --zoom <number>     Zoom scale factor (default: 1)
  --dpr <number>      Device pixel ratio for Puppeteer (default: 1, use 2 for retina)
  --quality <1-100>   WebP output quality (default: 90)
  --force             Overwrite existing cover image
`)
  process.exit(1)
}

function resolveLocalSourceImage(targetSlug: string): string | null {
  if (explicitSource) {
    const resolved = path.isAbsolute(explicitSource)
      ? explicitSource
      : path.join(process.cwd(), explicitSource)
    if (fs.existsSync(resolved)) {
      return resolved
    }
    throw new Error(`Explicit source image not found: ${resolved}`)
  }

  if (fs.existsSync(blogCoversDir)) {
    for (const ext of SUPPORTED_EXTENSIONS) {
      const candidate = path.join(blogCoversDir, `${targetSlug}${ext}`)
      if (fs.existsSync(candidate)) {
        return candidate
      }
    }
  }

  return null
}

function getBlogMetadata(targetSlug: string): {
  title: string
  description?: string
} {
  const filePath = path.join(blogDir, `${targetSlug}.mdx`)
  if (!fs.existsSync(filePath)) {
    return { title: targetSlug }
  }

  const raw = fs.readFileSync(filePath, "utf-8")
  const { data } = matter(raw)
  return {
    title: data.title || targetSlug,
    description: data.description,
  }
}

function getAllBlogSlugs(): string[] {
  if (!fs.existsSync(blogDir)) {
    return []
  }
  return fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => path.basename(file, ".mdx"))
}

async function processCustomImage({
  inputPath,
  outputPath,
  fit,
  theme,
  zoom,
  quality,
}: {
  inputPath: string
  outputPath: string
  fit: "contain" | "blur" | "cover"
  theme: "dark" | "light"
  zoom: number
  quality: number
}) {
  const inputBuffer = await fs.promises.readFile(inputPath)
  const bgColor = theme === "light" ? "#f4f4f5" : "#09090b"

  if (fit === "cover") {
    await sharp(inputBuffer)
      .resize(COVER.width, COVER.height, {
        fit: "cover",
        position: sharp.strategy.entropy,
      })
      .webp({ quality })
      .toFile(outputPath)
    return
  }

  if (fit === "blur") {
    const bgBuffer = await sharp(inputBuffer)
      .resize(COVER.width, COVER.height, { fit: "cover" })
      .blur(35)
      .modulate({ brightness: theme === "light" ? 0.9 : 0.45 })
      .toBuffer()

    const maxFgW = Math.min(1150, Math.round(1050 * zoom))
    const maxFgH = Math.min(580, Math.round(520 * zoom))

    const fgBuffer = await sharp(inputBuffer)
      .resize(maxFgW, maxFgH, { fit: "inside" })
      .toBuffer()

    await sharp(bgBuffer)
      .composite([{ input: fgBuffer, gravity: "center" }])
      .webp({ quality })
      .toFile(outputPath)
    return
  }

  // Default: "contain" with clean matte framing
  if (zoom === 1) {
    await sharp(inputBuffer)
      .resize(COVER.width, COVER.height, {
        fit: "contain",
        background: bgColor,
      })
      .webp({ quality })
      .toFile(outputPath)
  } else {
    const targetW = Math.min(COVER.width, Math.round(1100 * zoom))
    const targetH = Math.min(COVER.height, Math.round(580 * zoom))

    const fgBuffer = await sharp(inputBuffer)
      .resize(targetW, targetH, { fit: "inside" })
      .toBuffer()

    await sharp({
      create: {
        width: COVER.width,
        height: COVER.height,
        channels: 4,
        background: bgColor,
      },
    })
      .composite([{ input: fgBuffer, gravity: "center" }])
      .webp({ quality })
      .toFile(outputPath)
  }
}

// Launches Chrome with flags tuned for CI/Linux. `puppeteer.launch()` resolves
// the executable via the PUPPETEER_CACHE_DIR env var set by the workflow, so no
// hardcoded executablePath here (the versioned folder name changes each release).
async function launchPuppeteer() {
  try {
    return await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--ignore-certificate-errors",
      ],
    })
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    throw new Error(
      `Failed to launch Chrome for Puppeteer: ${reason}\n` +
      `If the executable is missing, run "bunx puppeteer browsers install chrome".`
    )
  }
}

async function captureUrlWithPuppeteer({
  url,
  outputPath,
  theme,
  zoom,
  dpr,
  quality,
}: {
  url: string
  outputPath: string
  theme: "dark" | "light"
  zoom: number
  dpr: number
  quality: number
}) {
  const browser = await launchPuppeteer()

  try {
    const page = await browser.newPage()
    await page.setViewport({ ...COVER, deviceScaleFactor: dpr })
    await page.emulateMediaFeatures([
      { name: "prefers-color-scheme", value: theme },
    ])

    const response = await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 30000,
    })

    if (!response?.ok()) {
      throw new Error(`URL "${url}" responded with status ${response?.status()}`)
    }

    if (zoom !== 1) {
      await page.evaluate((z) => {
        document.documentElement.style.zoom = String(z)
      }, zoom)
    }

    await page.screenshot({
      path: outputPath,
      type: "webp",
      quality,
    })
  } finally {
    await browser.close()
  }
}

async function generateOgCardFallback({
  slug,
  outputPath,
  quality,
}: {
  slug: string
  outputPath: string
  quality: number
}) {
  const { title, description } = getBlogMetadata(slug)

  const ogUrl = new URL("/og/simple", baseUrl)
  ogUrl.searchParams.set("title", title)
  if (description) {
    ogUrl.searchParams.set("description", description)
  }

  let response: Response
  try {
    response = await fetch(ogUrl.toString(), {
      signal: AbortSignal.timeout(6000),
    })
  } catch {
    throw new Error(
      `Dev server not reachable at ${baseUrl}. Please start dev server with "bun run dev".`
    )
  }

  if (!response.ok) {
    throw new Error(
      `OG endpoint failed with status ${response.status}: ${response.statusText}`
    )
  }

  const arrayBuffer = await response.arrayBuffer()
  const inputBuffer = Buffer.from(arrayBuffer)

  await sharp(inputBuffer).webp({ quality }).toFile(outputPath)
}

async function processSlug(targetSlug: string) {
  const outputPath = path.join(outputDir, `${targetSlug}.webp`)

  if (!isForce && fs.existsSync(outputPath)) {
    console.log(`⚠️ Cover already exists, skipping: ${outputPath}`)
    return
  }

  // Mode 1: URL provided
  if (customUrl) {
    console.log(`📸 [Puppeteer] Capturing "${targetSlug}" from URL: ${customUrl}`)
    await captureUrlWithPuppeteer({
      url: customUrl,
      outputPath,
      theme,
      zoom,
      dpr,
      quality,
    })
    console.log(`✅ Cover saved: ${outputPath}`)
    return
  }

  // Mode 2: Custom local image
  const localSource = resolveLocalSourceImage(targetSlug)
  if (localSource) {
    console.log(
      `🎨 [Custom Image] Processing "${targetSlug}" from ${path.relative(process.cwd(), localSource)} (fit: ${fitMode}, zoom: ${zoom})`
    )
    await processCustomImage({
      inputPath: localSource,
      outputPath,
      fit: fitMode,
      theme,
      zoom,
      quality,
    })
    console.log(`✅ Cover saved: ${outputPath}`)
    return
  }

  // Mode 3: Branded OG Fallback
  console.log(`✨ [OG Simple] Generating branded cover for "${targetSlug}"...`)
  await generateOgCardFallback({
    slug: targetSlug,
    outputPath,
    quality,
  })
  console.log(`✅ Cover saved: ${outputPath}`)
}

async function main() {
  await fs.promises.mkdir(outputDir, { recursive: true })
  await fs.promises.mkdir(blogCoversDir, { recursive: true })

  const slugs = isAll ? getAllBlogSlugs() : slug ? [slug] : []

  if (slugs.length === 0 && !customUrl) {
    console.log("⚠️ No blog posts found to capture.")
    return
  }

  if (slugs.length > 0) {
    for (const s of slugs) {
      await processSlug(s)
    }
    console.log(`🎉 Processed ${slugs.length} cover(s) successfully.`)
  } else if (customUrl && slug) {
    await processSlug(slug)
  }
}

main().catch((error) => {
  console.error("⛔️ Error capturing cover:", error)
  process.exit(1)
})
