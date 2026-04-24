import { Suspense } from "react"
import type { Metadata } from "next"

import { ImagePageClient } from "./image-page-client"

export const metadata: Metadata = {
  title: "Create beautiful images of your code",
  description:
    "Turn any snippet into a shareable screenshot. Pick from 30+ backgrounds and partner themes, tune the padding, toggle line numbers, and export as PNG.",
  alternates: { canonical: "https://sharuco.lndev.me/image" },
  openGraph: {
    title: "Create beautiful images of your code — Sharuco",
    description:
      "Turn any snippet into a shareable screenshot. Pick from 30+ backgrounds and partner themes, tune the padding, toggle line numbers, and export as PNG.",
    url: "https://sharuco.lndev.me/image",
    type: "website",
    images: [
      {
        url: "/sharuco-banner.png",
        alt: "Sharuco — Create beautiful images of your code",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Create beautiful images of your code — Sharuco",
    description:
      "Turn any snippet into a shareable screenshot. Pick from 30+ backgrounds and partner themes, tune the padding, toggle line numbers, and export as PNG.",
    images: ["/sharuco-banner.png"],
  },
}

export default function ImagePage() {
  return (
    <Suspense fallback={null}>
      <ImagePageClient />
    </Suspense>
  )
}
