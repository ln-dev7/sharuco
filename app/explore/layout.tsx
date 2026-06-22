import { pageMetadata } from "@/lib/page-metadata"

export const metadata = pageMetadata({
  title: "Explore",
  description:
    "Discover and explore public code snippets shared by developers from all over the world on Sharuco.",
  path: "/explore",
})

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
