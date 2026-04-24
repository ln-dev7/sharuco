"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  html?: string
  caretColor?: string
  fg?: string
  showLineNumbers?: boolean
  placeholder?: string
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

export function CodeEditor({
  value,
  onChange,
  html,
  caretColor,
  fg,
  showLineNumbers = false,
  placeholder,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const lines = value.split("\n").length
  const safeHtml = html && value.length > 0 ? html : escapeHtml(value || " ")

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value])

  return (
    <div
      className="relative w-full max-w-full overflow-hidden leading-6"
      style={{ color: fg, fontFamily: "inherit", fontSize: "inherit" }}
    >
      {showLineNumbers ? (
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 flex flex-col items-end pr-3 text-right select-none"
          style={{ width: "2.5rem", color: fg, opacity: 0.4 }}
        >
          {Array.from({ length: lines }).map((_, i) => (
            <span key={i} className="block">
              {i + 1}
            </span>
          ))}
        </div>
      ) : null}

      <pre
        aria-hidden
        className={cn(
          "pointer-events-none m-0 w-full max-w-full overflow-hidden break-all whitespace-pre-wrap",
          showLineNumbers && "pl-10"
        )}
        style={{
          fontFamily: "inherit",
          fontSize: "inherit",
          wordBreak: "break-word",
          overflowWrap: "anywhere",
        }}
      >
        <code
          className="shiki-output"
          style={{ fontFamily: "inherit", fontSize: "inherit" }}
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      </pre>

      <textarea
        ref={textareaRef}
        data-code-editor=""
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        autoComplete="off"
        className={cn(
          "absolute inset-0 h-full w-full max-w-full resize-none overflow-hidden border-0 bg-transparent p-0 leading-6 break-all whitespace-pre-wrap text-transparent outline-none focus:outline-none",
          showLineNumbers && "pl-10"
        )}
        style={{
          caretColor: caretColor ?? fg ?? "#ffffff",
          fontFamily: "inherit",
          fontSize: "inherit",
          wordBreak: "break-word",
          overflowWrap: "anywhere",
        }}
      />
    </div>
  )
}
