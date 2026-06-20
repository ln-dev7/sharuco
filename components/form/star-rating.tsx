"use client"

import { useState } from "react"
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

export default function StarRating({
  value,
  max = 5,
  onChange,
  readOnly = false,
}: {
  value: number
  max?: number
  onChange?: (value: number) => void
  readOnly?: boolean
}) {
  const [hover, setHover] = useState<number | null>(null)

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1
        const active = (hover ?? value) >= starValue
        return (
          <button
            key={i}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange?.(starValue)}
            onMouseEnter={() => !readOnly && setHover(starValue)}
            onMouseLeave={() => !readOnly && setHover(null)}
            className={cn(
              "transition-transform",
              !readOnly && "hover:scale-110 cursor-pointer",
              readOnly && "cursor-default"
            )}
            aria-label={`${starValue} star`}
          >
            <Star
              className={cn(
                "h-7 w-7",
                active
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-zinc-300 dark:text-zinc-600"
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
