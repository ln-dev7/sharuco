import type { Metadata } from "next"

import { getFirestoreDoc } from "@/lib/firestore-rest"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ user: string }>
}): Promise<Metadata> {
  const { user } = await params
  const doc = await getFirestoreDoc("users", user?.toLowerCase())

  const handle = (doc?.pseudo as string) || user
  const name = (doc?.displayName as string) || `@${handle}`
  const title = name
  const description = `Discover the code snippets shared by ${name} (@${handle}) on Sharuco.`
  const image = doc?.photoURL as string | undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? "summary" : "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  }
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
