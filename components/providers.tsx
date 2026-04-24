"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { ThemeProvider } from "next-themes"

import { AuthContextProvider } from "@/context/AuthContext"

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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  )
}
