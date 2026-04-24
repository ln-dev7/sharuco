import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import { load } from "cheerio"

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url")

  if (!url) {
    return NextResponse.json(
      { error: "Missing url parameter" },
      { status: 400 }
    )
  }

  try {
    const { data } = await axios.get(url)
    const $ = load(data)

    const getMetaTag = (name: string) =>
      $(`meta[name=${name}]`).attr("content") ||
      $(`meta[property="twitter:${name}"]`).attr("content") ||
      $(`meta[property="og:${name}"]`).attr("content")

    return NextResponse.json({
      url,
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
