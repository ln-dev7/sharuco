"use client"

import Link from "next/link"

import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"

export function SiteFooter() {
  return (
    <footer className="container">
      <div className="flex flex-col items-center justify-between gap-4 border-t border-t-zinc-200 py-10 md:h-24 md:flex-row md:py-0 dark:border-t-zinc-700">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="4 17 10 11 4 5"></polyline>
            <line x1="12" y1="19" x2="20" y2="19"></line>
          </svg>
          <p className="text-center text-sm leading-loose text-zinc-600 md:text-left dark:text-zinc-400">
            Built by{" "}
            <a
              href="https://leonelngoya.com"
              target="_blank"
              rel="noreferrer"
              className="font-semibold underline underline-offset-4"
            >
              Leonel Ngoya ( LN )
            </a>
            {"  "}
            🇨🇲
          </p>
        </div>
        <div>
          <Link
            href="https://github.com/ln-dev7"
            target="_blank"
            rel="noreferrer"
          >
            <div
              className={buttonVariants({
                size: "sm",
                variant: "ghost",
                className: "text-zinc-700 dark:text-zinc-400",
              })}
            >
              <Icons.gitHub className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </div>
          </Link>
          <Link
            href="https://twitter.com/ln_dev7"
            target="_blank"
            rel="noreferrer"
          >
            <div
              className={buttonVariants({
                size: "sm",
                variant: "ghost",
                className: "text-zinc-700 dark:text-zinc-400",
              })}
            >
              <Icons.twitter className="h-5 w-5 fill-current" />
              <span className="sr-only">Twitter</span>
            </div>
          </Link>
        </div>
      </div>
    </footer>
  )
}
