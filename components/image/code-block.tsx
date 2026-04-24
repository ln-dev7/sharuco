"use client"

import { useEffect } from "react"
import indentCode from "@/utils/indentCode"

import { cn } from "@/lib/utils"
import { CODE_FONTS, loadGoogleFont } from "@/components/image/fonts"
import { useShikiHtml } from "@/components/image/use-shiki"
import { useCodeStyleStore } from "@/store/code-style-store"

const LANGUAGE_ALIASES: Record<string, string> = {
  "c++": "cpp",
  "c#": "csharp",
  shell: "bash",
  bash: "bash",
  "objective-c": "objective-c",
  markdown: "md",
  text: "plaintext",
  other: "plaintext",
}

function toShikiLang(language: string): string {
  const normalized = (language ?? "").toLowerCase()
  return LANGUAGE_ALIASES[normalized] ?? normalized
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

interface CodeBlockProps {
  code: string
  language: string
  /** The code from Firebase is linearised ("\\n" escapes). Pass false to skip indentCode(). */
  preformatted?: boolean
  className?: string
}

export function CodeBlock({
  code,
  language,
  preformatted = false,
  className,
}: CodeBlockProps) {
  const { shikiTheme, fontId } = useCodeStyleStore()
  const font = CODE_FONTS.find((f) => f.id === fontId) ?? CODE_FONTS[0]

  useEffect(() => {
    if (font.google) loadGoogleFont(font.google)
  }, [font])

  const source = preformatted ? code : indentCode(code)
  const shiki = useShikiHtml(source, toShikiLang(language), shikiTheme)
  const inner = shiki.html || escapeHtml(source)

  return (
    <pre
      className={cn(
        "m-0 overflow-auto p-4 text-sm leading-6 break-words whitespace-pre-wrap",
        className
      )}
      style={{
        backgroundColor: shiki.bg,
        color: shiki.fg,
        fontFamily: font.family,
      }}
    >
      <code
        style={{ fontFamily: "inherit", fontSize: "inherit" }}
        dangerouslySetInnerHTML={{ __html: inner }}
      />
    </pre>
  )
}
