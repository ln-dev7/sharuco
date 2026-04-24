"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

export type Theme = "light" | "dark" | "system"
export type ResolvedTheme = "light" | "dark"

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: ResolvedTheme
}

const STORAGE_KEY = "theme"
const ThemeContext = createContext<ThemeContextValue | null>(null)

function getSystem(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "system"
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    return stored ?? "system"
  } catch {
    return "system"
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => readStoredTheme())
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (typeof window === "undefined") return "light"
    const stored = readStoredTheme()
    return stored === "system" ? getSystem() : stored
  })

  const applyTheme = useCallback((next: ResolvedTheme) => {
    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(next)
    root.style.colorScheme = next
    setResolvedTheme(next)
  }, [])

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeState(next)
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // storage might be unavailable
      }
      applyTheme(next === "system" ? getSystem() : next)
    },
    [applyTheme]
  )

  useEffect(() => {
    if (theme !== "system") {
      applyTheme(theme)
      return
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handle = () => applyTheme(mq.matches ? "dark" : "light")
    handle()
    mq.addEventListener("change", handle)
    return () => mq.removeEventListener("change", handle)
  }, [theme, applyTheme])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return
      const next = (event.newValue as Theme | null) ?? "system"
      setThemeState(next)
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (ctx) return ctx
  // Allow useTheme to be called outside the provider without crashing; useful
  // while the app is still transitioning or in storybook-like contexts.
  return {
    theme: "system",
    setTheme: () => {},
    resolvedTheme: "light",
  }
}
