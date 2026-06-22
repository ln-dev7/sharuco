import type { Metadata } from "next"

import { getFirestoreDoc, truncate } from "@/lib/firestore-rest"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ form: string }>
}): Promise<Metadata> {
  const { form } = await params
  const doc = await getFirestoreDoc("forms", form)

  if (!doc?.name) {
    return {
      title: "Form",
      description: "Fill out and submit this form on Sharuco Form.",
    }
  }

  const title = (doc.name as string).trim()
  const description = doc.description
    ? truncate(doc.description as string)
    : `Fill out "${title}" and submit your response on Sharuco Form.`

  return {
    // exact form name as the document title (no "| Sharuco" suffix)
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default function FormViewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
