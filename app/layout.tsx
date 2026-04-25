import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Providers } from "@/components/providers"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ThemeScript } from "@/components/theme-script"
import { Toaster } from "@/components/ui/toaster"

import "./globals.css"
import "prism-themes/themes/prism-one-dark.min.css"

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const SITE_URL = "https://sharuco.lndev.me/"
const SITE_TITLE = `${siteConfig.name} — Share Code Snippets & Create Beautiful Code Images`
const SITE_DESCRIPTION =
  "Sharuco is the all-in-one platform for developers to share code snippets, build forms, manage links, and turn any code into a stunning shareable image — free and open source."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${siteConfig.name}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Sharuco",
    "share code",
    "code snippets",
    "code sharing platform",
    "code to image",
    "code screenshots",
    "developer tools",
    "snippet manager",
    "open source",
    "syntax highlighting",
    "share snippets online",
    "developer productivity",
  ],
  authors: [{ name: "Leonel Ngoya", url: "https://lndev.me" }],
  creator: "Leonel Ngoya",
  publisher: "Sharuco",
  applicationName: siteConfig.name,
  category: "Developer Tools",
  alternates: { canonical: SITE_URL, languages: { "en-US": SITE_URL } },
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
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/sharuco-banner.png",
        width: 3024,
        height: 1892,
        alt: `${siteConfig.name} — Share code snippets and create beautiful code images`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ln_dev7",
    creator: "@ln_dev7",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/sharuco-banner.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  referrer: "origin-when-cross-origin",
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
      <head>
        <ThemeScript />
      </head>
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
