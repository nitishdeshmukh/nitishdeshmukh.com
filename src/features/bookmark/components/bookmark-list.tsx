import type { BookmarkListEntry } from "../types"

export function BookmarkList({ entries }: { entries: BookmarkListEntry[] }) {
  return <ul>{entries.map(renderEntry)}</ul>
}

const renderEntry = (entry: BookmarkListEntry) => (
  <li key={entry.url} className="border-b border-line">
    {entry.card}
  </li>
)
