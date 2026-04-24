"use client"

import { useCallback, useRef, type ReactNode } from "react"

import { cn } from "@/lib/utils"

interface TiltedPreviewProps {
  children: ReactNode
  className?: string
  /** Base rotation in degrees; mouse interaction adds ±4° on top */
  baseRotateY?: number
  baseRotateX?: number
}

export function TiltedPreview({
  children,
  className,
  baseRotateY = -6,
  baseRotateX = 2,
}: TiltedPreviewProps) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const node = ref.current
      if (!node) return
      const rect = node.getBoundingClientRect()
      const relX = (event.clientX - rect.left) / rect.width - 0.5
      const relY = (event.clientY - rect.top) / rect.height - 0.5
      const ry = baseRotateY + relX * 8
      const rx = baseRotateX - relY * 6
      node.style.transform = `perspective(1200px) rotateY(${ry}deg) rotateX(${rx}deg)`
    },
    [baseRotateX, baseRotateY]
  )

  const onLeave = useCallback(() => {
    const node = ref.current
    if (!node) return
    node.style.transform = `perspective(1200px) rotateY(${baseRotateY}deg) rotateX(${baseRotateX}deg)`
  }, [baseRotateX, baseRotateY])

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        "transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none",
        className
      )}
      style={{
        transform: `perspective(1200px) rotateY(${baseRotateY}deg) rotateX(${baseRotateX}deg)`,
      }}
    >
      {children}
    </div>
  )
}
