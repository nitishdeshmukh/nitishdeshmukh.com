import { SITE_INFO } from "@/config/site"

export const cvConfig = {
  name: SITE_INFO.name,
  cvURL: process.env.NEXT_PUBLIC_CV_URL,
}

export function formatFileDate() {
  const d = new Date()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const year = d.getFullYear()
  return `${month}-${year}`
}

export async function fetchCv() {
  if (!cvConfig.cvURL) {
    throw new Error("CV_URL environment variable is not configured.")
  }

  const res = await fetch(cvConfig.cvURL, {
    next: { revalidate: 3600 },
  })

  if (!res.ok || !res.body) {
    throw new Error(`Failed to fetch CV: ${res.status} ${res.statusText}`)
  }

  return res
}

export function getCvFilename(download: boolean = false) {
  const formattedName = cvConfig.name.replace(/\s+/g, "_")
  const formattedDate = formatFileDate()
  return download
    ? `${formattedName}-CV-${formattedDate}.pdf`
    : `${cvConfig.name}'s Resume.pdf`
}

export function forwardCvHeaders(
  res: Response,
  extra: Record<string, string>
): Headers {
  const headers = new Headers({
    "Content-Type": "application/pdf",
    "Cache-Control": "public, max-age=3600",
    ...extra,
  })
  const contentLength = res.headers.get("content-length")
  const etag = res.headers.get("etag")
  const lastModified = res.headers.get("last-modified")
  if (contentLength) headers.set("Content-Length", contentLength)
  if (etag) headers.set("ETag", etag)
  if (lastModified) headers.set("Last-Modified", lastModified)
  return headers
}
