import { create } from "zustand"
import { persist } from "zustand/middleware"

import {
  IMAGE_BACKGROUNDS,
  type ImageBackground,
} from "@/components/image/backgrounds"

interface CodeStyleStore {
  backgroundId: string
  fontId: string
  setBackgroundId: (id: string) => void
  setFontId: (id: string) => void
}

export const useCodeStyleStore = create<CodeStyleStore>()(
  persist(
    (set) => ({
      backgroundId: IMAGE_BACKGROUNDS[0].id,
      fontId: "jetbrains-mono",
      setBackgroundId: (backgroundId) => set({ backgroundId }),
      setFontId: (fontId) => set({ fontId }),
    }),
    { name: "sharuco-code-style" }
  )
)

export function resolveBackground(id: string): ImageBackground {
  return IMAGE_BACKGROUNDS.find((b) => b.id === id) ?? IMAGE_BACKGROUNDS[0]
}
