"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useGitHubLogout } from "@/firebase/auth/githubLogout"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function AvatarUser() {
  const { logout } = useGitHubLogout()
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" alt="@ln_dev7" />
          <AvatarFallback>LN</AvatarFallback>
        </Avatar>
      </SheetTrigger>
      <SheetContent position="right" size="custom_w_200">
        <SheetHeader>
          <SheetTitle>Hello LN</SheetTitle>
          <SheetDescription>This is your profile.</SheetDescription>
          <div className="py-4"></div>
        </SheetHeader>
        <SheetFooter className="gap-2 md:gap-0">
          <Link
            href="/dashboard"
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            Dashboard
          </Link>
          <Button
            className={buttonVariants({ size: "lg", variant: "destructive" })}
            onClick={() => logout()}
          >
            Logout
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
