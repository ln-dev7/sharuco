import React from "react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import { Skeleton } from "@/components/ui/skeleton"

export default function LoaderCode() {
  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{
        659: 1,
        660: 1,
        720: 1,
        1200: 1,
      }}
      className="w-full"
    >
      <Masonry gutter="2rem">
        <div className="mb-0 flex flex-col gap-2">
          <Skeleton className="overflow-hidden h-[200px] rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center justify-start gap-2">
              <Skeleton className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-4 w-[200px] bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="flex shrink-0 items-center justify-end gap-3">
              <Skeleton className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
          <Skeleton className="overflow-hidden w-3/4 h-[10px] rounded-lg bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="overflow-hidden w-5/6 h-[10px] rounded-lg bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="overflow-hidden w-1/3 h-[10px] rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="mt-2 flex w-full flex-wrap items-center justify-start gap-2">
            <Skeleton className="h-5 w-[70px] rounded-full bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-5 w-[70px] rounded-full bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-5 w-[70px] rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </Masonry>
    </ResponsiveMasonry>
  )
}
