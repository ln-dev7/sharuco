"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import * as htmlToImage from "html-to-image"
import { Hash } from "lucide-react"

import { readImageParams } from "@/lib/image-link"
import { cn } from "@/lib/utils"
import { useCodeStyleStore } from "@/store/code-style-store"
import {
  IMAGE_BACKGROUNDS,
  PADDING_OPTIONS,
  type PaddingValue,
} from "@/components/image/backgrounds"
import { AboutDialog } from "@/components/image/about-dialog"
import { CodeFrame } from "@/components/image/code-frame"
import { ExportMenu } from "@/components/image/export-menu"
import { CODE_FONTS, loadGoogleFont } from "@/components/image/fonts"
import { LanguageCombobox } from "@/components/image/language-combobox"
import { ThemeSelect } from "@/components/image/theme-select"
import { useShikiHtml } from "@/components/image/use-shiki"
import {
  SOCIAL_OPTIONS,
  type SocialId,
  type UserInfo,
} from "@/components/image/user-badge"
import {
  WINDOW_CONTROL_OPTIONS,
  type WindowControlStyle,
} from "@/components/image/window-controls"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
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
  const searchParams = useSearchParams()
  const [code, setCode] = useState(SAMPLE_CODE)
  const [language, setLanguage] = useState("typescript")
  const [title, setTitle] = useState("hello.ts")
  const background = useCodeStyleStore((s) => s.backgroundId)
  const setBackground = useCodeStyleStore((s) => s.setBackgroundId)
  const [padding, setPadding] = useState<PaddingValue>(64)
  const [darkCode, setDarkCode] = useState(true)
  const [showLineNumbers, setShowLineNumbers] = useState(false)
  const [showTitleBar, setShowTitleBar] = useState(true)
  const [windowControl, setWindowControl] = useState<WindowControlStyle>("mac")
  const [windowRadius, setWindowRadius] = useState(12)
  const fontId = useCodeStyleStore((s) => s.fontId)
  const setFontId = useCodeStyleStore((s) => s.setFontId)
  const [fontSize, setFontSize] = useState(14)
  const [backdropNoise, setBackdropNoise] = useState(false)
  const [watermarkEnabled, setWatermarkEnabled] = useState(true)
  const [userName, setUserName] = useState("")
  const [userHandle, setUserHandle] = useState("")
  const [userSocial, setUserSocial] = useState<SocialId>("x")
  const [userAvatar, setUserAvatar] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [copied, setCopied] = useState(false)

  const selectedFont = CODE_FONTS.find((f) => f.id === fontId) ?? CODE_FONTS[0]

  useEffect(() => {
    if (selectedFont.google) loadGoogleFont(selectedFont.google)
  }, [selectedFont])

  useEffect(() => {
    if (!searchParams) return
    const params = readImageParams(searchParams)
    if (params.code) setCode(params.code)
    if (params.language) setLanguage(params.language)
    if (params.title) setTitle(params.title)
    if (params.author) setUserName(params.author)
    if (params.authorHandle) setUserHandle(`@${params.authorHandle}`)
    if (params.authorAvatar) setUserAvatar(params.authorAvatar)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const userInfo: UserInfo = {
    name: userName,
    handle: userHandle,
    social: userSocial,
    avatar: userAvatar,
  }

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
        pixelRatio: 3,
        quality: 1,
        skipFonts: false,
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
        pixelRatio: 3,
        quality: 1,
        skipFonts: false,
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
    <section className="container flex flex-col gap-4 py-6 md:py-8">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Create beautiful images of your code
          </h1>
          <p className="max-w-[680px] text-xs text-muted-foreground md:text-sm">
            Pick a theme, tune the padding, and export a clean screenshot of
            your snippet.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AboutDialog />
          <ExportMenu
            onDownload={downloadImage}
            onCopy={copyImage}
            isExporting={isExporting}
            copied={copied}
          />
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr] lg:items-start">
        <aside className="order-2 flex flex-col gap-5 rounded-xl border bg-card p-4 lg:sticky lg:top-20 lg:order-1 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Language
            </Label>
            <LanguageCombobox value={language} onChange={setLanguage} />
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

          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Font
            </Label>
            <Select value={fontId} onValueChange={setFontId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CODE_FONTS.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    <span style={{ fontFamily: f.family }}>{f.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Font size
              </Label>
              <span className="text-xs text-muted-foreground tabular-nums">
                {fontSize}px
              </span>
            </div>
            <Slider
              min={11}
              max={24}
              step={1}
              value={[fontSize]}
              onValueChange={(v) => setFontSize(v[0])}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Window radius
              </Label>
              <span className="text-xs text-muted-foreground tabular-nums">
                {windowRadius}px
              </span>
            </div>
            <Slider
              min={0}
              max={24}
              step={1}
              value={[windowRadius]}
              onValueChange={(v) => setWindowRadius(v[0])}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Window controls
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {WINDOW_CONTROL_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setWindowControl(opt.id)}
                  className={cn(
                    "rounded-md border py-2 text-xs font-medium transition-colors",
                    windowControl === opt.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-accent"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="title-bar" className="text-sm font-medium">
              Title bar
            </Label>
            <Switch
              id="title-bar"
              checked={showTitleBar}
              onCheckedChange={setShowTitleBar}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="backdrop-noise" className="text-sm font-medium">
              Backdrop noise
            </Label>
            <Switch
              id="backdrop-noise"
              checked={backdropNoise}
              onCheckedChange={setBackdropNoise}
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-border/50 pt-4">
            <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              User info
            </Label>
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Name"
            />
            <Input
              value={userHandle}
              onChange={(e) => setUserHandle(e.target.value)}
              placeholder="Handle (e.g. @ln_dev7)"
            />
            <Select
              value={userSocial}
              onValueChange={(v) => setUserSocial(v as SocialId)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOCIAL_OPTIONS.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={userAvatar}
              onChange={(e) => setUserAvatar(e.target.value)}
              placeholder="Avatar URL (optional)"
            />
          </div>

          <div className="flex items-center justify-between border-t border-border/50 pt-4">
            <Label htmlFor="watermark" className="text-sm font-medium">
              Show watermark
            </Label>
            <Switch
              id="watermark"
              checked={watermarkEnabled}
              onCheckedChange={setWatermarkEnabled}
            />
          </div>
        </aside>

        <div className="order-1 flex min-h-[420px] items-start justify-center rounded-xl border bg-muted/40 p-3 sm:p-12 lg:sticky lg:top-20 lg:order-2 lg:max-h-[calc(100vh-6rem)] lg:items-center lg:overflow-auto">
          <div className="w-full max-w-[900px] overflow-hidden rounded-2xl">
            <CodeFrame
              ref={frameRef}
              code={code}
              onCodeChange={setCode}
              title={title}
              onTitleChange={setTitle}
              background={selectedBg.style}
              padding={padding}
              showLineNumbers={showLineNumbers}
              showTitleBar={showTitleBar}
              windowControl={windowControl}
              windowRadius={windowRadius}
              fontFamily={selectedFont.family}
              fontSize={fontSize}
              backdropNoise={backdropNoise}
              surfaceBg={shiki.bg}
              surfaceFg={shiki.fg}
              codeHtml={shiki.html}
              user={userInfo}
              watermark={watermarkEnabled ? "sharuco.lndev.me" : ""}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
