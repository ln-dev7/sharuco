"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { buttonVariants } from "@/components/ui/button"
import { AvatarUser } from "./avatar-user"
import { SearchBarCode } from "./search-bar/search-bar-code"
import { SearchBarForm } from "./search-bar/search-bar-form"
import { SearchBarLink } from "./search-bar/search-bar-link"

export function SiteHeader() {
  const { user, userPseudo } = useAuthContext()
  const pathName = usePathname()
  const params = useParams()

  const searchBar =
    params["link"] !== undefined || (pathName === "/links" && user) ? (
      <SearchBarLink />
    ) : (params["form"] !== undefined && user) ||
      (pathName === "/forms" && user) ? (
      <SearchBarForm />
    ) : (
      <SearchBarCode />
    )

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-16 items-center gap-2 sm:gap-3">
        <MainNav items={siteConfig.mainNav} />

        <div className="flex min-w-0 flex-1 items-center justify-end gap-1 sm:gap-2">
          <div className="min-w-0 flex-1 lg:w-72 lg:flex-none">{searchBar}</div>

          {!user ? (
            <>
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                  className:
                    "hidden text-zinc-700 sm:inline-flex dark:text-zinc-400",
                })}
                aria-label="GitHub"
              >
                <Icons.gitHub className="h-5 w-5" />
              </Link>
              <Link
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                  className:
                    "hidden text-zinc-700 sm:inline-flex dark:text-zinc-400",
                })}
                aria-label="Twitter"
              >
                <Icons.twitter className="h-5 w-5 fill-current" />
              </Link>
            </>
          ) : null}

          <ThemeSwitcher />
          <ThemeToggle />

          {user ? <AvatarUser /> : null}
        </div>
      </div>
    </header>
  )
}
