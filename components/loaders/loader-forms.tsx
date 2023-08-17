import React from "react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import { Skeleton } from "@/components/ui/skeleton"

const numbers = [1, 2, 3, 4, 5, 6]

export default function LoaderForms() {
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
          <div
            className="mb-0 flex flex-col gap-2 bg-slate-50 dark:bg-slate-950 p-6 rounded-lg"
            key={number}
          >
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="my-4 flex flex-col gap-2">
              <Skeleton className="h-3 w-3/4 bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-3 w-full bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="flex w-full flex-wrap items-center justify-between gap-2">
              <Skeleton className="h-3 w-28 rounded-full bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-3 w-28 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </Masonry>
    </ResponsiveMasonry>
  )
}
