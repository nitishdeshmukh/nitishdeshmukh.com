import { NextResponse } from "next/server"

import { fetchCv, forwardCvHeaders } from "@/features/cv/lib/cv"

export async function GET() {
  try {
    const res = await fetchCv()

    if (!res.body) {
      throw new Error("No CV body found")
    }
    return new NextResponse(res.body, {
      headers: forwardCvHeaders(res, { "Content-Disposition": "inline" }),
    })
  } catch {
    return NextResponse.json({ error: "Failed to fetch CV" }, { status: 500 })
  }
}
