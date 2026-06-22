import { pageMetadata } from "@/lib/page-metadata"

export const metadata = pageMetadata({
  title: "Super admin",
  description: "Sharuco administration area.",
  path: "/super-admin",
  index: false,
})

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
