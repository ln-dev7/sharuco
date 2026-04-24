export interface ImageLinkParams {
  code: string
  language?: string
  title?: string
  author?: string
  authorHandle?: string
  authorAvatar?: string
}

function encode(value: string): string {
  if (typeof window === "undefined") {
    return Buffer.from(value, "utf8").toString("base64url")
  }
  const bytes = new TextEncoder().encode(value)
  let bin = ""
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function decode(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/")
  const pad = padded.length % 4
  const full = pad ? padded + "=".repeat(4 - pad) : padded
  if (typeof window === "undefined") {
    return Buffer.from(full, "base64").toString("utf8")
  }
  const bin = atob(full)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

export function buildImageUrl({
  code,
  language,
  title,
  author,
  authorHandle,
  authorAvatar,
}: ImageLinkParams): string {
  const params = new URLSearchParams()
  params.set("code", encode(code))
  if (language) params.set("lang", language.toLowerCase())
  if (title) params.set("title", title)
  if (author) params.set("author", author)
  if (authorHandle) params.set("handle", authorHandle)
  if (authorAvatar) params.set("avatar", authorAvatar)
  return `/image?${params.toString()}`
}

export function readImageParams(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>
): Partial<ImageLinkParams> {
  const get = (k: string): string | undefined => {
    if (typeof (searchParams as URLSearchParams).get === "function") {
      return (searchParams as URLSearchParams).get(k) ?? undefined
    }
    const value = (
      searchParams as Record<string, string | string[] | undefined>
    )[k]
    return Array.isArray(value) ? value[0] : value
  }

  const rawCode = get("code")
  let code: string | undefined
  if (rawCode) {
    try {
      code = decode(rawCode)
    } catch {
      code = rawCode
    }
  }

  return {
    code,
    language: get("lang"),
    title: get("title"),
    author: get("author"),
    authorHandle: get("handle"),
    authorAvatar: get("avatar"),
  }
}
