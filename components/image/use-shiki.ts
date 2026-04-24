"use client"

import { useEffect, useState } from "react"
import type { Highlighter } from "shiki"

export interface ShikiResult {
  html: string
  bg: string
  fg: string
  ready: boolean
}

const DEFAULT: ShikiResult = {
  html: "",
  bg: "#0d1117",
  fg: "#c9d1d9",
  ready: false,
}

let highlighterPromise: Promise<Highlighter> | null = null

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const { createHighlighter } = await import("shiki")
      return createHighlighter({ themes: [], langs: [] })
    })()
  }
  return highlighterPromise
}

async function ensureTheme(h: Highlighter, theme: string): Promise<boolean> {
  if (h.getLoadedThemes().includes(theme)) return true
  try {
    await h.loadTheme(theme as Parameters<typeof h.loadTheme>[0])
    return true
  } catch {
    return false
  }
}

async function ensureLang(h: Highlighter, lang: string): Promise<string> {
  if (h.getLoadedLanguages().includes(lang)) return lang
  try {
    await h.loadLanguage(lang as Parameters<typeof h.loadLanguage>[0])
    return lang
  } catch {
    return "plaintext"
  }
}

export function useShikiHtml(
  code: string,
  lang: string,
  theme: string
): ShikiResult {
  const [result, setResult] = useState<ShikiResult>(DEFAULT)

  useEffect(() => {
    let cancelled = false

    async function run() {
      try {
        const h = await getHighlighter()
        const [themeOk, finalLang] = await Promise.all([
          ensureTheme(h, theme),
          ensureLang(h, lang),
        ])
        if (cancelled || !themeOk) return

        const html = h.codeToHtml(code, { lang: finalLang, theme })
        const styleMatch = html.match(/<pre[^>]*style="([^"]+)"/)
        const style = styleMatch?.[1] ?? ""
        const bgMatch = style.match(/background-color\s*:\s*([^;]+)/)
        const fgMatch = style.match(/(?:^|;|\s)color\s*:\s*([^;]+)/)
        const codeMatch = html.match(/<code[^>]*>([\s\S]*)<\/code>/)
        const inner = codeMatch?.[1] ?? escapeHtml(code)

        if (cancelled) return
        setResult({
          html: inner,
          bg: bgMatch?.[1].trim() ?? "#0d1117",
          fg: fgMatch?.[1].trim() ?? "#c9d1d9",
          ready: true,
        })
      } catch {
        // keep previous result
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [code, lang, theme])

  return result
}
