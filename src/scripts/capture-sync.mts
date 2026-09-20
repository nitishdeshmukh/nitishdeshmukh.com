import fs from "node:fs"
import path from "node:path"

import { getR2ClientFromEnv, syncDirToR2 } from "./lib/r2.mts"

const screenshotsDir = path.join(process.cwd(), ".nitish/screenshots")
const blogCoversDir = path.join(process.cwd(), "src/assets/blog-covers")

async function cleanBlogCovers(syncedKeys: string[]) {
  if (!fs.existsSync(blogCoversDir)) return

  const entries = await fs.promises.readdir(blogCoversDir, {
    withFileTypes: true,
  })
  let cleanedCount = 0

  for (const entry of entries) {
    // Preserve .gitkeep and any dotfiles
    if (entry.name.startsWith(".")) continue
    if (!entry.isFile()) continue

    const baseSlug = path.basename(entry.name, path.extname(entry.name))
    const isSynced = syncedKeys.some(
      (key) =>
        key === `images/blog/${baseSlug}.webp` ||
        key.startsWith(`images/blog/${baseSlug}.`)
    )
    const localWebpExists = fs.existsSync(
      path.join(screenshotsDir, "blog", `${baseSlug}.webp`)
    )

    if (isSynced || (syncedKeys.length > 0 && localWebpExists)) {
      await fs.promises.unlink(path.join(blogCoversDir, entry.name))
      cleanedCount++
      console.log(`🧹 Cleaned up source image: src/assets/blog-covers/${entry.name}`)
    }
  }

  if (cleanedCount > 0) {
    console.log(
      `✨ Cleaned up ${cleanedCount} raw source image(s) from src/assets/blog-covers.`
    )
  }
}

async function main() {
  const client = getR2ClientFromEnv()

  const keys = await syncDirToR2({
    client,
    dir: screenshotsDir,
    getKey: (entryName, objectPath) => {
      if (objectPath.includes("/")) {
        return `images/${objectPath}`
      }
      if (entryName.includes("og")) {
        return `images/og/${entryName}`
      }
      return `images/screenshots/${entryName}`
    },
    prefix: "images",
    extensions: [".webp", ".png", ".jpg", ".jpeg"],
  })

  if (keys.length === 0) {
    console.log("⚠️ No screenshots found to sync.")
    return
  }

  for (const key of keys) {
    console.log(`✅ Uploaded: ${key}`)
  }

  console.log(`✅ Synced ${keys.length} screenshot(s) to R2.`)

  // Automatically clean up raw source images from src/assets/blog-covers after successful R2 sync
  await cleanBlogCovers(keys)
}

main().catch((error) => {
  console.error("⛔️ Error syncing screenshots:", error)
  process.exit(1)
})
