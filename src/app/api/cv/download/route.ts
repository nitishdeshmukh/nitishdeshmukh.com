import { NextResponse } from "next/server"

import { fetchCv, forwardCvHeaders, getCvFilename } from "@/features/cv/lib/cv"

export async function GET() {
  try {
    const res = await fetchCv()

    if (!res.body) {
      throw new Error("No CV body found")
    }

    const filename = getCvFilename(true)
    return new NextResponse(res.body, {
      headers: forwardCvHeaders(res, {
        "Content-Disposition": `attachment; filename="${filename}"`,
      }),
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to download CV" },
      { status: 500 }
    )
  }
}
