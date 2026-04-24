import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import { load } from "cheerio"

const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^169\.254\./,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
  /^\[/,
]

function isSafeUrl(raw: string): URL | null {
  let parsed: URL
  try {
    parsed = new URL(raw)
  } catch {
    return null
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null
  const hostname = parsed.hostname
  if (!hostname) return null
  if (PRIVATE_HOST_PATTERNS.some((re) => re.test(hostname))) return null
  return parsed
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url")

  if (!url) {
    return NextResponse.json(
      { error: "Missing url parameter" },
      { status: 400 }
    )
  }

  const safeUrl = isSafeUrl(url)
  if (!safeUrl) {
    return NextResponse.json(
      { error: "Invalid or blocked URL" },
      { status: 400 }
    )
  }

  try {
    const { data } = await axios.get(safeUrl.toString(), {
      timeout: 5000,
      maxContentLength: 5 * 1024 * 1024,
      maxRedirects: 3,
      headers: { "User-Agent": "SharucoLinkPreview/1.0" },
    })
    const $ = load(data)

    const getMetaTag = (name: string) =>
      $(`meta[name=${name}]`).attr("content") ||
      $(`meta[property="twitter:${name}"]`).attr("content") ||
      $(`meta[property="og:${name}"]`).attr("content")

    return NextResponse.json({
      url: safeUrl.toString(),
      title: $("title").first().text(),
      favicon:
        $('link[rel="shortcut icon"]').attr("href") ||
        $('link[rel="alternate icon"]').attr("href"),
      description: getMetaTag("description"),
      image: getMetaTag("image"),
      author: getMetaTag("author"),
    })
  } catch {
    return NextResponse.json(
      "Something went wrong, please check your internet connection and also the URL you provided",
      { status: 500 }
    )
  }
}
