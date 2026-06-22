import { pageMetadata } from "@/lib/page-metadata"

export const metadata = pageMetadata({
  title: "Forms",
  description:
    "Create, manage and share beautiful forms to collect responses with Sharuco Form.",
  path: "/forms",
})

export default function FormsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
