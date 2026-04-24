"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "react-query"

import { AuthContextProvider } from "@/context/AuthContext"
import { ColorThemeProvider } from "@/components/color-theme-provider"
import { ThemeProvider } from "@/components/theme-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <ThemeProvider>
          <ColorThemeProvider>{children}</ColorThemeProvider>
        </ThemeProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  )
}
