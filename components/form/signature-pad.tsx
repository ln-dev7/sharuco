"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

const FONTS = [
  { name: "Dancing Script", family: "'Dancing Script'", google: "Dancing+Script:wght@600" },
  { name: "Pacifico", family: "'Pacifico'", google: "Pacifico" },
  { name: "Caveat", family: "'Caveat'", google: "Caveat:wght@600" },
  { name: "Great Vibes", family: "'Great Vibes'", google: "Great+Vibes" },
  { name: "Satisfy", family: "'Satisfy'", google: "Satisfy" },
]

// Inject the Google Fonts stylesheet once
function loadSignatureFonts() {
  if (typeof document === "undefined") return
  const id = "sharuco-signature-fonts"
  if (document.getElementById(id)) return
  const link = document.createElement("link")
  link.id = id
  link.rel = "stylesheet"
  link.href = `https://fonts.googleapis.com/css2?${FONTS.map(
    (f) => `family=${f.google}`
  ).join("&")}&display=swap`
  document.head.appendChild(link)
}

/**
 * Typed signature: the respondent types their name and picks a handwriting
 * font. The result is rendered to a PNG data URL so it displays consistently
 * everywhere (responses, exports).
 */
export default function SignaturePad({
  onChange,
}: {
  onChange?: (value: string) => void
}) {
  const [typedName, setTypedName] = useState("")
  const [fontIndex, setFontIndex] = useState(0)

  useEffect(() => {
    loadSignatureFonts()
  }, [])

  const render = async (name: string, family: string) => {
    if (!name.trim()) {
      onChange?.("")
      return
    }
    try {
      await document.fonts.load(`52px ${family}`)
    } catch {
      // ignore — fall back to whatever is available
    }
    const canvas = document.createElement("canvas")
    canvas.width = 600
    canvas.height = 150
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#111827"
    ctx.textBaseline = "middle"
    ctx.font = `52px ${family}`
    ctx.fillText(name, 20, canvas.height / 2)
    onChange?.(canvas.toDataURL("image/png"))
  }

  const update = (name: string, idx: number) => {
    setTypedName(name)
    setFontIndex(idx)
    render(name, FONTS[idx].family)
  }

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <Input
        placeholder="Type your name"
        value={typedName}
        onChange={(e) => update(e.target.value, fontIndex)}
      />
      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
        {FONTS.map((f, idx) => (
          <button
            key={f.name}
            type="button"
            onClick={() => update(typedName, idx)}
            className={cn(
              "flex h-14 items-center justify-center rounded-md border bg-white px-3 dark:bg-zinc-900",
              fontIndex === idx
                ? "border-zinc-900 ring-1 ring-zinc-900 dark:border-zinc-100 dark:ring-zinc-100"
                : "border-zinc-200 dark:border-zinc-700"
            )}
            style={{ fontFamily: `${f.family}, cursive` }}
            title={f.name}
          >
            <span className="truncate text-2xl text-zinc-900 dark:text-zinc-100">
              {typedName || "Your name"}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
