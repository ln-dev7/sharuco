import { pageMetadata } from "@/lib/page-metadata"

export const metadata = pageMetadata({
  title: "New form",
  description:
    "Build a new form from scratch and start collecting responses with Sharuco Form.",
  path: "/forms/new",
})

export default function NewFormLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
