import type { SocialProfile } from "@/features/portfolio/types/social-links"

/**
 * Keyed registry of social profiles — the single source of truth. Icons are
 * bound separately in `social-link-icons.tsx` (keyed by the same `SocialName`),
 * so adding a profile here forces the icon map to stay in sync at compile time.
 */
export const SOCIAL = {
  kaggle: {
    title: "kaggle",
    handle: "nitishdeshmukh",
    href: "https://www.kaggle.com/nitishdeshmukh",
    sameAs: true,
  },
  github: {
    title: "GitHub",
    handle: "nitishdeshmukh",
    href: "https://github.com/nitishdeshmukh",
    sameAs: true,
  },
  linkedin: {
    title: "LinkedIn",
    handle: "nitish-deshmukh",
    href: "https://linkedin.com/in/nitish-deshmukh",
    sameAs: true,
  },
  x: {
    title: "X",
    handle: "@itsnitish02",
    href: "https://x.com/itsnitish02",
    sameAs: true,
  },
} satisfies Record<string, SocialProfile>

export type SocialName = keyof typeof SOCIAL

export type SocialLink = SocialProfile & { name: SocialName }

export const SOCIAL_LINKS: SocialLink[] = (
  Object.entries(SOCIAL) as [SocialName, SocialProfile][]
).map(([name, profile]) => ({ name, ...profile }))
