import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import { Skeleton } from '@/components/ui/skeleton';

export default function LoaderLink() {
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
          <Skeleton className="h-64 overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div className="my-2 flex flex-col gap-2">
            <div className="mb-2 flex flex-col gap-2">
              <Skeleton className="h-3 w-full bg-zinc-200 dark:bg-zinc-800" />
              <Skeleton className="h-3 w-3/4 bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="mb-0 flex flex-col gap-2">
              <Skeleton className="h-2 w-3/4 bg-zinc-200 dark:bg-zinc-800" />
              <Skeleton className="h-2 w-1/2 bg-zinc-200 dark:bg-zinc-800" />
              <Skeleton className="h-2 w-full bg-zinc-200 dark:bg-zinc-800" />
              <Skeleton className="h-2 w-4/5 bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
          <div className="flex w-full flex-wrap items-center justify-start gap-2">
            <Skeleton className="h-5 w-[70px] rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <Skeleton className="h-5 w-[70px] rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <Skeleton className="h-5 w-[70px] rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </Masonry>
    </ResponsiveMasonry>
  );
}
