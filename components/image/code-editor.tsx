"use client"

import { useEffect, useRef } from "react"
import Prism from "prismjs"

import { cn } from "@/lib/utils"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  showLineNumbers?: boolean
  placeholder?: string
}

function highlightToHtml(code: string, language: string) {
  const grammar = Prism.languages[language] ?? Prism.languages.javascript
  try {
    return Prism.highlight(code, grammar, language)
  } catch {
    return escapeHtml(code)
  }
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

export function CodeEditor({
  value,
  onChange,
  language,
  showLineNumbers = false,
  placeholder,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const preRef = useRef<HTMLPreElement>(null)

  const lines = value.split("\n").length

  useEffect(() => {
    if (textareaRef.current && preRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value])

  return (
    <div className="relative w-full font-mono text-sm leading-6">
      {showLineNumbers ? (
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 flex flex-col items-end pr-3 text-right text-white/30 select-none"
          style={{ width: "2.5rem" }}
        >
          {Array.from({ length: lines }).map((_, i) => (
            <span key={i} className="block">
              {i + 1}
            </span>
          ))}
        </div>
      ) : null}

      <pre
        ref={preRef}
        aria-hidden
        className={cn(
          "pointer-events-none m-0 overflow-hidden break-words whitespace-pre-wrap text-transparent",
          showLineNumbers && "pl-10"
        )}
      >
        <code
          className={`language-${language}`}
          dangerouslySetInnerHTML={{
            __html: highlightToHtml(value || " ", language),
          }}
        />
      </pre>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        autoComplete="off"
        className={cn(
          "absolute inset-0 h-full w-full resize-none overflow-hidden border-0 bg-transparent p-0 font-mono text-sm leading-6 break-words whitespace-pre-wrap text-transparent caret-white outline-none placeholder:text-white/40 focus:outline-none",
          showLineNumbers && "pl-10"
        )}
      />
    </div>
  )
}
