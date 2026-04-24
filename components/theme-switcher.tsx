"use client"

import { Paintbrush, Check, Search } from "lucide-react"
import { useState } from "react"

import { useUiSounds } from "@/hooks/use-ui-sounds"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  COLOR_THEMES,
  useColorThemeStore,
  type ColorTheme,
} from "@/store/color-theme-store"
import { useCodeStyleStore } from "@/store/code-style-store"
import { cn } from "@/lib/utils"
import { CODE_FONTS, loadGoogleFont } from "@/components/image/fonts"
import { ThemeSelect } from "@/components/image/theme-select"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect } from "react"

const DARK_PREVIEWS: Record<
  ColorTheme,
  {
    bg: string
    primary: string
    chart1: string
    chart2: string
    sidebar: string
  }
> = {
  default: {
    bg: "#1a1b24",
    primary: "#4f7fe0",
    chart1: "#e58f18",
    chart2: "#0cb4d4",
    sidebar: "#1e1f2c",
  },
  claude: {
    bg: "#2a2520",
    primary: "#c87840",
    chart1: "#c87840",
    chart2: "#9b6ee8",
    sidebar: "#221e1a",
  },
  twitter: {
    bg: "#000000",
    primary: "#1da1f2",
    chart1: "#1da1f2",
    chart2: "#19cf86",
    sidebar: "#1e2535",
  },
  violet: {
    bg: "#1c1c2e",
    primary: "#9860f0",
    chart1: "#40c98c",
    chart2: "#9860f0",
    sidebar: "#17172a",
  },
  supabase: {
    bg: "#111214",
    primary: "#3ecf8e",
    chart1: "#3ecf8e",
    chart2: "#6231b5",
    sidebar: "#111214",
  },
  tangerine: {
    bg: "#1f2540",
    primary: "#e07030",
    chart1: "#8ba0cc",
    chart2: "#e07030",
    sidebar: "#252c48",
  },
  darkmatter: {
    bg: "#1c1b20",
    primary: "#d4922e",
    chart1: "#4aacbf",
    chart2: "#d4922e",
    sidebar: "#171618",
  },
  doom64: {
    bg: "#383838",
    primary: "#c04830",
    chart1: "#68c040",
    chart2: "#4878c0",
    sidebar: "#303030",
  },
  "modern-minimal": {
    bg: "#171717",
    primary: "#3b82f6",
    chart1: "#60a5fa",
    chart2: "#3b82f6",
    sidebar: "#171717",
  },
  "t3-chat": {
    bg: "#221d27",
    primary: "#a3004c",
    chart1: "#a84370",
    chart2: "#934dcb",
    sidebar: "#181117",
  },
  "mocha-mousse": {
    bg: "#2d2521",
    primary: "#C39E88",
    chart1: "#C39E88",
    chart2: "#BAAB92",
    sidebar: "#1f1a17",
  },
  bubblegum: {
    bg: "#12242e",
    primary: "#fbe2a7",
    chart1: "#50afb6",
    chart2: "#e4a2b1",
    sidebar: "#101f28",
  },
  "amethyst-haze": {
    bg: "#1a1823",
    primary: "#a995c9",
    chart1: "#a995c9",
    chart2: "#f2b8c6",
    sidebar: "#16141e",
  },
  notebook: {
    bg: "#2b2b2b",
    primary: "#b0b0b0",
    chart1: "#efefef",
    chart2: "#d0d0d0",
    sidebar: "#212121",
  },
  catppuccin: {
    bg: "#181825",
    primary: "#cba6f7",
    chart1: "#cba6f7",
    chart2: "#89dceb",
    sidebar: "#11111b",
  },
  graphite: {
    bg: "#1a1a1a",
    primary: "#a0a0a0",
    chart1: "#a0a0a0",
    chart2: "#7e9ca0",
    sidebar: "#1f1f1f",
  },
  perpetuity: {
    bg: "#0a1a20",
    primary: "#4de8e8",
    chart1: "#4de8e8",
    chart2: "#36a5a5",
    sidebar: "#0a1a20",
  },
  "kodama-grove": {
    bg: "#3a3529",
    primary: "#8a9f7b",
    chart1: "#8a9f7b",
    chart2: "#9db18c",
    sidebar: "#3a3529",
  },
  "cosmic-night": {
    bg: "#0f0f1a",
    primary: "#a48fff",
    chart1: "#a48fff",
    chart2: "#7986cb",
    sidebar: "#1a1a2e",
  },
  "quantum-rose": {
    bg: "#1a0922",
    primary: "#ff6bef",
    chart1: "#ff6bef",
    chart2: "#c359e3",
    sidebar: "#1c0d25",
  },
  nature: {
    bg: "#1c2a1f",
    primary: "#4caf50",
    chart1: "#81c784",
    chart2: "#66bb6a",
    sidebar: "#1c2a1f",
  },
  "bold-tech": {
    bg: "#0f172a",
    primary: "#8b5cf6",
    chart1: "#a78bfa",
    chart2: "#8b5cf6",
    sidebar: "#0f172a",
  },
  "elegant-luxury": {
    bg: "#1c1917",
    primary: "#b91c1c",
    chart1: "#f87171",
    chart2: "#ef4444",
    sidebar: "#1c1917",
  },
  "amber-minimal": {
    bg: "#171717",
    primary: "#f59e0b",
    chart1: "#fbbf24",
    chart2: "#d97706",
    sidebar: "#0f0f0f",
  },
  "neo-brutalism": {
    bg: "#000000",
    primary: "#ff6666",
    chart1: "#ff6666",
    chart2: "#ffff33",
    sidebar: "#000000",
  },
  "solar-dusk": {
    bg: "#1C1917",
    primary: "#F97316",
    chart1: "#F97316",
    chart2: "#0EA5E9",
    sidebar: "#292524",
  },
  claymorphism: {
    bg: "#1e1b18",
    primary: "#818cf8",
    chart1: "#818cf8",
    chart2: "#6366f1",
    sidebar: "#3a3633",
  },
  cyberpunk: {
    bg: "#0c0c1d",
    primary: "#ff00c8",
    chart1: "#ff00c8",
    chart2: "#9000ff",
    sidebar: "#0c0c1d",
  },
  "pastel-dreams": {
    bg: "#1c1917",
    primary: "#c0aafd",
    chart1: "#c0aafd",
    chart2: "#a78bfa",
    sidebar: "#3f324a",
  },
  "clean-slate": {
    bg: "#0f172a",
    primary: "#818cf8",
    chart1: "#818cf8",
    chart2: "#6366f1",
    sidebar: "#1e293b",
  },
  caffeine: {
    bg: "#111111",
    primary: "#ffe0c2",
    chart1: "#ffe0c2",
    chart2: "#393028",
    sidebar: "#18181b",
  },
  "ocean-breeze": {
    bg: "#0f172a",
    primary: "#34d399",
    chart1: "#34d399",
    chart2: "#2dd4bf",
    sidebar: "#1e293b",
  },
  "retro-arcade": {
    bg: "#002b36",
    primary: "#d33682",
    chart1: "#268bd2",
    chart2: "#2aa198",
    sidebar: "#002b36",
  },
  "midnight-bloom": {
    bg: "#1a1d23",
    primary: "#6c5ce7",
    chart1: "#6c5ce7",
    chart2: "#8e44ad",
    sidebar: "#1a1d23",
  },
  candyland: {
    bg: "#1a1d23",
    primary: "#ff99cc",
    chart1: "#ff99cc",
    chart2: "#33cc33",
    sidebar: "#1a1d23",
  },
  "northern-lights": {
    bg: "#1a1d23",
    primary: "#34a85a",
    chart1: "#34a85a",
    chart2: "#4682b4",
    sidebar: "#1a1d23",
  },
  "vintage-paper": {
    bg: "#2d2621",
    primary: "#c0a080",
    chart1: "#c0a080",
    chart2: "#b3906f",
    sidebar: "#2d2621",
  },
  "sunset-horizon": {
    bg: "#2a2024",
    primary: "#ff7e5f",
    chart1: "#ff7e5f",
    chart2: "#feb47b",
    sidebar: "#2a2024",
  },
  "starry-night": {
    bg: "#181a24",
    primary: "#3a5ba0",
    chart1: "#3a5ba0",
    chart2: "#ffe066",
    sidebar: "#23243a",
  },
  vercel: {
    bg: "#000000",
    primary: "#ffffff",
    chart1: "#d97706",
    chart2: "#6366f1",
    sidebar: "#18181b",
  },
  mono: {
    bg: "#0a0a0a",
    primary: "#737373",
    chart1: "#737373",
    chart2: "#737373",
    sidebar: "#171717",
  },
  "soft-pop": {
    bg: "#000000",
    primary: "#818cf8",
    chart1: "#818cf8",
    chart2: "#2dd4bf",
    sidebar: "#000000",
  },
  "sage-garden": {
    bg: "#0a0a0a",
    primary: "#7c9082",
    chart1: "#7c9082",
    chart2: "#a0aa88",
    sidebar: "#0f0f0f",
  },
}

