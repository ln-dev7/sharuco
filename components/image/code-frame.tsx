"use client"

import { forwardRef } from "react"

import { cn } from "@/lib/utils"
import { CodeEditor } from "@/components/image/code-editor"

interface CodeFrameProps {
  code: string
  onCodeChange: (code: string) => void
  language: string
  title: string
  onTitleChange: (title: string) => void
  background: string
  padding: number
  showLineNumbers: boolean
  showTrafficLights: boolean
  darkCode: boolean
  watermark?: string
}

export const CodeFrame = forwardRef<HTMLDivElement, CodeFrameProps>(
  function CodeFrame(
    {
      code,
      onCodeChange,
      language,
      title,
      onTitleChange,
      background,
      padding,
      showLineNumbers,
      showTrafficLights,
      darkCode,
      watermark = "sharuco.lndev.me",
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        className="relative flex w-full items-center justify-center"
        style={{
          background,
          padding: `${padding}px`,
        }}
      >
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-lg shadow-2xl",
            darkCode ? "bg-[#0d1117]" : "bg-white"
          )}
          style={{
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.1), 0 10px 30px rgba(0,0,0,0.3), 0 40px 80px rgba(0,0,0,0.25)",
          }}
        >
          <div
            className={cn(
              "flex items-center gap-3 px-4 py-3",
              darkCode ? "bg-[#161b22]" : "bg-zinc-100"
            )}
          >
            {showTrafficLights ? (
              <div className="flex items-center gap-2">
                <span className="block h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="block h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="block h-3 w-3 rounded-full bg-[#28c840]" />
              </div>
            ) : null}

            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Untitled"
              className={cn(
                "flex-1 bg-transparent text-center text-sm font-medium outline-none",
                darkCode
                  ? "text-white/70 placeholder:text-white/30"
                  : "text-zinc-600 placeholder:text-zinc-400"
              )}
              spellCheck={false}
            />

            {showTrafficLights ? <div className="w-[54px]" /> : null}
          </div>

          <div
            className={cn(
              "w-full px-5 pt-5 pb-4",
              darkCode ? "bg-[#0d1117] text-white" : "bg-white text-zinc-900"
            )}
          >
            <CodeEditor
              value={code}
              onChange={onCodeChange}
              language={language}
              showLineNumbers={showLineNumbers}
              placeholder="// Paste or type your code here…"
            />
          </div>
        </div>

        {watermark ? (
          <span
            className="pointer-events-none absolute bottom-2 left-3 text-[10px] font-medium tracking-wide text-white/70 select-none"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
          >
            {watermark}
          </span>
        ) : null}
      </div>
    )
  }
)
