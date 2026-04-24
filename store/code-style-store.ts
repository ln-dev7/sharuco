import { create } from "zustand"
import { persist } from "zustand/middleware"

export const CARD_SHIKI_THEMES: Array<{ id: string; name: string }> = [
  { id: "tokyo-night", name: "Tokyo Night" },
  { id: "one-dark-pro", name: "One Dark Pro" },
  { id: "github-dark-default", name: "GitHub Dark" },
  { id: "github-light-default", name: "GitHub Light" },
  { id: "dracula", name: "Dracula" },
  { id: "monokai", name: "Monokai" },
  { id: "nord", name: "Nord" },
  { id: "catppuccin-mocha", name: "Catppuccin Mocha" },
  { id: "catppuccin-latte", name: "Catppuccin Latte" },
  { id: "rose-pine", name: "Rose Pine" },
  { id: "synthwave-84", name: "Synthwave 84" },
  { id: "material-theme-palenight", name: "Material Palenight" },
  { id: "vitesse-dark", name: "Vitesse Dark" },
  { id: "vesper", name: "Vesper" },
  { id: "ayu-dark", name: "Ayu Dark" },
  { id: "poimandres", name: "Poimandres" },
  { id: "night-owl", name: "Night Owl" },
  { id: "min-light", name: "Min Light" },
  { id: "solarized-light", name: "Solarized Light" },
  { id: "slack-ochin", name: "Slack Ochin" },
]

interface CodeStyleStore {
  shikiTheme: string
  fontId: string
  setShikiTheme: (shikiTheme: string) => void
  setFontId: (fontId: string) => void
}

export const useCodeStyleStore = create<CodeStyleStore>()(
  persist(
    (set) => ({
      shikiTheme: "tokyo-night",
      fontId: "jetbrains-mono",
      setShikiTheme: (shikiTheme) => set({ shikiTheme }),
      setFontId: (fontId) => set({ fontId }),
    }),
    { name: "sharuco-code-style" }
  )
)
