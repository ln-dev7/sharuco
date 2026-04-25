import { Suspense } from "react"
import type { Metadata } from "next"

import { ImagePageClient } from "./image-page-client"

const IMAGE_PAGE_URL = "https://sharuco.lndev.me/image"
const IMAGE_PAGE_TITLE = "Code to Image — Beautiful Code Screenshots Generator"
const IMAGE_PAGE_DESCRIPTION =
  "Turn any code snippet into a stunning, shareable screenshot. 30+ backgrounds, partner-made syntax themes, custom fonts, line numbers, window controls, and one-click PNG export — free, no sign-up."
const IMAGE_PAGE_OG_IMAGE = {
  url: "/sharuco-image-banner.png",
  width: 2780,
  height: 1628,
  alt: "Sharuco — Create beautiful images of your code",
}

export const metadata: Metadata = {
  title: IMAGE_PAGE_TITLE,
  description: IMAGE_PAGE_DESCRIPTION,
  keywords: [
    "code to image",
    "code screenshot",
    "code image generator",
    "snippet to png",
    "beautiful code screenshots",
    "share code online",
    "syntax highlighter",
    "code to image converter",
    "ray.so alternative",
    "carbon alternative",
    "codeshot",
    "shiki themes",
    "developer tools",
    "Sharuco",
  ],
  authors: [{ name: "Leonel Ngoya", url: "https://lndev.me" }],
  creator: "Leonel Ngoya",
  publisher: "Sharuco",
  category: "Developer Tools",
  applicationName: "Sharuco",
  alternates: { canonical: IMAGE_PAGE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: IMAGE_PAGE_TITLE,
    description: IMAGE_PAGE_DESCRIPTION,
    url: IMAGE_PAGE_URL,
    siteName: "Sharuco",
    type: "website",
    locale: "en_US",
    images: [IMAGE_PAGE_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ln_dev7",
    creator: "@ln_dev7",
    title: IMAGE_PAGE_TITLE,
    description: IMAGE_PAGE_DESCRIPTION,
    images: [IMAGE_PAGE_OG_IMAGE.url],
  },
}

export default function ImagePage() {
  return (
    <Suspense fallback={null}>
      <ImagePageClient />
    </Suspense>
  )
}
