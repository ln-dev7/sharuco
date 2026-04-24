"use client"

import { useEffect } from "react"
import { useColorThemeStore } from "@/store/color-theme-store"

export function ColorThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const colorTheme = useColorThemeStore((s) => s.colorTheme)

  useEffect(() => {
    const html = document.documentElement
    if (colorTheme === "default") {
      html.removeAttribute("data-color-theme")
    } else {
      html.setAttribute("data-color-theme", colorTheme)
    }
  }, [colorTheme])

  return <>{children}</>
}
