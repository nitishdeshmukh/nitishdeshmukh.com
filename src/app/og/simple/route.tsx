import { readFileSync } from "node:fs"
import { join } from "node:path"
import { ImageResponse } from "next/og"

import { clampParam } from "../params"

const geistSemiBold = readFileSync(
  join(process.cwd(), "src/assets/fonts/Geist-SemiBold.ttf")
)

const geistMonoRegular = readFileSync(
  join(process.cwd(), "src/assets/fonts/GeistMono-Regular.ttf")
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const title = clampParam(searchParams.get("title"), 160)
  const description = clampParam(searchParams.get("description"), 320)

  return new ImageResponse(
    <div tw="flex h-full w-full bg-black text-zinc-50">
      <div tw="absolute inset-y-0 left-12 flex w-px border border-zinc-800" />
      <div tw="absolute inset-y-0 right-12 flex w-px border border-zinc-800" />
      <div tw="absolute inset-x-0 top-12 flex h-px border border-zinc-800" />
      <div tw="absolute inset-x-0 bottom-12 flex h-px border border-zinc-800" />

      <div tw="absolute top-18 left-18 flex">
        <svg
          width={128}
          height={64}
          viewBox="0 0 512 256"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M31.382 31.327L16.8249 8.99426H4.31594V54.5163H17.3369V32.1224L31.9672 54.5163H44.403V8.99426H31.382V31.327Z"
            fill="currentColor"
          />

          <path
            d="M89.7821 31.7553C89.7821 28.5328 89.2457 25.5347 88.1728 22.761C87.0999 19.9465 85.4906 17.5398 83.3448 15.5411C81.199 13.5016 78.5168 11.9108 75.2981 10.7686C72.0794 9.58572 68.3487 8.99426 64.1059 8.99426H53.1332V54.5163H65.7153C70.1531 54.5163 73.9082 53.9044 76.9806 52.6807C80.053 51.457 82.5401 49.805 84.4421 47.7247C86.344 45.6444 87.7095 43.2377 88.5385 40.5048C89.3676 37.731 89.7821 34.8145 89.7821 31.7553Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div tw="absolute inset-x-0 top-40 bottom-24 flex flex-col justify-end border-t-2 border-zinc-800">
        <div
          tw="border-t-2 border-b-2 border-zinc-800 px-18"
          style={{
            fontFamily: "GeistSans",
            fontWeight: 600,
            fontSize: 64,
            lineHeight: 1,
            textWrap: "balance",
            letterSpacing: "-0.025em",
          }}
        >
          {title}
        </div>

        {description && (
          <div tw="flex flex-col">
            <div
              tw="border-b-2 border-zinc-800 px-18 py-8 text-zinc-400"
              style={{
                fontFamily: "GeistMono",
                fontWeight: 400,
                fontSize: 32,
                lineHeight: 1.25,
                textWrap: "balance",
              }}
            >
              {description}
            </div>
          </div>
        )}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "GeistSans",
          data: geistSemiBold,
          weight: 600,
        },
        {
          name: "GeistMono",
          data: geistMonoRegular,
          weight: 400,
        },
      ],
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=31536000, immutable",
      },
    }
  )
}
