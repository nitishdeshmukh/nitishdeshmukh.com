import type { Metadata } from "next"
import type { WebPage as PageSchema, WithContext } from "schema-dts"

import { JSON_LD_ID } from "@/config/json-ld"
import { X_HANDLE } from "@/config/site"
import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { absoluteUrl } from "@/lib/utils"
import {
  PageHeading,
  PageHeadingTagline,
  PageHeadingTitle,
} from "@/components/page-heading"
import CalEmbed from "@/features/cal/components/cal-embed"

const title = "Book a Meeting"
const description = "Schedule a 30-minute meeting to discuss anything."

const ogImage = `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/cal",
  },
  openGraph: {
    url: "/cal",
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
  const pageUrl = "/cal"

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

export default function Page() {
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
            name: title,
            href: "/cal",
          },
        ])}
      />

      <div className="min-h-svh">
        <PageHeading>
          <PageHeadingTagline>Book a Meeting</PageHeadingTagline>
          <PageHeadingTitle>
            Schedule a 30-minute meeting to discuss anything.
          </PageHeadingTitle>
        </PageHeading>

        <div className="h-4" />
        <div className="screen-line-top h-3" />

        <div className="flex h-full items-center justify-center p-0 select-none md:min-h-150 lg:px-8 lg:pt-12 lg:pb-20">
          <div className="z-10 mx-auto flex size-full flex-row items-center justify-center">
            <CalEmbed />
          </div>
        </div>

        <div className="screen-line-top h-4" />
      </div>
    </>
  )
}
