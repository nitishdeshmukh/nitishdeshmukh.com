import type { Metadata } from "next"
import { Loader } from "lucide-react"
import type { WebPage as PageSchema, WithContext } from "schema-dts"

import { JSON_LD_ID } from "@/config/json-ld"
import { X_HANDLE } from "@/config/site"
import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { absoluteUrl } from "@/lib/utils"
import {
  PageHeading,
  PageHeadingDescription,
  PageHeadingTagline,
  PageHeadingTitle,
} from "@/components/page-heading"
import {
  PdfViewer,
  PdfViewerControls,
  PdfViewerDownload,
  PdfViewerFilename,
  PdfViewerFooter,
  PdfViewerOpen,
  PdfViewerPagination,
  PdfViewerReload,
  PdfViewerToolbar,
  PdfViewerZoom,
} from "@/features/cv/components/pdf-viewer"
import { getCvFilename } from "@/features/cv/lib/cv"

const title = "CV - Professional Resume"
const description =
  "Experience, projects, and skills. One page, everything that matters."

const ogImage = `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/cv",
  },
  openGraph: {
    url: "/cv",
    type: "website",
    images: {
      url: ogImage,
      width: 1200,
      height: 630,
      alt: title,
    },
  },
  twitter: {
    card: "summary_large_image",
    site: X_HANDLE,
    creator: X_HANDLE,
    images: [ogImage],
  },
}

function getPageJsonLd(): WithContext<PageSchema> {
  const pageUrl = "/cv"

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": absoluteUrl(pageUrl),
    name: title,
    description: description,
    url: absoluteUrl(pageUrl),
    image: absoluteUrl(ogImage),
    author: { "@id": JSON_LD_ID.person },
  }
}

export default function CvPage() {
  const filename = getCvFilename()

  return (
    <>
      <JsonLdScript data={getPageJsonLd()} />
      <JsonLdScript
        data={jsonLdBreadcrumbList([
          {
            name: "Home",
            href: "/",
          },
          {
            name: "CV",
            href: "/cv",
          },
        ])}
      />

      <div className="flex min-h-svh flex-col">
        <PageHeading>
          <PageHeadingTagline>CV</PageHeadingTagline>
          <PageHeadingTitle>Professional Resume</PageHeadingTitle>
          <PageHeadingDescription>
            Where I&apos;ve been, what I built, and what I actually know — one
            page.
          </PageHeadingDescription>
        </PageHeading>

        <div className="h-4" />
        <div className="screen-line-top h-3" />

        <PdfViewer
          aria-label={`CV PDF: ${filename}`}
          className="relative w-full flex-1 overflow-hidden border-y border-line bg-background sm:border-y-0 sm:border-t-0"
          downloadHref="/api/cv/download"
          file="/api/cv"
          loader={
            <div
              aria-label="Loading CV"
              className="flex h-full items-center justify-center"
              role="status"
            >
              <Loader className="size-6 animate-spin" aria-hidden="true" />
            </div>
          }
        >
          <PdfViewerToolbar aria-label="PDF viewer controls">
            <PdfViewerFilename
              aria-label={`File: ${filename}`}
              name={filename}
            />
            <PdfViewerControls>
              <PdfViewerPagination />
              <PdfViewerZoom />
              <PdfViewerReload />
              <PdfViewerOpen />
              <PdfViewerDownload label="Download" />
            </PdfViewerControls>
          </PdfViewerToolbar>

          <PdfViewerFooter>
            <div className="font-mono text-[11px] tracking-wide text-muted-foreground">
              ETag · Last-Modified · Content-Length
            </div>
          </PdfViewerFooter>
        </PdfViewer>

        <div className="screen-line-top h-4" />
      </div>
    </>
  )
}
