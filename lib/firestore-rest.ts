/**
 * Minimal server-side Firestore reader used by `generateMetadata` in dynamic
 * routes. The project has no firebase-admin setup and pages are Client
 * Components, so we read public documents through the Firestore REST API
 * (subject to the same security rules as an unauthenticated client).
 */

type FirestoreValue = Record<string, any>

// Convert a single Firestore REST typed value into a plain JS value.
function parseValue(value: FirestoreValue): any {
  if (value == null) return null
  if ("stringValue" in value) return value.stringValue
  if ("booleanValue" in value) return value.booleanValue
  if ("integerValue" in value) return Number(value.integerValue)
  if ("doubleValue" in value) return value.doubleValue
  if ("nullValue" in value) return null
  if ("timestampValue" in value) return value.timestampValue
  if ("arrayValue" in value)
    return (value.arrayValue.values || []).map(parseValue)
  if ("mapValue" in value) return parseFields(value.mapValue.fields || {})
  return null
}

function parseFields(
  fields: Record<string, FirestoreValue>
): Record<string, any> {
  const out: Record<string, any> = {}
  for (const [key, value] of Object.entries(fields)) {
    out[key] = parseValue(value)
  }
  return out
}

/**
 * Fetch a single document and return its fields as a plain object, or null if
 * it doesn't exist / isn't readable / the request fails.
 */
export async function getFirestoreDoc(
  collection: string,
  id: string | undefined | null
): Promise<Record<string, any> | null> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  if (!projectId || !id) return null

  const url =
    `https://firestore.googleapis.com/v1/projects/${projectId}` +
    `/databases/(default)/documents/${collection}/${encodeURIComponent(id)}` +
    (apiKey ? `?key=${apiKey}` : "")

  try {
    const res = await fetch(url, { next: { revalidate: 300 } })
    if (!res.ok) return null
    const json = await res.json()
    if (!json.fields) return null
    return parseFields(json.fields)
  } catch {
    return null
  }
}

/** Trim text to a max length for use in meta descriptions / titles. */
export function truncate(text: string, max = 160): string {
  const clean = (text || "").replace(/\s+/g, " ").trim()
  if (clean.length <= max) return clean
  return clean.slice(0, max - 1).trimEnd() + "…"
}
