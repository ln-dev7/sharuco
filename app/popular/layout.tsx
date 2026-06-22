import { pageMetadata } from "@/lib/page-metadata"

export const metadata = pageMetadata({
  title: "Popular code",
  description:
    "Browse the most popular and most liked public code snippets shared by the Sharuco community.",
  path: "/popular",
})

export default function PopularLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
