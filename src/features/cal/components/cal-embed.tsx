"use client"

import Cal from "@calcom/embed-react"

export default function CalEmbed() {
  const namespace = process.env.NEXT_PUBLIC_CAL_NAMESPACE
  const calLink = process.env.NEXT_PUBLIC_CAL_LINK

  if (!calLink) {
    return null
  }

  return (
    <div className="cal-embed w-full">
      <Cal namespace={namespace} calLink={calLink} />
    </div>
  )
}
