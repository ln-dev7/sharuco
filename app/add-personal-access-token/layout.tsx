import { pageMetadata } from "@/lib/page-metadata"

export const metadata = pageMetadata({
  title: "Add a personal access token",
  description:
    "Connect your GitHub personal access token to sync and import your gists with Sharuco.",
  path: "/add-personal-access-token",
  index: false,
})

export default function AddPersonalAccessTokenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
