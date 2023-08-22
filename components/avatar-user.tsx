"use client"

import Link from "next/link"
import { useRouter } from "next/router"
import { useAuthContext } from "@/context/AuthContext"
import { auth } from "@/firebase/config"
import { useDocument } from "@/firebase/firestore/getDocument"
import { signOut } from "firebase/auth"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Loader from "./loaders/loader"
import { Separator } from "./ui/separator"

export const useGitHubLogout = () => {
  const router = useRouter()
  const logout = async () => {
    if (router.pathname === "/dashboard") {
      router.push("/")
    }
    try {
      await signOut(auth)
    } catch (error) {
      return
    }
  }

  return { logout }
}

export function AvatarUser() {
  const { logout } = useGitHubLogout()
  const { user, userPseudo } = useAuthContext()

  const { data, isLoading, isError } = useDocument(userPseudo, "users")
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Avatar className="cursor-pointer">
          {isLoading && (
            <AvatarFallback>
              <Loader />
            </AvatarFallback>
          )}
          {data && data.exists && (
            <>
              <AvatarImage
                src={data.data.photoURL}
                alt={
                  data.data.displayName !== null
                    ? data.data.displayName
                    : userPseudo
                }
              />
              <AvatarFallback>
                {data.data.displayName !== null ? (
                  <>
                    {data.data.displayName.split(" ")[0]}{" "}
                    {data.data.displayName.split(" ")[1] &&
                      data.data.displayName.split(" ")[1]}
                  </>
                ) : (
                  data.data.pseudo[0] + data.data.pseudo[1]
                )}
              </AvatarFallback>
            </>
          )}
        </Avatar>
      </SheetTrigger>
      <SheetContent position="right" size="custom_w_200">
        <SheetHeader>
          <SheetTitle>
            Hello{" "}
            {data && data.exists && (
              <span className="font-bold">
                {data.data.displayName !== null
                  ? data.data.displayName.split(" ")[0]
                  : userPseudo}
              </span>
            )}
          </SheetTitle>
          <SheetDescription>This is your profile.</SheetDescription>
          <div className="py-4"></div>
        </SheetHeader>
        <div className="flex flex-col gap-2">
          <Link
            defaultChecked
            href="/dashboard"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            Dashboard
          </Link>
          <Button
            className={buttonVariants({ size: "lg", variant: "destructive" })}
            onClick={() => {
              logout()
            }}
          >
            Logout
          </Button>
        </div>
        {user && (
          <>
            <Separator className="mb-4 mt-8" />
            <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">
              Follow Sharuco on{" "}
            </p>
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
      </SheetContent>
    </Sheet>
  )
}
