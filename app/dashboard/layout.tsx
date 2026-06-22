import { pageMetadata } from "@/lib/page-metadata"

export const metadata = pageMetadata({
  title: "Dashboard",
  description:
    "Manage your code snippets, forms and links from your personal Sharuco dashboard.",
  path: "/dashboard",
  index: false,
})

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
