"use client"

import { memo, useEffect, useRef, type CSSProperties } from "react"

const TWO_PI = Math.PI * 2

interface DotFieldProps {
  dotRadius?: number
  dotSpacing?: number
  cursorRadius?: number
  cursorForce?: number
  bulgeOnly?: boolean
  bulgeStrength?: number
  glowRadius?: number
  sparkle?: boolean
  waveAmplitude?: number
  gradientFrom?: string
  gradientTo?: string
  glowColor?: string
  style?: CSSProperties
  className?: string
}

interface Dot {
  ax: number
  ay: number
  sx: number
  sy: number
  vx: number
  vy: number
  x: number
  y: number
}

/**
 * Canvas-based animated dot field, ported from reactbits.dev.
 * Dots are pushed outward by a "bulge" physics when the cursor gets close.
 */
export const DotField = memo(function DotField({
  dotRadius = 1.5,
  dotSpacing = 14,
  cursorRadius = 500,
  cursorForce = 0.1,
  bulgeOnly = true,
  bulgeStrength = 67,
  glowRadius = 160,
  sparkle = false,
  waveAmplitude = 0,
  gradientFrom = "rgba(168, 85, 247, 0.35)",
  gradientTo = "rgba(180, 151, 207, 0.25)",
  glowColor = "#120F17",
  style,
  className,
}: DotFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glowRef = useRef<SVGCircleElement>(null)
  const dotsRef = useRef<Dot[]>([])
  const mouseRef = useRef({
    x: -9999,
    y: -9999,
    prevX: -9999,
    prevY: -9999,
    speed: 0,
  })
  const rafRef = useRef<number | null>(null)
  const sizeRef = useRef({ w: 0, h: 0, offsetX: 0, offsetY: 0 })
  const glowOpacity = useRef(0)
  const engagement = useRef(0)
  const propsRef =
    useRef<
      Required<
        Omit<DotFieldProps, "style" | "className" | "glowColor" | "glowRadius">
      >
    >()
  propsRef.current = {
    dotRadius,
    dotSpacing,
    cursorRadius,
    cursorForce,
    bulgeOnly,
    bulgeStrength,
    sparkle,
    waveAmplitude,
    gradientFrom,
    gradientTo,
  }
  const rebuildRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const glowEl = glowRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let resizeTimer: ReturnType<typeof setTimeout> | undefined

    function resize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(doResize, 100)
    }

    function doResize() {
      if (!canvas || !ctx) return
      const rect = canvas.parentElement!.getBoundingClientRect()
      const w = rect.width
      const h = rect.height

      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      sizeRef.current = {
        w,
        h,
        offsetX: rect.left + window.scrollX,
        offsetY: rect.top + window.scrollY,
      }

      buildDots(w, h)
    }

    function buildDots(w: number, h: number) {
      const p = propsRef.current!
      const step = p.dotRadius + p.dotSpacing
      const cols = Math.floor(w / step)
      const rows = Math.floor(h / step)
      const padX = (w % step) / 2
      const padY = (h % step) / 2
      const dots: Dot[] = new Array(rows * cols)
      let idx = 0

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const ax = padX + col * step + step / 2
          const ay = padY + row * step + step / 2
          dots[idx++] = { ax, ay, sx: ax, sy: ay, vx: 0, vy: 0, x: ax, y: ay }
        }
      }
      dotsRef.current = dots
    }

    function onMouseMove(e: MouseEvent) {
      const target = e.target as Element | null
      if (target?.closest?.(".ln-navbar")) return
      const s = sizeRef.current
      mouseRef.current.x = e.pageX - s.offsetX
      mouseRef.current.y = e.pageY - s.offsetY
    }

    function updateMouseSpeed() {
      const m = mouseRef.current
      const dx = m.prevX - m.x
      const dy = m.prevY - m.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      m.speed += (dist - m.speed) * 0.5
      if (m.speed < 0.001) m.speed = 0
      m.prevX = m.x
      m.prevY = m.y
    }

    const speedInterval = setInterval(updateMouseSpeed, 20)

    let frameCount = 0

    function tick() {
      if (!ctx) return
      frameCount++
      const dots = dotsRef.current
      const m = mouseRef.current
      const { w, h } = sizeRef.current
      const p = propsRef.current!
      const len = dots.length
      const t = frameCount * 0.02

      const targetEngagement = Math.min(m.speed / 5, 1)
      engagement.current += (targetEngagement - engagement.current) * 0.06
      if (engagement.current < 0.001) engagement.current = 0
      const eng = engagement.current

      glowOpacity.current += (eng - glowOpacity.current) * 0.08

      if (glowEl) {
        glowEl.setAttribute("cx", String(m.x))
        glowEl.setAttribute("cy", String(m.y))
        glowEl.style.opacity = String(glowOpacity.current)
      }

      ctx.clearRect(0, 0, w, h)

      const grad = ctx.createLinearGradient(0, 0, w, h)
      grad.addColorStop(0, p.gradientFrom)
      grad.addColorStop(1, p.gradientTo)
      ctx.fillStyle = grad

      const cr = p.cursorRadius
      const crSq = cr * cr
      const rad = p.dotRadius / 2
      const isBulge = p.bulgeOnly

      ctx.beginPath()

      for (let i = 0; i < len; i++) {
        const d = dots[i]
        const dx = m.x - d.ax
        const dy = m.y - d.ay
        const distSq = dx * dx + dy * dy

        if (distSq < crSq && eng > 0.01) {
          const dist = Math.sqrt(distSq)
          if (isBulge) {
            const tt = 1 - dist / cr
            const push = tt * tt * p.bulgeStrength * eng
            const angle = Math.atan2(dy, dx)
            d.sx += (d.ax - Math.cos(angle) * push - d.sx) * 0.15
            d.sy += (d.ay - Math.sin(angle) * push - d.sy) * 0.15
          } else {
            const angle = Math.atan2(dy, dx)
            const move = (500 / dist) * (m.speed * p.cursorForce)
            d.vx += Math.cos(angle) * -move
            d.vy += Math.sin(angle) * -move
          }
        } else if (isBulge) {
          d.sx += (d.ax - d.sx) * 0.1
          d.sy += (d.ay - d.sy) * 0.1
        }

        if (!isBulge) {
          d.vx *= 0.9
          d.vy *= 0.9
          d.x = d.ax + d.vx
          d.y = d.ay + d.vy
          d.sx += (d.x - d.sx) * 0.1
          d.sy += (d.y - d.sy) * 0.1
        }

        let drawX = d.sx
        let drawY = d.sy
        if (p.waveAmplitude > 0) {
          drawY += Math.sin(d.ax * 0.03 + t) * p.waveAmplitude
          drawX += Math.cos(d.ay * 0.03 + t * 0.7) * p.waveAmplitude * 0.5
        }

        if (p.sparkle) {
          const hash = ((i * 2654435761) ^ (frameCount >> 3)) >>> 0
          if (hash % 100 < 3) {
            ctx.moveTo(drawX + rad * 1.8, drawY)
            ctx.arc(drawX, drawY, rad * 1.8, 0, TWO_PI)
          } else {
            ctx.moveTo(drawX + rad, drawY)
            ctx.arc(drawX, drawY, rad, 0, TWO_PI)
          }
        } else {
          ctx.moveTo(drawX + rad, drawY)
          ctx.arc(drawX, drawY, rad, 0, TWO_PI)
        }
      }

      ctx.fill()

      rafRef.current = requestAnimationFrame(tick)
    }

    doResize()
    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", onMouseMove, { passive: true })
    rafRef.current = requestAnimationFrame(tick)

    rebuildRef.current = () => {
      const { w, h } = sizeRef.current
      if (w > 0 && h > 0) buildDots(w, h)
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      clearInterval(speedInterval)
      clearTimeout(resizeTimer)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMouseMove)
    }
  }, [])

  useEffect(() => {
    rebuildRef.current?.()
  }, [dotRadius, dotSpacing])

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <defs>
          <radialGradient id="dot-field-glow">
            <stop offset="0%" stopColor={glowColor} />
            <stop offset="100%" stopColor={`${glowColor}00`} />
          </radialGradient>
        </defs>
        <circle
          ref={glowRef}
          cx="-9999"
          cy="-9999"
          r={glowRadius}
          fill="url(#dot-field-glow)"
          style={{ opacity: 0, willChange: "opacity" }}
        />
      </svg>
    </div>
  )
})
