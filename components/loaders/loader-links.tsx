import React from "react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import { Skeleton } from "@/components/ui/skeleton"

const numbers = [1, 2, 3, 4, 5, 6]

export default function LoaderLinks() {
  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{
        659: 1,
        660: 2,
        720: 2,
        990: 3,
      }}
      className="w-full"
    >
      <Masonry gutter="2rem">
        {numbers.map((number) => (
          <div className="mb-0 flex flex-col gap-2">
            <Skeleton className="overflow-hidden h-64 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="flex flex-col gap-2 my-2">
              <div className="mb-2 flex flex-col gap-2">
                <Skeleton className="w-full h-3 bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="w-3/4 h-3 bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="mb-0 flex flex-col gap-2">
                <Skeleton className="w-3/4 h-2 bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="w-1/2 h-2 bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="w-full h-2 bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="w-4/5 h-2 bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
            <div className="flex w-full flex-wrap items-center justify-start gap-2">
              <Skeleton className="h-5 w-[70px] rounded-full bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-5 w-[70px] rounded-full bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-5 w-[70px] rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </Masonry>
    </ResponsiveMasonry>
  )
}
