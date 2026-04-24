"use client"

import { useCallback, useRef, type ReactNode } from "react"

import { cn } from "@/lib/utils"

interface SpotlightCardProps {
  children: ReactNode
  className?: string
}

export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    node.style.setProperty("--spotlight-x", `${x}px`)
    node.style.setProperty("--spotlight-y", `${y}px`)
    node.setAttribute("data-spotlight", "on")
  }, [])

  const onLeave = useCallback(() => {
    const node = ref.current
    if (!node) return
    node.setAttribute("data-spotlight", "off")
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("sharuco-spotlight-card", className)}
    >
      {children}
    </div>
  )
}
