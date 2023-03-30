import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function CardUser({
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
          <h1 className="text-2xl font-bold">{displayName}</h1>
          <Link
            href={`/${pseudo}`}
            className="text-slate-600 hover:underline dark:text-slate-400"
          >
            {pseudo}
          </Link>
        </div>
      </div>
    </div>
  )
}
