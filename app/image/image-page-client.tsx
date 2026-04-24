"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { allLanguages, languagesName } from "@/constants/languages"
import * as htmlToImage from "html-to-image"
import { Check, Clipboard, Copy, Download, Hash, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  IMAGE_BACKGROUNDS,
  PADDING_OPTIONS,
  type PaddingValue,
} from "@/components/image/backgrounds"
import { AboutDialog } from "@/components/image/about-dialog"
import { CodeFrame } from "@/components/image/code-frame"
import { ThemeSelect } from "@/components/image/theme-select"
import { useShikiHtml } from "@/components/image/use-shiki"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const SAMPLE_CODE = `// Press cmd+v / ctrl+v to paste your code here

function greet(name: string) {
  return \`Hello, \${name}!\`
}

greet("World")
`

const LANGUAGE_ALIASES: Record<string, string> = {
  "c++": "cpp",
  "c#": "csharp",
  shell: "bash",
  bash: "bash",
  "objective-c": "objective-c",
  sql: "sql",
  yaml: "yaml",
  markdown: "md",
  text: "plaintext",
  other: "plaintext",
}

function toShikiLang(language: string): string {
  const normalized = language.toLowerCase()
  return LANGUAGE_ALIASES[normalized] ?? normalized
}

export function ImagePageClient() {
  const frameRef = useRef<HTMLDivElement>(null)
  const [code, setCode] = useState(SAMPLE_CODE)
  const [language, setLanguage] = useState("typescript")
  const [title, setTitle] = useState("hello.ts")
  const [background, setBackground] = useState(IMAGE_BACKGROUNDS[0].id)
  const [padding, setPadding] = useState<PaddingValue>(64)
  const [darkCode, setDarkCode] = useState(true)
  const [showLineNumbers, setShowLineNumbers] = useState(false)
  const [showTrafficLights, setShowTrafficLights] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [copied, setCopied] = useState(false)

  const selectedBg =
    IMAGE_BACKGROUNDS.find((b) => b.id === background) ?? IMAGE_BACKGROUNDS[0]
  const shikiTheme = darkCode ? selectedBg.shikiDark : selectedBg.shikiLight
  const shikiLang = toShikiLang(language)
  const shiki = useShikiHtml(code, shikiLang, shikiTheme)

  const downloadImage = useCallback(async () => {
    if (!frameRef.current) return
    setIsExporting(true)
    try {
      const dataUrl = await htmlToImage.toPng(frameRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      })
      const link = document.createElement("a")
      link.download = `${title || "sharuco"}.png`
      link.href = dataUrl
      link.click()
    } finally {
      setIsExporting(false)
    }
  }, [title])

  const copyImage = useCallback(async () => {
    if (!frameRef.current) return
    try {
      const blob = await htmlToImage.toBlob(frameRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      })
      if (!blob) return
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (error) {
      console.error(error)
    }
  }, [])

  const pasteFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) setCode(text)
    } catch {
      // user might block clipboard read
    }
  }, [])

  const cycleTheme = useCallback(() => {
    setBackground((current) => {
      const idx = IMAGE_BACKGROUNDS.findIndex((b) => b.id === current)
      const next = IMAGE_BACKGROUNDS[(idx + 1) % IMAGE_BACKGROUNDS.length]
      return next.id
    })
  }, [])

  const cyclePadding = useCallback(() => {
    setPadding((current) => {
      const idx = PADDING_OPTIONS.findIndex((p) => p.value === current)
      const next = PADDING_OPTIONS[(idx + 1) % PADDING_OPTIONS.length]
      return next.value
    })
  }, [])

  const focusEditor = useCallback(() => {
    const el = document.querySelector<HTMLTextAreaElement>("[data-code-editor]")
    el?.focus()
  }, [])

  const blurActive = useCallback(() => {
    const active = document.activeElement as HTMLElement | null
    active?.blur()
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const isInInput =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable === true
      const isMeta = e.metaKey || e.ctrlKey

      if (e.key === "Escape") {
        blurActive()
        return
      }

      if (isMeta && (e.key === "s" || e.key === "S")) {
        e.preventDefault()
        downloadImage()
        return
      }

      if (isMeta && (e.key === "c" || e.key === "C")) {
        const selection = window.getSelection()?.toString()
        if (!isInInput && !selection) {
          e.preventDefault()
          copyImage()
        }
        return
      }

      if (isMeta && (e.key === "v" || e.key === "V")) {
        if (!isInInput) {
          e.preventDefault()
          pasteFromClipboard()
        }
        return
      }

      if (isInInput || isMeta || e.altKey) return

      switch (e.key.toLowerCase()) {
        case "f":
          e.preventDefault()
          focusEditor()
          break
        case "c":
          e.preventDefault()
          cycleTheme()
          break
        case "d":
          e.preventDefault()
          setDarkCode((v) => !v)
          break
        case "n":
          e.preventDefault()
          setShowLineNumbers((v) => !v)
          break
        case "p":
          e.preventDefault()
          cyclePadding()
          break
        case "l":
          e.preventDefault()
          document
            .querySelector<HTMLButtonElement>("[data-language-trigger]")
            ?.click()
          break
      }
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [
    blurActive,
    copyImage,
    cyclePadding,
    cycleTheme,
    downloadImage,
    focusEditor,
    pasteFromClipboard,
  ])

  return (
    <section className="container flex flex-col gap-6 py-8 md:py-12">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Create beautiful images of your code
          </h1>
          <p className="max-w-[720px] text-sm text-muted-foreground md:text-base">
            Pick a theme, tune the padding, and export a clean screenshot of
            your snippet. Paste code with{" "}
            <kbd className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-medium">
              ⌘V
            </kbd>{" "}
            /{" "}
            <kbd className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-medium">
              Ctrl V
            </kbd>
            .
          </p>
        </div>
        <AboutDialog />
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="flex min-h-[520px] items-center justify-center rounded-xl border bg-muted/40 p-4">
          <div className="w-full max-w-[900px]">
            <CodeFrame
              ref={frameRef}
              code={code}
              onCodeChange={setCode}
              title={title}
              onTitleChange={setTitle}
              background={selectedBg.style}
              padding={padding}
              showLineNumbers={showLineNumbers}
              showTrafficLights={showTrafficLights}
              surfaceBg={shiki.bg}
              surfaceFg={shiki.fg}
              codeHtml={shiki.html}
            />
          </div>
        </div>

        <aside className="flex flex-col gap-6 rounded-xl border p-5">
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Language
            </Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger data-language-trigger="">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Languages</SelectLabel>
                  {allLanguages.map((lang) => (
                    <SelectItem key={lang.name} value={lang.name.toLowerCase()}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Theme
            </Label>
            <ThemeSelect value={background} onChange={setBackground} />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Padding
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {PADDING_OPTIONS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPadding(p.value)}
                  className={cn(
                    "rounded-md border py-2 text-xs font-medium transition-colors",
                    padding === p.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-accent"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label
              htmlFor="dark-code"
              className="flex items-center gap-2 text-sm font-medium"
            >
              Dark code
            </Label>
            <Switch
              id="dark-code"
              checked={darkCode}
              onCheckedChange={setDarkCode}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label
              htmlFor="line-numbers"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Hash className="h-4 w-4" />
              Line numbers
            </Label>
            <Switch
              id="line-numbers"
              checked={showLineNumbers}
              onCheckedChange={setShowLineNumbers}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="traffic-lights" className="text-sm font-medium">
              Traffic lights
            </Label>
            <Switch
              id="traffic-lights"
              checked={showTrafficLights}
              onCheckedChange={setShowTrafficLights}
            />
          </div>

          <div className="mt-auto flex flex-col gap-2">
            <Button
              onClick={pasteFromClipboard}
              variant="outline"
              className="w-full"
            >
              <Clipboard className="mr-2 h-4 w-4" />
              Paste from clipboard
            </Button>
            <Button onClick={copyImage} variant="outline" className="w-full">
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" /> Copy image
                </>
              )}
            </Button>
            <Button
              onClick={downloadImage}
              disabled={isExporting}
              className="w-full"
            >
              {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Download PNG
            </Button>
          </div>
        </aside>
      </div>
    </section>
  )
}
