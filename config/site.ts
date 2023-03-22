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
      title: "Explore",
      href: "/explore",
    },
    {
      title: "Popular code",
      href: "/popular",
      disabled: true,
    },
    {
      title: "Product Hunt",
      href: "https://www.producthunt.com/products/sharuco",
      external: true,
    },
  ],
  links: {
    twitter: "https://twitter.com/ln_dev7",
    github: "https://github.com/ln-dev7/sharuco",
    donation: "https://www.buymeacoffee.com/lndev",
  },
}
