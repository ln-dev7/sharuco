import { NavItem } from "@/types/nav"

interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
  links: {
    twitter: string
    github: string
    explore: string
  }
}

export const siteConfig: SiteConfig = {
  name: "Sharuco",
  description: "Share your code with everyone.",
  mainNav: [
    {
      title: "Explore",
      href: "/explore",
      pined: false,
      support: false,
    },
    {
      title: "Forms",
      href: "/forms",
      pined: false,
      support: false,
    },
    {
      title: "Links",
      href: "/links",
      pined: false,
      support: false,
    },
    {
      title: "Popular code",
      href: "/popular",
      pined: false,
      support: false,
    },
    {
      title: "Image",
      href: "/image",
      pined: true,
      support: false,
    },
    {
      title: "Support",
      href: "https://lndev.mychariow.shop/prd_3cu1s0",
      external: true,
      support: false,
    },
  ],
  links: {
    twitter: "https://twitter.com/sharuco_app",
    github: "https://github.com/ln-dev7/sharuco",
    explore: "/explore",
  },
}