export function ThemeSwitcher() {
  const { colorTheme, setColorTheme } = useColorThemeStore()
  const { resolvedTheme } = useTheme()
  const { playClick, playPop } = useUiSounds()

  const isDark = resolvedTheme === "dark"
  const [search, setSearch] = useState("")
  const backgroundId = useCodeStyleStore((s) => s.backgroundId)
  const setBackgroundId = useCodeStyleStore((s) => s.setBackgroundId)
  const fontId = useCodeStyleStore((s) => s.fontId)
  const setFontId = useCodeStyleStore((s) => s.setFontId)

  useEffect(() => {
    const font = CODE_FONTS.find((f) => f.id === fontId)
    if (font?.google) loadGoogleFont(font.google)
  }, [fontId])

  const filteredThemes = COLOR_THEMES.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => playPop()}
        >
          <Paintbrush className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent position="right" className="flex w-80 flex-col p-0">
        <SheetHeader className="border-b px-5 pt-5 pb-3">
          <SheetTitle className="text-sm font-semibold">Appearance</SheetTitle>
          <p className="-mt-1 text-xs text-muted-foreground">
            Choose a color theme for the interface
          </p>
          <div className="relative mt-2">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search themes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-3 border-b px-5 py-4 pt-0">
          <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Code cards
          </p>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-muted-foreground">Theme</label>
            <ThemeSelect value={backgroundId} onChange={setBackgroundId} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-muted-foreground">Font</label>
            <Select value={fontId} onValueChange={setFontId}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CODE_FONTS.map((f) => (
                  <SelectItem key={f.id} value={f.id} className="text-xs">
                    <span style={{ fontFamily: f.family }}>{f.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-0">
          {filteredThemes.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">
              No themes found
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredThemes.map((theme) => {
                const preview = isDark ? DARK_PREVIEWS[theme.id] : theme.preview
                const isSelected = colorTheme === theme.id

                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      playClick()
                      setColorTheme(theme.id)
                    }}
                    className={cn(
                      "relative flex flex-col gap-2 rounded-xl border-2 p-3 text-left transition-all hover:border-primary/50",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-accent/30"
                    )}
                  >
                    <div
                      className="relative h-16 w-full overflow-hidden rounded-lg"
                      style={{ background: preview.bg }}
                    >
                      <div
                        className="absolute top-2 left-2 h-6 w-6 rounded-md shadow-sm"
                        style={{ background: preview.sidebar }}
                      />
                      <div
                        className="absolute top-2 left-10 h-2 w-12 rounded-full"
                        style={{ background: preview.primary, opacity: 0.9 }}
                      />
                      <div
                        className="absolute top-6 left-10 h-1.5 w-8 rounded-full"
                        style={{ background: preview.chart1, opacity: 0.6 }}
                      />
                      <div className="absolute right-2 bottom-2 left-2 flex gap-1">
                        {[preview.primary, preview.chart1, preview.chart2].map(
                          (c, i) => (
                            <div
                              key={i}
                              className="h-2 flex-1 rounded-full"
                              style={{ background: c, opacity: 0.75 }}
                            />
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs leading-none font-semibold">
                        {theme.name}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-[10px] leading-tight text-muted-foreground">
                        {theme.description}
                      </p>
                    </div>

                    {isSelected && (
                      <span className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                        <Check className="size-3" />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="space-y-1 border-t px-5 py-4">
          <p className="text-sm text-muted-foreground">
            Theme by{" "}
            <a
              href="https://tweakcn.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary"
            >
              TweakCN
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            Theme preference is saved locally in your browser.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
