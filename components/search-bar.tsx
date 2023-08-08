"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DialogProps } from "@radix-ui/react-alert-dialog"
import algoliasearch from "algoliasearch"
import {
  Circle,
  File,
  Laptop,
  Moon,
  Search,
  SearchIcon,
  SunMedium,
  Trash2,
} from "lucide-react"
import { useTheme } from "next-themes"
import {
  Highlight,
  Hits,
  InstantSearch,
  SearchBox,
} from "react-instantsearch-hooks-web"

import { cn } from "@/lib/utils"
import Loader from "@/components/loader"
import LoaderCode from "@/components/loader-code"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import AlgoliaSearch from "./algolia-search"

export function SearchBar({ ...props }: DialogProps) {
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
        <DialogContent className="max-h-[640px] p-0 overflow-hidden overflow-y-auto scrollbar-hide">
          <AlgoliaSearch />
        </DialogContent>
      </Dialog>
    </>
  )
}
