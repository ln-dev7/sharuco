"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  IMAGE_BACKGROUNDS_BACKDROPS,
  IMAGE_BACKGROUNDS_PARTNERS,
  IMAGE_BACKGROUNDS_THEMES,
  type ImageBackground,
} from "@/components/image/backgrounds"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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

function BackgroundGroup({
  heading,
  items,
  value,
  onSelect,
}: {
  heading: string
  items: ImageBackground[]
  value: string
  onSelect: (id: string) => void
}) {
  return (
    <CommandGroup heading={heading}>
      {items.map((bg) => (
        <CommandItem
          key={bg.id}
          value={`${heading} ${bg.name}`}
          onSelect={() => onSelect(bg.id)}
        >
          <BackgroundPreview bg={bg} />
          <span className="ml-2 truncate">{bg.name}</span>
          <Check
            className={cn(
              "ml-auto h-4 w-4",
              value === bg.id ? "opacity-100" : "opacity-0"
            )}
          />
        </CommandItem>
      ))}
    </CommandGroup>
  )
}

export function ThemeSelect({ value, onChange }: ThemeSelectProps) {
  const [open, setOpen] = useState(false)
  const all = [
    ...IMAGE_BACKGROUNDS_THEMES,
    ...IMAGE_BACKGROUNDS_BACKDROPS,
    ...IMAGE_BACKGROUNDS_PARTNERS,
  ]
  const selected = all.find((b) => b.id === value) ?? all[0]

  const handleSelect = (id: string) => {
    onChange(id)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className="flex items-center gap-2 truncate">
            <BackgroundPreview bg={selected} />
            <span className="truncate">{selected.name}</span>
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search theme..." className="h-9" />
          <CommandList className="max-h-80">
            <CommandEmpty>No theme found.</CommandEmpty>
            <BackgroundGroup
              heading="Themes"
              items={IMAGE_BACKGROUNDS_THEMES}
              value={value}
              onSelect={handleSelect}
            />
            <BackgroundGroup
              heading="Backdrops"
              items={IMAGE_BACKGROUNDS_BACKDROPS}
              value={value}
              onSelect={handleSelect}
            />
            <BackgroundGroup
              heading="Partners"
              items={IMAGE_BACKGROUNDS_PARTNERS}
              value={value}
              onSelect={handleSelect}
            />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
