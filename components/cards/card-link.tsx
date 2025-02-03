'use client';

import axios from 'axios';
import { XCircle } from 'lucide-react';
import { useQuery } from 'react-query';

import { Skeleton } from './../ui/skeleton';

export default function CardLink({
  id,
  idAuthor,
  createdAt,
  link,
  description,
  tags,
}) {
  //

  const fetchLinkPreview = async (url: string) => {
    const response = await axios.get(`/api/link-preview?url=${url}`);
    return response.data;
  };

  const {
    data: dataLinkPreview,
    error: errorLinkPreview,
    isLoading: isLoadingLinkPreview,
  } = useQuery(['preview', link], () => fetchLinkPreview(link));

  if (errorLinkPreview) {
    return (
      <div
        className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"
        key={id}
      >
        <a
          href={link}
          target="_blank"
          className="flex h-64 items-center justify-center"
        >
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-t-xl bg-zinc-50 text-center dark:bg-zinc-800">
            <XCircle className="h-8 w-8 text-zinc-400" />
            <h3 className="text-lg font-semibold">
              This link is not available
            </h3>
            <p className="text-sm text-muted-foreground">
              The link you are trying to access is not available.
            </p>
          </div>
        </a>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"
      key={id}
    >
      <a
        href={link}
        target="_blank"
        className="flex h-64 items-center justify-center"
      >
        {isLoadingLinkPreview ? (
          <Skeleton className="h-full w-full rounded-none bg-zinc-200 dark:bg-zinc-800" />
        ) : (
          <>
            {dataLinkPreview.image ? (
              <img
                className="h-full w-full object-cover"
                src={dataLinkPreview.image}
                alt={dataLinkPreview.title}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-t-xl border-b border-zinc-100 bg-zinc-50 text-center dark:border-zinc-700 dark:bg-zinc-800">
                <XCircle className="h-8 w-8 text-zinc-400" />
                <h3 className="text-lg font-semibold">Failed to load image</h3>
                <p className="text-sm text-muted-foreground">
                  The image could not be loaded for this link.
                </p>
              </div>
            )}
          </>
        )}
      </a>
      <div className="p-4">
        <a href={link} target="_blank">
          {isLoadingLinkPreview ? (
            <>
              <Skeleton className="mb-2 h-3 w-full bg-zinc-200 dark:bg-zinc-800" />
              <Skeleton className="mb-3 h-3 w-3/4 bg-zinc-200 dark:bg-zinc-800" />
            </>
          ) : (
            <>
              {dataLinkPreview.title && (
                <h5 className="mb-2 line-clamp-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  {dataLinkPreview.title}
                </h5>
              )}
            </>
          )}
        </a>
        {isLoadingLinkPreview ? (
          <>
            <Skeleton className="mb-2 h-2 w-3/4 bg-zinc-200 dark:bg-zinc-800" />
            <Skeleton className="mb-2 h-2 w-1/2 bg-zinc-200 dark:bg-zinc-800" />
            <Skeleton className="mb-2 h-2 w-full bg-zinc-200 dark:bg-zinc-800" />
            <Skeleton className="mb-3 h-2 w-4/5 bg-zinc-200 dark:bg-zinc-800" />
          </>
        ) : (
          <>
            {dataLinkPreview.description && (
              <p className="text-md mb-3 line-clamp-5 font-normal text-zinc-700 dark:text-zinc-400">
                {dataLinkPreview.description}
              </p>
            )}
          </>
        )}

        {tags && tags.length > 0 && (
          <div className="flex w-full flex-wrap items-center justify-start gap-2">
            {tags?.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-700 px-2 py-1 text-xs font-medium text-zinc-100 dark:bg-zinc-600 dark:text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
