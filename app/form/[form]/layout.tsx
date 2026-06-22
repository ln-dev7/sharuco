import type { Metadata } from "next"

import { getFirestoreDoc } from "@/lib/firestore-rest"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ form: string }>
}): Promise<Metadata> {
  const { form } = await params
  const doc = await getFirestoreDoc("forms", form)
  const name = ((doc?.name as string) || "Form").trim()

  return {
    title: name,
    description: `Manage "${name}" — edit questions, settings and view responses on Sharuco Form.`,
    // form management is owner-facing, keep it out of search results
    robots: { index: false, follow: false },
  }
}

export default function FormLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
