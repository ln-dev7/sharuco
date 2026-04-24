"use client"

import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  IMAGE_BACKGROUNDS_BACKDROPS,
  IMAGE_BACKGROUNDS_PARTNERS,
  IMAGE_BACKGROUNDS_THEMES,
  type ImageBackground,
} from "@/components/image/backgrounds"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ThemeSelectProps {
  value: string
  onChange: (value: string) => void
}

function BackgroundPreview({ bg }: { bg: ImageBackground }) {
  return (
    <span
      className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-[3px]"
      style={{ background: bg.style, color: bg.logoColor ?? "#ffffff" }}
    >
      {bg.logo ? (
        <span
          className="flex h-2.5 w-2.5 items-center justify-center"
          dangerouslySetInnerHTML={{ __html: bg.logo }}
        />
      ) : null}
    </span>
  )
}

export function ThemeSelect({ value, onChange }: ThemeSelectProps) {
  const all = [
    ...IMAGE_BACKGROUNDS_THEMES,
    ...IMAGE_BACKGROUNDS_BACKDROPS,
    ...IMAGE_BACKGROUNDS_PARTNERS,
  ]
  const selected = all.find((b) => b.id === value) ?? all[0]

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue>
          <span className="flex items-center gap-2">
            <BackgroundPreview bg={selected} />
            <span>{selected.name}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Themes</SelectLabel>
          {IMAGE_BACKGROUNDS_THEMES.map((bg) => (
            <SelectItem key={bg.id} value={bg.id}>
              <span className="flex items-center gap-2">
                <BackgroundPreview bg={bg} />
                <span>{bg.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Backdrops</SelectLabel>
          {IMAGE_BACKGROUNDS_BACKDROPS.map((bg) => (
            <SelectItem key={bg.id} value={bg.id}>
              <span className="flex items-center gap-2">
                <BackgroundPreview bg={bg} />
                <span>{bg.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Partners</SelectLabel>
          {IMAGE_BACKGROUNDS_PARTNERS.map((bg) => (
            <SelectItem key={bg.id} value={bg.id}>
              <span className="flex items-center gap-2">
                <BackgroundPreview bg={bg} />
                <span>{bg.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export { Check }
export { cn }
