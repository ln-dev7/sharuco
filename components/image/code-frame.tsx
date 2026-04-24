"use client"

import { forwardRef } from "react"

import { CodeEditor } from "@/components/image/code-editor"
import { UserBadge, type UserInfo } from "@/components/image/user-badge"
import {
  WindowControls,
  type WindowControlStyle,
} from "@/components/image/window-controls"

interface CodeFrameProps {
  code: string
  onCodeChange: (code: string) => void
  title: string
  onTitleChange: (title: string) => void
  background: string
  padding: number
  showLineNumbers: boolean
  showTitleBar: boolean
  windowControl: WindowControlStyle
  windowRadius: number
  fontFamily: string
  fontSize: number
  backdropNoise: boolean
  surfaceBg: string
  surfaceFg: string
  codeHtml: string
  user: UserInfo
  watermark: string
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
      showTitleBar,
      windowControl,
      windowRadius,
      fontFamily,
      fontSize,
      backdropNoise,
      surfaceBg,
      surfaceFg,
      codeHtml,
      user,
      watermark,
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        className="relative flex w-full items-center justify-center"
        style={{ background, padding: `${padding}px` }}
      >
        {backdropNoise ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.35'/></svg>\")",
              mixBlendMode: "overlay",
              opacity: 0.5,
            }}
          />
        ) : null}

        <div
          className="relative w-full overflow-hidden shadow-2xl"
          style={{
            backgroundColor: surfaceBg,
            color: surfaceFg,
            borderRadius: `${windowRadius}px`,
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.08), 0 10px 30px rgba(0,0,0,0.3), 0 40px 80px rgba(0,0,0,0.25)",
          }}
        >
          {showTitleBar ? (
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: "1px solid rgba(128,128,128,0.15)" }}
            >
              <WindowControls style={windowControl} fg={surfaceFg} />

              <input
                type="text"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Untitled"
                className="flex-1 bg-transparent text-center text-sm font-medium outline-none"
                style={{
                  color: surfaceFg,
                  opacity: 0.75,
                  fontFamily,
                }}
                spellCheck={false}
              />

              {windowControl !== "none" ? <div className="w-[54px]" /> : null}
            </div>
          ) : null}

          <div
            className="w-full px-5 pt-5 pb-4"
            style={{ fontFamily, fontSize: `${fontSize}px` }}
          >
            <CodeEditor
              value={code}
              onChange={onCodeChange}
              html={codeHtml}
              fg={surfaceFg}
              showLineNumbers={showLineNumbers}
              placeholder="// Paste or type your code here…"
            />
          </div>

          <UserBadge user={user} fg={surfaceFg} />
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
