"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import { useDeleteDocument } from "@/firebase/firestore/deleteDocument"
import { useUpdateLinkDocument } from "@/firebase/firestore/updateLinkDocument"
import copyToClipboard from "@/utils/copyToClipboard"
import { yupResolver } from "@hookform/resolvers/yup"
import algoliasearch from "algoliasearch"
import { Edit, Loader2, Pencil, Trash } from "lucide-react"
import { useForm } from "react-hook-form"
import * as yup from "yup"

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
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export default function CardCodeAdmin({
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

  return (
    <div key={id} className="mb-0 flex flex-col gap-2">
      <div className="flex w-full items-center justify-end gap-2">
        <AlertDialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="h-10 w-10 p-0 rounded-full">
              <Pencil className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-h-[640px] overflow-hidden overflow-y-auto scrollbar-hide">
            <AlertDialogHeader>
              <AlertDialogTitle>
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
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
                    {errors.description && <>{errors.description.message}</>}
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
                  "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 py-2 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                )}
                disabled={isLoading}
                onClick={!isLoading ? handleSubmit(onSubmit) : undefined}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Edit
              </button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>{" "}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="h-10 w-10 p-0 rounded-full"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete this link ?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <button
                className={cn(
                  "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 py-2 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                )}
                disabled={isLoadingDelete}
                onClick={!isLoadingDelete ? handleDeleteDocument : undefined}
              >
                {isLoadingDelete && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Delete
              </button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div>
        <div className="flex w-full items-center justify-between"></div>
      </div>
      <div className="w-full items-center justify-center p-2">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
      <Link
        className={buttonVariants({
          size: "sm",
          variant: "default",
          className: "text-slate-700 dark:text-slate-400",
        })}
        href={link}
      >
        Go to link
      </Link>
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
  )
}
