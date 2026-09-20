import { z } from "zod"

import { op } from "./openpanel"

const eventSchema = z.object({
  name: z.enum([
    "copy_email",
    "copy_phone_number",
    "open_command_menu",
    "command_menu_search",
    "command_menu_action",
    "blog_search",
    "toc_inline_toggle",
    "toc_inline_item_click",
    "toc_minimap_hover",
    "toc_minimap_item_click",
    "keyboard_shortcut_navigate",
    "bookmark_click",
  ]),
  // declare type AllowedPropertyValues = string | number | boolean | null
  properties: z
    .record(
      z.string(),
      z.union([z.string(), z.number(), z.boolean(), z.null()])
    )
    .optional(),
})

export type Event = z.infer<typeof eventSchema>

export function trackEvent(input: Event) {
  const event = eventSchema.parse(input)
  if (event) {
    console.log("trackEvent:", event)
    op.track(event.name, event.properties)
  }
}
