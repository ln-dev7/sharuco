"use client"

import { useState } from "react"
import { allLanguages } from "@/constants/languages"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
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

interface LanguageComboboxProps {
  value: string
  onChange: (value: string) => void
}

export function LanguageCombobox({ value, onChange }: LanguageComboboxProps) {
  const [open, setOpen] = useState(false)

  const selected = allLanguages.find(
    (lang) => lang.name.toLowerCase() === value.toLowerCase()
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          data-language-trigger=""
          className="w-full justify-between font-normal"
        >
          <span className="flex items-center gap-2 truncate">
            {selected ? (
              <span
                aria-hidden
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: selected.color }}
              />
            ) : null}
            <span className="truncate">
              {selected ? selected.name : "Select language"}
            </span>
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search language..." className="h-9" />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {allLanguages.map((lang) => {
                const id = lang.name.toLowerCase()
                const pick = () => {
                  onChange(id)
                  setOpen(false)
                }
                return (
                  <CommandItem
                    key={lang.name}
                    value={lang.name}
                    onSelect={pick}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      pick()
                    }}
                    className="cursor-pointer"
                  >
                    <span
                      aria-hidden
                      className="mr-2 h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: lang.color }}
                    />
                    {lang.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value.toLowerCase() === id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
