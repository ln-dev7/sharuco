"use client"

import * as React from "react"
import { DialogProps } from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import AlgoliaSearchLink from "./../algolia/algolia-search-link"

export function SearchBarLink({ ...props }: DialogProps) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "i" && (e.metaKey || e.ctrlKey)) {
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
              "relative h-[44px] w-full justify-start items-center rounded-[0.5rem] text-sm"
            )}
            onClick={() => setOpen(true)}
            {...props}
          >
            <span className="hidden sm:inline-flex">Search links ...</span>
            <span className="inline-flex sm:hidden">Search links ...</span>
            <kbd className="pointer-events-none absolute right-1.5 top-2 flex h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              <span className="text-xs">⌘</span>I
            </kbd>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[640px] p-0 overflow-hidden overflow-y-auto scrollbar-hide">
          <AlgoliaSearchLink />
        </DialogContent>
      </Dialog>
    </>
  )
}
