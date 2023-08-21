"use client"

import * as React from "react"
import { DialogProps } from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import AlgoliaSearchCode from "./../algolia/algolia-search-code"

export function SearchBarCode({ ...props }: DialogProps) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            defaultChecked={false}
            variant="outline"
            className={cn(
              "relative h-9 w-full justify-start rounded-[0.5rem] text-sm text-muted-foreground sm:pr-12 lg:w-72"
            )}
            onClick={() => setOpen(true)}
            {...props}
          >
            <span className="hidden sm:inline-flex">
              Search publics codes ...
            </span>
            <span className="inline-flex sm:hidden">Search...</span>
            <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </DialogTrigger>
        <DialogContent className="scrollbar-hide max-h-[640px] overflow-hidden overflow-y-auto p-0">
          <AlgoliaSearchCode />
        </DialogContent>
      </Dialog>
    </>
  )
}
