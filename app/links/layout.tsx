import { pageMetadata } from "@/lib/page-metadata"

export const metadata = pageMetadata({
  title: "Links",
  description:
    "Create your personal link page and share all of your important links in one place with Sharuco.",
  path: "/links",
})

export default function LinksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
