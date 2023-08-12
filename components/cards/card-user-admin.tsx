import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export default function CardUserAdmin({
  pseudo,
  displayName,
  photoURL,
}: {
  pseudo: string
  displayName: string
  photoURL: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-slate-200 p-4 dark:border-slate-700">
      <div className="flex w-full items-center justify-start gap-4">
        <Avatar className="h-20 w-20 cursor-pointer">
          <AvatarImage
            src={photoURL}
            alt={displayName !== null ? displayName : pseudo}
          />
          <AvatarFallback>
            {displayName !== null ? (
              <>
                {displayName.split(" ")[1] === undefined
                  ? displayName.split(" ")[0][0] + displayName.split(" ")[0][1]
                  : displayName.split(" ")[0][0] + displayName.split(" ")[1][0]}
              </>
            ) : (
              pseudo[0] + pseudo[1]
            )}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">
            {displayName !== null ? displayName : pseudo}
          </h1>
          <Link
            href={`/user/${pseudo}`}
            className="text-slate-600 hover:underline dark:text-slate-400"
          >
            {pseudo}
          </Link>
        </div>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-full" variant="destructive">
            Delete user
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this account ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action is irreversible, please reflect beforehand.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <button
              className={cn(
                "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
              )}
            >
              Delete user
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
