import { Minus, Square, X } from "lucide-react"

export type WindowControlStyle = "mac" | "mac-outline" | "windows" | "none"

export const WINDOW_CONTROL_OPTIONS: Array<{
  id: WindowControlStyle
  label: string
}> = [
  { id: "mac", label: "Mac" },
  { id: "mac-outline", label: "Outline" },
  { id: "windows", label: "Windows" },
  { id: "none", label: "None" },
]

export function WindowControls({
  style,
  fg = "#ffffff",
}: {
  style: WindowControlStyle
  fg?: string
}) {
  if (style === "none") return null

  if (style === "mac") {
    return (
      <div className="flex items-center gap-2">
        <span className="block h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="block h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="block h-3 w-3 rounded-full bg-[#28c840]" />
      </div>
    )
  }

  if (style === "mac-outline") {
    return (
      <div className="flex items-center gap-2">
        <span
          className="block h-3 w-3 rounded-full border"
          style={{ borderColor: "#ff5f57" }}
        />
        <span
          className="block h-3 w-3 rounded-full border"
          style={{ borderColor: "#febc2e" }}
        />
        <span
          className="block h-3 w-3 rounded-full border"
          style={{ borderColor: "#28c840" }}
        />
      </div>
    )
  }

  return (
    <div
      className="flex items-center gap-3"
      style={{ color: fg, opacity: 0.7 }}
    >
      <Minus className="h-3.5 w-3.5" strokeWidth={2} />
      <Square className="h-3 w-3" strokeWidth={2} />
      <X className="h-3.5 w-3.5" strokeWidth={2.5} />
    </div>
  )
}
