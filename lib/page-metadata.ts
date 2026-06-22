import type { Metadata } from "next"

import { siteConfig } from "@/config/site"

const SITE_URL = "https://sharuco.lndev.me"

/**
 * Build consistent per-page metadata for static routes. `title` is the bare
 * page name (the root layout template turns it into "Title | Sharuco"); the
 * same suffixed title is reused for OpenGraph/Twitter so social cards match.
 */
export function pageMetadata({
  title,
  description,
  path,
  index = true,
}: {
  title: string
  description: string
  path: string
  index?: boolean
}): Metadata {
  const url = `${SITE_URL}${path}`
  const fullTitle = `${title} | ${siteConfig.name}`

  return {
    title,
    description,
    alternates: { canonical: url },
    ...(index ? {} : { robots: { index: false, follow: false } }),
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@ln_dev7",
      creator: "@ln_dev7",
      title: fullTitle,
      description,
    },
  }
}
