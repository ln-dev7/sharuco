import { NavItem } from "@/types/nav"

interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
  links: {
    twitter: string
    github: string
    donation: string
  }
}

export const siteConfig: SiteConfig = {
  name: "Sharuco",
  description: "Share your code with everyone.",
  mainNav: [
    {
      title: "Popular code",
      href: "/popular",
    },
    {
      title: "Explore",
      href: "/explore",
    },
  ],
  links: {
    twitter: "https://twitter.com/sharuco_app",
    github: "https://github.com/ln-dev7/sharuco",
    donation: "https://www.buymeacoffee.com/lndev",
  },
}
