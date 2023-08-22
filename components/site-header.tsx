"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { buttonVariants } from "@/components/ui/button"
import { AvatarUser } from "./avatar-user"
import { SearchBarCode } from "./search-bar/search-bar-code"
import { SearchBarForm } from "./search-bar/search-bar-form"
import { SearchBarLink } from "./search-bar/search-bar-link"

export function SiteHeader() {
  const { user, userPseudo } = useAuthContext()
  const pathName = usePathname()
  const searchParams = useSearchParams()
  return (
    <header className="sticky top-0 z-40 w-full border-b border-b-slate-200 bg-white dark:border-b-slate-700 dark:bg-slate-900">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div>
          <MainNav items={siteConfig.mainNav} />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full flex-1 lg:w-auto lg:flex-none">
            {searchParams.get("link") !== null ||
            (pathName === "/links" && user) ? (
              <SearchBarLink />
            ) : (searchParams.get("form") !== null && user) ||
              (pathName === "/forms" && user) ? (
              <SearchBarForm />
            ) : (
              <SearchBarCode />
            )}
          </div>
          <nav className="flex items-center space-x-1">
            {!user && (
              <>
                <Link
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                      className: "text-slate-700 dark:text-slate-400",
                    })}
                  >
                    <Icons.gitHub className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </div>
                </Link>
                <Link
                  href={siteConfig.links.twitter}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                      className: "text-slate-700 dark:text-slate-400",
                    })}
                  >
                    <Icons.twitter className="h-5 w-5 fill-current" />
                    <span className="sr-only">Twitter</span>
                  </div>
                </Link>
              </>
            )}
            <ThemeToggle />
          </nav>
          {user && <AvatarUser />}
        </div>
      </div>
    </header>
  )
}
