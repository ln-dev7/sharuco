import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Providers } from "@/components/providers"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Toaster } from "@/components/ui/toaster"

import "./globals.css"
import "prism-themes/themes/prism-one-dark.min.css"

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://sharuco.lndev.me/"),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Sharuco allows you to share code codes that you have found useful.",
  openGraph: {
    title: siteConfig.name,
    description:
      "Sharuco allows you to share code codes that you have found useful.",
    url: "https://sharuco.lndev.me/",
    siteName: siteConfig.name,
    images: [
      {
        url: "/sharuco-banner.png",
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ln_dev7",
    creator: "@ln_dev7",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <Toaster />
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
