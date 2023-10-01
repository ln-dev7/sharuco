"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
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

export default function CardLinkAdmin({
  id,
  idAuthor,
  createdAt,
  link,
  description,
  tags,
}) {
  const { toast } = useToast()

  const [openEditDialog, setOpenEditDialog] = useState(false)

  //

  const ALGOLIA_INDEX_NAME = "links"

  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_KEY
  )
  const index = client.initIndex(ALGOLIA_INDEX_NAME)

  const { deleteDocument, isLoading: isLoadingDelete }: any =
    useDeleteDocument("links")

  const handleDeleteDocument = () => {
    deleteDocument(id)
    index.deleteObject(id)
  }

  const schema = yup.object().shape({
    link: yup
      .string()
      .matches(
        /^(http|https):\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/,
        "Invalid link format"
      )
      .required(),
    description: yup.string().required(),
    tags: yup
      .string()
      .test(
        "tags",
        "The tags field must contain only letters, commas and/or spaces",
        (val) => !val || /^[a-zA-Z, ]*$/.test(val)
      ),
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    setValue("link", link)
    setValue("description", description)
    setValue("tags", tags.join().trim().replace(/\s+/g, ""))
  }, [link, description, tags, setValue])

  const { updateLinkDocument, isLoading, isError, isSuccess }: any =
    useUpdateLinkDocument("links")

  const onSubmit = async (data) => {
    const {
      link: linkUpdate,
      description: descriptionUpdate,
      tags: tagsUpdate,
    } = data

    const tabTabs = tagsUpdate
      ? tagsUpdate.split(",").map((word) => word.trim().toLowerCase())
      : []
    if (tabTabs[tabTabs.length - 1] === "") {
      tabTabs.pop()
    }

    if (
      linkUpdate === link &&
      descriptionUpdate === description &&
      tagsUpdate === tags.join(",")
    ) {
      toast({
        variant: "destructive",
        title: "You have not made any changes",
        description: "Please make changes to update your link",
        action: <ToastAction altText="Okay">Okay</ToastAction>,
      })
      return
    }

    let updatedLinkData: {
      link: string
      description: string
      tags: string[]
    } = {
      link: linkUpdate,
      description: descriptionUpdate,
      tags: tabTabs,
    }

    await updateLinkDocument({ id, updatedLinkData })

    await index.partialUpdateObject({
      objectID: id,
      link: linkUpdate,
      description: descriptionUpdate,
      tags: tabTabs,
    })

    reset({
      link: linkUpdate,
      description: descriptionUpdate,
      tags: tagsUpdate,
    })

    setOpenEditDialog(false)
    toast({
      title: "Your link has been updated successfully !",
      action: <ToastAction altText="Okay">Okay</ToastAction>,
    })
  }

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
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="absolute right-2 top-2 z-30 h-10 w-10 rounded-full bg-white p-0 dark:bg-slate-700"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <div className="flex w-full items-center justify-end gap-2">
              <AlertDialog
                open={openEditDialog}
                onOpenChange={setOpenEditDialog}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 w-10 rounded-full p-0"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="scrollbar-hide max-h-[640px] overflow-hidden overflow-y-auto">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-slate-100">
                        Edit a link
                      </h3>
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      <div className="mb-4 flex w-full flex-col items-start gap-1.5">
                        <Label htmlFor="link">Insert your link</Label>
                        <Input
                          placeholder="Insert your link here..."
                          id="link"
                          {...register("link")}
                        />
                        <p className="text-sm text-red-500">
                          {errors.link && <>{errors.link.message}</>}
                        </p>
                      </div>
                      <div className="mb-4 flex w-full flex-col items-start gap-1.5">
                        <Label htmlFor="description">Description of link</Label>
                        <Input
                          placeholder="Insert description of your link here..."
                          id="description"
                          {...register("description")}
                        />
                        <p className="text-sm text-red-500">
                          {errors.description && (
                            <>{errors.description.message}</>
                          )}
                        </p>
                      </div>
                      <div className="mb-4 flex w-full flex-col items-start gap-1.5">
                        <Label htmlFor="tags">Tags</Label>
                        <Input
                          type="text"
                          id="tags"
                          placeholder="Enter a tags ..."
                          {...register("tags")}
                        />
                        <p className="text-sm font-medium text-slate-500">
                          Please separate tags with{" "}
                          <span className="text-slate-700 dark:text-slate-300">
                            ,
                          </span>
                        </p>
                        <p className="text-sm text-red-500">
                          {errors.tags && <>{errors.tags.message}</>}
                        </p>
                      </div>

                      {isError && (
                        <p className="pt-4 text-sm font-bold text-red-500">
                          An error has occurred, please try again later.
                        </p>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <button
                      className={cn(
                        "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                      )}
                      disabled={isLoading}
                      onClick={!isLoading ? handleSubmit(onSubmit) : undefined}
                    >
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Edit
                    </button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>{" "}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="h-10 w-10 rounded-full p-0"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to delete this link ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action is irreversible, please reflect beforehand.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <button
                      className={cn(
                        "inline-flex h-10 items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-600 dark:hover:bg-slate-200 dark:hover:text-slate-900 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                      )}
                      disabled={isLoadingDelete}
                      onClick={
                        !isLoadingDelete ? handleDeleteDocument : undefined
                      }
                    >
                      {isLoadingDelete ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Trash className="mr-2 h-4 w-4" />
                      )}
                      Delete
                    </button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </PopoverContent>
        </Popover>
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
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="absolute right-2 top-2 z-30 h-10 w-10 rounded-full bg-white p-0 dark:bg-slate-700"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit">
          <div className="flex w-full items-center justify-end gap-2">
            <AlertDialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 w-10 rounded-full p-0"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="scrollbar-hide max-h-[640px] overflow-hidden overflow-y-auto">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-slate-100">
                      Edit a link
                    </h3>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    <div className="mb-4 flex w-full flex-col items-start gap-1.5">
                      <Label htmlFor="link">Insert your link</Label>
                      <Input
                        placeholder="Insert your link here..."
                        id="link"
                        {...register("link")}
                      />
                      <p className="text-sm text-red-500">
                        {errors.link && <>{errors.link.message}</>}
                      </p>
                    </div>
                    <div className="mb-4 flex w-full flex-col items-start gap-1.5">
                      <Label htmlFor="description">Description of link</Label>
                      <Input
                        placeholder="Insert description of your link here..."
                        id="description"
                        {...register("description")}
                      />
                      <p className="text-sm text-red-500">
                        {errors.description && (
                          <>{errors.description.message}</>
                        )}
                      </p>
                    </div>
                    <div className="mb-4 flex w-full flex-col items-start gap-1.5">
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        type="text"
                        id="tags"
                        placeholder="Enter a tags ..."
                        {...register("tags")}
                      />
                      <p className="text-sm font-medium text-slate-500">
                        Please separate tags with{" "}
                        <span className="text-slate-700 dark:text-slate-300">
                          ,
                        </span>
                      </p>
                      <p className="text-sm text-red-500">
                        {errors.tags && <>{errors.tags.message}</>}
                      </p>
                    </div>

                    {isError && (
                      <p className="pt-4 text-sm font-bold text-red-500">
                        An error has occurred, please try again later.
                      </p>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <button
                    className={cn(
                      "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                    )}
                    disabled={isLoading}
                    onClick={!isLoading ? handleSubmit(onSubmit) : undefined}
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Edit
                  </button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>{" "}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="h-10 w-10 rounded-full p-0"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete this link ?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action is irreversible, please reflect beforehand.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <button
                    className={cn(
                      "inline-flex h-10 items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-600 dark:hover:bg-slate-200 dark:hover:text-slate-900 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                    )}
                    disabled={isLoadingDelete}
                    onClick={
                      !isLoadingDelete ? handleDeleteDocument : undefined
                    }
                  >
                    {isLoadingDelete ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="mr-2 h-4 w-4" />
                    )}
                    Delete
                  </button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
