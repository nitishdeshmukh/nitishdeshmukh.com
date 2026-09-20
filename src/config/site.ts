import type { Route } from "next"

import type { NavItem } from "@/types/nav"
import { SOCIAL } from "@/features/portfolio/data/social-links"
import { USER } from "@/features/portfolio/data/user"
import { SPONSORS } from "@/features/sponsor/data"

const currentYear = new Date().getFullYear()

export const SITE_INFO = {
  name: USER.displayName,
  url: process.env.NEXT_PUBLIC_APP_URL || "https://nitishdeshmukh.com",
  ogImage: USER.ogImage,
  description: USER.bio,
  keywords: USER.keywords,
  copyright: `&copy; ${currentYear} Nitish Deshmukh.`,
}

export const LICENSE = {
  name: "MIT License",
  url: "https://github.com/nitishdeshmukh/nitishdeshmukh.com/blob/main/LICENSE",
}

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}

export const MAIN_NAV: NavItem<Route>[] = [
  {
    title: "Resume",
    href: "/cv" as Route,
  },
  {
    title: "Blog",
    href: "/blog",
  },
  {
    title: "Book a Meeting",
    href: "/cal" as Route,
  },
  ...(SPONSORS.length > 0
    ? [
        {
          title: "Sponsors",
          href: "/sponsors" as Route,
        },
      ]
    : []),
]

export const MOBILE_NAV: NavItem<Route>[] = [
  {
    title: "Home",
    href: "/",
  },
  ...MAIN_NAV,
]

export const X_HANDLE = SOCIAL.x.handle
export const GITHUB_USERNAME = SOCIAL.github.handle
export const SOURCE_CODE_GITHUB_REPO = "nitishdeshmukh/nitishdeshmukh.com"
export const SOURCE_CODE_GITHUB_URL =
  "https://github.com/nitishdeshmukh/nitishdeshmukh.com"
export const SPONSORSHIP_URL = "https://github.com/sponsors/nitishdeshmukh/"

export const FOOTER_BRANDING = {
  tagline: "Building Intelligent Systems with",
}

export const UTM_PARAMS = {
  utm_source: "nitishdeshmukh.com",
}
