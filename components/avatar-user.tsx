"use client"

import Link from "next/link"
import { useRouter } from "next/router"
import { useAuthContext } from "@/context/AuthContext"
import { auth } from "@/firebase/config"
import { useDocument } from "@/firebase/firestore/getDocument"
import { signOut } from "firebase/auth"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Loader from "./loader"

export const useGitHubLogout = () => {
  const router = useRouter()
  const logout = async () => {
    if (router.pathname === "/dashboard") {
      router.push("/")
    }
    try {
      await signOut(auth)
      console.log("user logged out")
    } catch (error) {
      console.log(error.message)
    }
  }

  return { logout }
}

export function AvatarUser() {
  const { logout } = useGitHubLogout()
  const { user } = useAuthContext()
  const pseudo = user?.reloadUserInfo.screenName
  const { data, isLoading, isError } = useDocument(pseudo, "users")
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
                    : pseudo
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
                  : pseudo}
              </span>
            )}
          </SheetTitle>
          <SheetDescription>This is your profile.</SheetDescription>
          <div className="py-4"></div>
        </SheetHeader>
        <div className="flex flex-col gap-2">
          <Link
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
      </SheetContent>
    </Sheet>
  )
}
