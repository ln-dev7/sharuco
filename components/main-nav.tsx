import React from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

import { NavItem } from "@/types/nav"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className="flex gap-6 lg:gap-10">
      <Link href="/" className="hidden items-center space-x-2 lg:flex">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      {items?.length ? (
        <nav className="hidden gap-2 lg:flex">
          {items?.map(
            (item, index) =>
              item.href &&
              !item.support && (
                <Link
                  key={index}
                  href={item.disabled ? "#" : item.href}
                  className={cn(
                    "group relative inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-semibold transition-colors hover:bg-slate-100 focus:bg-slate-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-slate-50 data-[state=open]:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:focus:bg-slate-800 dark:data-[active]:bg-slate-800 dark:data-[state=open]:bg-slate-800",
                    item.disabled && "cursor-not-allowed"
                  )}
                >
                  {item.title}
                  {item.external && <ExternalLink className="ml-2 h-4 w-4" />}
                  {item.disabled && (
                    <span className="ml-2 rounded-xl bg-teal-100 px-1.5 py-0.5 text-xs no-underline group-hover:no-underline dark:text-slate-900">
                      Soon
                    </span>
                  )}
                  {item.pined && (
                    <span className="absolute right-0 top-0 flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                      <span className="inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
                    </span>
                  )}
                </Link>
              )
          )}
        </nav>
      ) : null}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="-ml-4 text-base hover:bg-transparent focus:ring-0 lg:hidden"
          >
            <Icons.logo className="mr-2 h-4 w-4" />{" "}
            <span className="font-bold">Menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={24}
          className="w-[300px] overflow-scroll"
        >
          <DropdownMenuLabel>
            <Link href="/" className="flex items-center">
              <Icons.logo className="mr-2 h-4 w-4" /> {siteConfig.name}
            </Link>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {items?.map(
            (item, index) =>
              item.href && (
                <DropdownMenuItem key={index} asChild>
                  <Link href={item.disabled ? "#" : item.href}>
                    {item.title}
                    {item.external && <ExternalLink className="ml-2 h-4 w-4" />}
                    {item.disabled && (
                      <span className="ml-2 rounded-xl bg-teal-100 px-1.5 py-0.5 text-xs no-underline group-hover:no-underline dark:text-slate-900">
                        Soon
                      </span>
                    )}
                  </Link>
                </DropdownMenuItem>
              )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
