import { NavItem } from "@/types/nav"

interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
  links: {
    twitter: string
    github: string
    author: string
  }
}

export const siteConfig: SiteConfig = {
  name: "Sharuco",
  description: "Share your code with everyone.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
  ],
  links: {
    twitter: "https://twitter.com/sharuco_app",
    github: "https://github.com/ln-dev7/sharuco",
    author: "https://lndev.me",
  },
}
