"use client"

import { useEffect, useRef, useState } from "react"

interface CountUpProps {
  to: number
  duration?: number
  className?: string
}

export function CountUp({ to, duration = 900, className }: CountUpProps) {
  const [value, setValue] = useState(0)
  const startedRef = useRef(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (startedRef.current) return
    const node = ref.current
    if (!node) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || startedRef.current) continue
          startedRef.current = true
          const start = performance.now()
          const from = 0
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration)
            const eased = 1 - Math.pow(1 - t, 3)
            setValue(Math.round(from + (to - from) * eased))
            if (t < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          io.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    io.observe(node)
    return () => io.disconnect()
  }, [to, duration])

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  )
}
