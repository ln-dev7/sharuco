"use client"

import { useEffect, useRef, useState } from "react"
import { Eraser } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type SignatureMode = "draw" | "type"

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

export default function SignaturePad({
  onChange,
}: {
  onChange?: (value: string, meta?: { mode: SignatureMode }) => void
}) {
  // ---------- draw mode ----------
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const drawing = useRef(false)
  const [hasDrawn, setHasDrawn] = useState(false)

  // ---------- type mode ----------
  const [typedName, setTypedName] = useState("")
  const [fontIndex, setFontIndex] = useState(0)

  useEffect(() => {
    loadSignatureFonts()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const ratio = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * ratio
    canvas.height = rect.height * ratio
    ctx.scale(ratio, ratio)
    ctx.lineWidth = 2.5
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = "#111827"
  }, [])

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    drawing.current = true
    const { x, y } = getPos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ;(e.target as HTMLCanvasElement).setPointerCapture(e.pointerId)
  }

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    const { x, y } = getPos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
    if (!hasDrawn) setHasDrawn(true)
  }

  const end = () => {
    if (!drawing.current) return
    drawing.current = false
    const canvas = canvasRef.current
    if (canvas && onChange)
      onChange(canvas.toDataURL("image/png"), { mode: "draw" })
  }

  const clearDraw = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setHasDrawn(false)
      onChange?.("", { mode: "draw" })
    }
  }

  // Render the typed name (in the chosen font) to a PNG data URL
  const renderTyped = async (name: string, family: string) => {
    if (!name.trim()) {
      onChange?.("", { mode: "type" })
      return
    }
    try {
      await document.fonts.load(`48px ${family}`)
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
    onChange?.(canvas.toDataURL("image/png"), { mode: "type" })
  }

  const onTypedChange = (name: string, idx: number) => {
    setTypedName(name)
    setFontIndex(idx)
    renderTyped(name, FONTS[idx].family)
  }

  return (
    <Tabs
      defaultValue="draw"
      className="w-full"
      onValueChange={(v) => {
        // re-emit the value for the active mode so the answer matches the tab
        if (v === "draw") {
          const canvas = canvasRef.current
          onChange?.(hasDrawn && canvas ? canvas.toDataURL("image/png") : "", {
            mode: "draw",
          })
        } else {
          renderTyped(typedName, FONTS[fontIndex].family)
        }
      }}
    >
      <TabsList>
        <TabsTrigger value="draw">Draw</TabsTrigger>
        <TabsTrigger value="type">Type</TabsTrigger>
      </TabsList>

      <TabsContent value="draw" className="mt-3">
        <div className="flex w-full flex-col items-start gap-2">
          <canvas
            ref={canvasRef}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerLeave={end}
            className="h-40 w-full touch-none rounded-md border border-dashed border-zinc-300 bg-white dark:border-zinc-700"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearDraw}
            disabled={!hasDrawn}
          >
            <Eraser className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="type" className="mt-3">
        <div className="flex w-full flex-col items-start gap-3">
          <Input
            placeholder="Type your name"
            value={typedName}
            onChange={(e) => onTypedChange(e.target.value, fontIndex)}
          />
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
            {FONTS.map((f, idx) => (
              <button
                key={f.name}
                type="button"
                onClick={() => onTypedChange(typedName, idx)}
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
      </TabsContent>
    </Tabs>
  )
}
