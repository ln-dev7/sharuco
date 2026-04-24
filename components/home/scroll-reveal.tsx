"use client"

import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react"

import { cn } from "@/lib/utils"

type ScrollRevealProps<T extends ElementType> = {
  as?: T
  children: ReactNode
  delay?: number
  className?: string
} & Omit<ComponentPropsWithoutRef<T>, "children" | "className">

export function ScrollReveal<T extends ElementType = "div">({
  as,
  children,
  delay = 0,
  className,
  ...rest
}: ScrollRevealProps<T>) {
  const Tag = (as ?? "div") as ElementType
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            io.disconnect()
            break
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as never}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none",
        visible
          ? "blur-0 translate-y-0 opacity-100"
          : "translate-y-6 opacity-0 blur-[2px]",
        className
      )}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
