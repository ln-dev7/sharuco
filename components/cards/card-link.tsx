"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import { useDeleteDocument } from "@/firebase/firestore/deleteDocument"
import { useUpdateLinkDocument } from "@/firebase/firestore/updateLinkDocument"
import copyToClipboard from "@/utils/copyToClipboard"
import { yupResolver } from "@hookform/resolvers/yup"
import algoliasearch from "algoliasearch"
import axios from "axios"
import { Loader2, MoreHorizontal, Pencil, Trash, XCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { useQuery } from "react-query"
import * as yup from "yup"

import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import EmptyCard from "./../empty-card"
import { Skeleton } from "./../ui/skeleton"

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
    const response = await axios.get(`/api/link-preview?url=${url}`)
    return response.data
  }

  const {
    data: dataLinkPreview,
    error: errorLinkPreview,
    isLoading: isLoadingLinkPreview,
  } = useQuery(["preview", link], () => fetchLinkPreview(link))

  if (errorLinkPreview) {
    return (
      <div
        className="relative overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
        key={id}
      >
        <a
          href={link}
          target="_blank"
          className="flex h-64 items-center justify-center"
        >
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-t-xl bg-slate-50 text-center dark:bg-slate-800">
            <XCircle className="h-8 w-8 text-slate-400" />
            <h3 className="text-lg font-semibold">
              This link is not available
            </h3>
            <p className="text-sm text-muted-foreground">
              The link you are trying to access is not available.
            </p>
          </div>
        </a>
      </div>
    )
  }

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
      key={id}
    >
      <a
        href={link}
        target="_blank"
        className="flex h-64 items-center justify-center"
      >
        {isLoadingLinkPreview ? (
          <Skeleton className="h-full w-full rounded-none bg-slate-200 dark:bg-slate-800" />
        ) : (
          <>
            {dataLinkPreview.image ? (
              <img
                className="h-full w-full object-cover"
                src={dataLinkPreview.image}
                alt={dataLinkPreview.title}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-t-xl border-b border-slate-100 bg-slate-50 text-center dark:border-slate-700 dark:bg-slate-800">
                <XCircle className="h-8 w-8 text-slate-400" />
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
              <Skeleton className="mb-2 h-3 w-full bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="mb-3 h-3 w-3/4 bg-slate-200 dark:bg-slate-800" />
            </>
          ) : (
            <>
              {dataLinkPreview.title && (
                <h5 className="mb-2 line-clamp-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {dataLinkPreview.title}
                </h5>
              )}
            </>
          )}
        </a>
        {isLoadingLinkPreview ? (
          <>
            <Skeleton className="mb-2 h-2 w-3/4 bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="mb-2 h-2 w-1/2 bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="mb-2 h-2 w-full bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="mb-3 h-2 w-4/5 bg-slate-200 dark:bg-slate-800" />
          </>
        ) : (
          <>
            {dataLinkPreview.description && (
              <p className="text-md mb-3 line-clamp-5 font-normal text-slate-700 dark:text-slate-400">
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
                className="rounded-full bg-slate-700 px-2 py-1 text-xs font-medium text-slate-100 dark:bg-slate-600 dark:text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
