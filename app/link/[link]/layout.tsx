import type { Metadata } from "next"

import { getFirestoreDoc } from "@/lib/firestore-rest"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ link: string }>
}): Promise<Metadata> {
  const { link } = await params
  const doc = await getFirestoreDoc("users", link?.toLowerCase())

  const handle = (doc?.pseudo as string) || link
  const name = (doc?.displayName as string) || `@${handle}`
  const title = `${name} — Links`
  const description = `All the links shared by ${name} (@${handle}), in one place on Sharuco.`
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

export default function LinkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
