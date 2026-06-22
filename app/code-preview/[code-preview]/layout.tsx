import type { Metadata } from "next"

import { getFirestoreDoc, truncate } from "@/lib/firestore-rest"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ "code-preview": string }>
}): Promise<Metadata> {
  const { "code-preview": id } = await params
  const doc = await getFirestoreDoc("codes", id)

  // Private or unreadable snippet → generic, non-indexed metadata.
  if (!doc || doc.isPrivate) {
    return {
      title: "Code snippet",
      description: "A code snippet shared on Sharuco.",
      robots: doc?.isPrivate ? { index: false, follow: false } : undefined,
    }
  }

  const language = (doc.language as string) || "code"
  const author = doc.idAuthor ? ` by @${doc.idAuthor}` : ""
  const description = doc.description
    ? truncate(doc.description as string)
    : `A ${language} code snippet shared on Sharuco${author}.`
  const title = doc.description
    ? truncate(doc.description as string, 60)
    : `${language.charAt(0).toUpperCase()}${language.slice(1)} snippet`

  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  }
}

export default function CodePreviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
