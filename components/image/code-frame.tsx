"use client"

import { forwardRef } from "react"

import { CodeEditor } from "@/components/image/code-editor"

interface CodeFrameProps {
  code: string
  onCodeChange: (code: string) => void
  title: string
  onTitleChange: (title: string) => void
  background: string
  padding: number
  showLineNumbers: boolean
  showTrafficLights: boolean
  surfaceBg: string
  surfaceFg: string
  codeHtml: string
  watermark?: string
}

export const CodeFrame = forwardRef<HTMLDivElement, CodeFrameProps>(
  function CodeFrame(
    {
      code,
      onCodeChange,
      title,
      onTitleChange,
      background,
      padding,
      showLineNumbers,
      showTrafficLights,
      surfaceBg,
      surfaceFg,
      codeHtml,
      watermark = "sharuco.lndev.me",
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        className="relative flex w-full items-center justify-center"
        style={{ background, padding: `${padding}px` }}
      >
        <div
          className="relative w-full overflow-hidden rounded-lg shadow-2xl"
          style={{
            backgroundColor: surfaceBg,
            color: surfaceFg,
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.1), 0 10px 30px rgba(0,0,0,0.3), 0 40px 80px rgba(0,0,0,0.25)",
          }}
        >
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ borderBottom: "1px solid rgba(128,128,128,0.15)" }}
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
              className="flex-1 bg-transparent text-center text-sm font-medium outline-none"
              style={{ color: surfaceFg, opacity: 0.75 }}
              spellCheck={false}
            />

            {showTrafficLights ? <div className="w-[54px]" /> : null}
          </div>

          <div className="w-full px-5 pt-5 pb-4">
            <CodeEditor
              value={code}
              onChange={onCodeChange}
              html={codeHtml}
              fg={surfaceFg}
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
