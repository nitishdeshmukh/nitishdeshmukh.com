import { readFileSync } from "node:fs"
import { join } from "node:path"
import { ImageResponse } from "next/og"

import { clampParam } from "../params"

const geistMedium = readFileSync(
  join(process.cwd(), "src/assets/fonts/Geist-Medium.ttf")
)

const geistSemiBold = readFileSync(
  join(process.cwd(), "src/assets/fonts/Geist-SemiBold.ttf")
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const domain = clampParam(searchParams.get("domain"), 120)
  const isForSale = searchParams.get("sale") === "true"

  return new ImageResponse(
    <div tw="flex text-black bg-white w-full h-full p-16">
      <div tw="flex-1 flex flex-col justify-center border-l border-r border-zinc-200">
        <div tw="flex justify-center border-t border-b border-zinc-200">
          <h1
            tw="mt-8 mb-4 ml-8 mr-8"
            style={{
              fontFamily: "GeistSans",
              fontWeight: 600,
              fontSize: 88,
              letterSpacing: "-0.025em",
            }}
          >
            {domain}
          </h1>
        </div>

        <div tw="flex justify-center border-b border-zinc-200">
          <p
            tw="mt-0 mb-0 pt-4 pb-4 pl-8 pr-8"
            style={{
              fontFamily: "GeistSans",
              fontWeight: 500,
              fontSize: 32,
              color: isForSale ? "#22c55e" : "#71717a",
            }}
          >
            {isForSale
              ? "The domain name is for sale"
              : "The website will be launched soon"}
          </p>
        </div>
      </div>

      <div tw="absolute flex inset-y-0 w-px bg-zinc-200 left-16" />
      <div tw="absolute flex inset-y-0 w-px bg-zinc-200 right-16" />
      <div tw="absolute flex inset-x-0 h-px bg-zinc-200 top-16" />
      <div tw="absolute flex inset-x-0 h-px bg-zinc-200 bottom-16" />

      <div tw="absolute flex bottom-16 right-16">
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
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "GeistSans",
          data: geistMedium,
          weight: 500,
        },
        {
          name: "GeistSans",
          data: geistSemiBold,
          weight: 600,
        },
      ],
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=31536000, immutable",
      },
    }
  )
}
