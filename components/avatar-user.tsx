"use client"

import { useGitHubLogout } from "@/firebase/auth/githubLogout"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
        </SheetHeader>
        {/* <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div> */}
        <SheetFooter>
          {/* <Button type="submit">Save changes</Button> */}
          <Button variant="destructive" onClick={() => logout()}>
            Logout
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
