import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ColorTheme =
  | "default"
  | "claude"
  | "twitter"
  | "violet"
  | "supabase"
  | "tangerine"
  | "darkmatter"
  | "doom64"
  | "modern-minimal"
  | "t3-chat"
  | "mocha-mousse"
  | "bubblegum"
  | "amethyst-haze"
  | "notebook"
  | "catppuccin"
  | "graphite"
  | "perpetuity"
  | "kodama-grove"
  | "cosmic-night"
  | "quantum-rose"
  | "nature"
  | "bold-tech"
  | "elegant-luxury"
  | "amber-minimal"
  | "neo-brutalism"
  | "solar-dusk"
  | "claymorphism"
  | "cyberpunk"
  | "pastel-dreams"
  | "clean-slate"
  | "caffeine"
  | "ocean-breeze"
  | "retro-arcade"
  | "midnight-bloom"
  | "candyland"
  | "northern-lights"
  | "vintage-paper"
  | "sunset-horizon"
  | "starry-night"
  | "vercel"
  | "mono"
  | "soft-pop"
  | "sage-garden"

export interface ThemeDef {
  id: ColorTheme
  name: string
  description: string
  preview: {
    bg: string
    primary: string
    chart1: string
    chart2: string
    sidebar: string
  }
}

export const COLOR_THEMES: ThemeDef[] = [
  {
    id: "default",
    name: "Default",
    description: "Zinc neutral with blue accents",
    preview: {
      bg: "#f9f9fb",
      primary: "#2a3556",
      chart1: "#d97706",
      chart2: "#0891b2",
      sidebar: "#f3f3f6",
    },
  },
  {
    id: "claude",
    name: "Claude",
    description: "Warm amber tones",
    preview: {
      bg: "#f7f0e5",
      primary: "#b85f10",
      chart1: "#c25510",
      chart2: "#7c3aed",
      sidebar: "#f0e8d8",
    },
  },
  {
    id: "twitter",
    name: "Twitter",
    description: "Clean sky blue interface",
    preview: {
      bg: "#ffffff",
      primary: "#1da1f2",
      chart1: "#1da1f2",
      chart2: "#19cf86",
      sidebar: "#f7f9fa",
    },
  },
  {
    id: "violet",
    name: "Violet Bloom",
    description: "Deep purple gradient",
    preview: {
      bg: "#fafafe",
      primary: "#7c3aed",
      chart1: "#40c98c",
      chart2: "#7c3aed",
      sidebar: "#f4f1fd",
    },
  },
  {
    id: "supabase",
    name: "Supabase",
    description: "Emerald green terminal",
    preview: {
      bg: "#f9fafb",
      primary: "#3ecf8e",
      chart1: "#3ecf8e",
      chart2: "#6231b5",
      sidebar: "#f3f4f6",
    },
  },
  {
    id: "tangerine",
    name: "Tangerine",
    description: "Orange on cool blue-gray",
    preview: {
      bg: "#eff3f8",
      primary: "#e07030",
      chart1: "#6b8dbe",
      chart2: "#e07030",
      sidebar: "#e8edf5",
    },
  },
  {
    id: "darkmatter",
    name: "Darkmatter",
    description: "Amber & teal on dark slate",
    preview: {
      bg: "#ffffff",
      primary: "#c8842a",
      chart1: "#3a9db0",
      chart2: "#c8842a",
      sidebar: "#f5f5f8",
    },
  },
  {
    id: "doom64",
    name: "Doom 64",
    description: "Retro shooter, zero radius",
    preview: {
      bg: "#d8d8d8",
      primary: "#8b2a1a",
      chart1: "#3a6e28",
      chart2: "#3a5080",
      sidebar: "#c2c2c2",
    },
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean blue on white",
    preview: {
      bg: "#ffffff",
      primary: "#3b82f6",
      chart1: "#3b82f6",
      chart2: "#2563eb",
      sidebar: "#f9fafb",
    },
  },
  {
    id: "t3-chat",
    name: "T3 Chat",
    description: "Warm rose & purple",
    preview: {
      bg: "#faf5fa",
      primary: "#a84370",
      chart1: "#d926a2",
      chart2: "#6c12b9",
      sidebar: "#f3e4f6",
    },
  },
  {
    id: "mocha-mousse",
    name: "Mocha Mousse",
    description: "Warm earthy brown tones",
    preview: {
      bg: "#F1F0E5",
      primary: "#A37764",
      chart1: "#A37764",
      chart2: "#8A655A",
      sidebar: "#ebd6cb",
    },
  },
  {
    id: "bubblegum",
    name: "Bubblegum",
    description: "Playful pink & teal",
    preview: {
      bg: "#f6e6ee",
      primary: "#d04f99",
      chart1: "#e670ab",
      chart2: "#84d2e2",
      sidebar: "#f8d8ea",
    },
  },
  {
    id: "amethyst-haze",
    name: "Amethyst Haze",
    description: "Soft purple & rose",
    preview: {
      bg: "#f8f7fa",
      primary: "#8a79ab",
      chart1: "#8a79ab",
      chart2: "#e6a5b8",
      sidebar: "#f1eff5",
    },
  },
  {
    id: "notebook",
    name: "Notebook",
    description: "Handwritten warm grays",
    preview: {
      bg: "#f9f9f9",
      primary: "#606060",
      chart1: "#333333",
      chart2: "#555555",
      sidebar: "#f0f0f0",
    },
  },
  {
    id: "catppuccin",
    name: "Catppuccin",
    description: "Pastel purple with cyan",
    preview: {
      bg: "#eff1f5",
      primary: "#8839ef",
      chart1: "#8839ef",
      chart2: "#04a5e5",
      sidebar: "#e6e9ef",
    },
  },
  {
    id: "graphite",
    name: "Graphite",
    description: "Monochrome gray minimal",
    preview: {
      bg: "#f0f0f0",
      primary: "#606060",
      chart1: "#606060",
      chart2: "#476666",
      sidebar: "#eaeaea",
    },
  },
  {
    id: "perpetuity",
    name: "Perpetuity",
    description: "Teal terminal monospace",
    preview: {
      bg: "#e8f0f0",
      primary: "#06858e",
      chart1: "#06858e",
      chart2: "#1e9ea6",
      sidebar: "#daebed",
    },
  },
  {
    id: "kodama-grove",
    name: "Kodama Grove",
    description: "Forest greens & warm tan",
    preview: {
      bg: "#e4d7b0",
      primary: "#8d9d4f",
      chart1: "#9db18c",
      chart2: "#8a9f7b",
      sidebar: "#e2d1a2",
    },
  },
  {
    id: "cosmic-night",
    name: "Cosmic Night",
    description: "Deep violet & indigo",
    preview: {
      bg: "#f5f5ff",
      primary: "#6e56cf",
      chart1: "#6e56cf",
      chart2: "#9e8cfc",
      sidebar: "#f0f0fa",
    },
  },
  {
    id: "quantum-rose",
    name: "Quantum Rose",
    description: "Hot pink neon gradients",
    preview: {
      bg: "#fff0f8",
      primary: "#e6067a",
      chart1: "#e6067a",
      chart2: "#c44b97",
      sidebar: "#ffedf6",
    },
  },
  {
    id: "nature",
    name: "Nature",
    description: "Forest green & earth tones",
    preview: {
      bg: "#f8f5f0",
      primary: "#2e7d32",
      chart1: "#4caf50",
      chart2: "#388e3c",
      sidebar: "#f0e9e0",
    },
  },
  {
    id: "bold-tech",
    name: "Bold Tech",
    description: "Electric violet & indigo",
    preview: {
      bg: "#ffffff",
      primary: "#8b5cf6",
      chart1: "#8b5cf6",
      chart2: "#7c3aed",
      sidebar: "#f5f3ff",
    },
  },
  {
    id: "elegant-luxury",
    name: "Elegant Luxury",
    description: "Deep crimson & gold",
    preview: {
      bg: "#faf7f5",
      primary: "#9b2c2c",
      chart1: "#b91c1c",
      chart2: "#9b2c2c",
      sidebar: "#f0ebe8",
    },
  },
  {
    id: "amber-minimal",
    name: "Amber Minimal",
    description: "Golden amber on white",
    preview: {
      bg: "#ffffff",
      primary: "#f59e0b",
      chart1: "#f59e0b",
      chart2: "#d97706",
      sidebar: "#f9fafb",
    },
  },
  {
    id: "neo-brutalism",
    name: "Neo Brutalism",
    description: "Bold red & yellow, no radius",
    preview: {
      bg: "#ffffff",
      primary: "#ff3333",
      chart1: "#ff3333",
      chart2: "#ffff00",
      sidebar: "#f0f0f0",
    },
  },
  {
    id: "solar-dusk",
    name: "Solar Dusk",
    description: "Warm amber desert sunset",
    preview: {
      bg: "#FDFBF7",
      primary: "#B45309",
      chart1: "#B45309",
      chart2: "#78716C",
      sidebar: "#F1E9DA",
    },
  },
  {
    id: "claymorphism",
    name: "Claymorphism",
    description: "Rounded clay indigo",
    preview: {
      bg: "#e7e5e4",
      primary: "#6366f1",
      chart1: "#6366f1",
      chart2: "#4f46e5",
      sidebar: "#d6d3d1",
    },
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Neon magenta & cyan",
    preview: {
      bg: "#f8f9fa",
      primary: "#ff00c8",
      chart1: "#ff00c8",
      chart2: "#9000ff",
      sidebar: "#f0f0ff",
    },
  },
  {
    id: "pastel-dreams",
    name: "Pastel Dreams",
    description: "Soft lavender & violet",
    preview: {
      bg: "#f7f3f9",
      primary: "#a78bfa",
      chart1: "#a78bfa",
      chart2: "#8b5cf6",
      sidebar: "#e9d8fd",
    },
  },
  {
    id: "clean-slate",
    name: "Clean Slate",
    description: "Sharp indigo on slate",
    preview: {
      bg: "#f8fafc",
      primary: "#6366f1",
      chart1: "#6366f1",
      chart2: "#4f46e5",
      sidebar: "#f3f4f6",
    },
  },
  {
    id: "caffeine",
    name: "Caffeine",
    description: "Deep coffee & warm cream",
    preview: {
      bg: "#f9f9f9",
      primary: "#644a40",
      chart1: "#644a40",
      chart2: "#ffdfb5",
      sidebar: "#fbfbfb",
    },
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    description: "Fresh green & sky blue",
    preview: {
      bg: "#f0f8ff",
      primary: "#22c55e",
      chart1: "#22c55e",
      chart2: "#10b981",
      sidebar: "#e0f2fe",
    },
  },
  {
    id: "retro-arcade",
    name: "Retro Arcade",
    description: "Solarized warm & cool",
    preview: {
      bg: "#fdf6e3",
      primary: "#d33682",
      chart1: "#268bd2",
      chart2: "#2aa198",
      sidebar: "#fdf6e3",
    },
  },
  {
    id: "midnight-bloom",
    name: "Midnight Bloom",
    description: "Deep violet & cobalt",
    preview: {
      bg: "#f9f9f9",
      primary: "#6c5ce7",
      chart1: "#6c5ce7",
      chart2: "#8e44ad",
      sidebar: "#f9f9f9",
    },
  },
  {
    id: "candyland",
    name: "Candyland",
    description: "Pastel pink & sky blue",
    preview: {
      bg: "#f7f9fa",
      primary: "#ffc0cb",
      chart1: "#ffc0cb",
      chart2: "#87ceeb",
      sidebar: "#f7f9fa",
    },
  },
  {
    id: "northern-lights",
    name: "Northern Lights",
    description: "Aurora green & blue",
    preview: {
      bg: "#f9f9fa",
      primary: "#34a85a",
      chart1: "#34a85a",
      chart2: "#6495ed",
      sidebar: "#f9f9fa",
    },
  },
  {
    id: "vintage-paper",
    name: "Vintage Paper",
    description: "Aged parchment & tan",
    preview: {
      bg: "#f5f1e6",
      primary: "#a67c52",
      chart1: "#a67c52",
      chart2: "#8d6e4c",
      sidebar: "#ece5d8",
    },
  },
  {
    id: "sunset-horizon",
    name: "Sunset Horizon",
    description: "Warm coral & golden",
    preview: {
      bg: "#fff9f5",
      primary: "#ff7e5f",
      chart1: "#ff7e5f",
      chart2: "#feb47b",
      sidebar: "#fff0eb",
    },
  },
  {
    id: "starry-night",
    name: "Starry Night",
    description: "Midnight blue & gold",
    preview: {
      bg: "#f5f7fa",
      primary: "#3a5ba0",
      chart1: "#3a5ba0",
      chart2: "#f7c873",
      sidebar: "#e3eaf2",
    },
  },
  {
    id: "vercel",
    name: "Vercel",
    description: "Pure black & white",
    preview: {
      bg: "#f8f8f8",
      primary: "#000000",
      chart1: "#e8a020",
      chart2: "#4040d0",
      sidebar: "#f8f8f8",
    },
  },
  {
    id: "mono",
    name: "Mono",
    description: "Grayscale monospace, no radius",
    preview: {
      bg: "#ffffff",
      primary: "#737373",
      chart1: "#737373",
      chart2: "#737373",
      sidebar: "#fafafa",
    },
  },
  {
    id: "soft-pop",
    name: "Soft Pop",
    description: "Bold indigo & teal rounded",
    preview: {
      bg: "#f7f9f3",
      primary: "#4f46e5",
      chart1: "#4f46e5",
      chart2: "#14b8a6",
      sidebar: "#f7f9f3",
    },
  },
  {
    id: "sage-garden",
    name: "Sage Garden",
    description: "Muted sage green & earthy",
    preview: {
      bg: "#f8f7f4",
      primary: "#7c9082",
      chart1: "#7c9082",
      chart2: "#a0aa88",
      sidebar: "#fafaf8",
    },
  },
]

interface ColorThemeStore {
  colorTheme: ColorTheme
  setColorTheme: (theme: ColorTheme) => void
}

export const useColorThemeStore = create<ColorThemeStore>()(
  persist(
    (set) => ({
      colorTheme: "default",
      setColorTheme: (theme) => set({ colorTheme: theme }),
    }),
    { name: "sharuco-color-theme" }
  )
)
