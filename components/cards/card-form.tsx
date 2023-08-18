"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import { useDeleteDocument } from "@/firebase/firestore/deleteDocument"
import { useUpdateFormDocument } from "@/firebase/firestore/updateFormDocument"
import copyToClipboard from "@/utils/copyToClipboard"
import formatDateTime from "@/utils/formatDateTime"
import { yupResolver } from "@hookform/resolvers/yup"
import algoliasearch from "algoliasearch"
import axios from "axios"
import {
  Loader2,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Timer,
  Trash,
  XCircle,
} from "lucide-react"
import moment from "moment"
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
import { Textarea } from "@/components/ui/textarea"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import EmptyCard from "./../empty-card"
import { Skeleton } from "./../ui/skeleton"

export default function CardForm({
  id,
  idAuthor,
  createdAt,
  name,
  description,
  color,
  responses,
}) {
  const { toast } = useToast()

  const [openEditDialog, setOpenEditDialog] = useState(false)

  //

  const ALGOLIA_INDEX_NAME = "forms"

  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_KEY
  )
  const index = client.initIndex(ALGOLIA_INDEX_NAME)

  const { deleteDocument, isLoading: isLoadingDelete }: any =
    useDeleteDocument("forms")

  const handleDeleteDocument = () => {
    deleteDocument(id)
    index.deleteObject(id)
  }

  const schema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string().required(),
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
    setValue("name", name)
    setValue("description", description)
  }, [name, description, setValue])

  const { updateFormDocument, isLoading, isError, isSuccess }: any =
    useUpdateFormDocument("forms")

  const onSubmit = async (data) => {
    const { name: nameUpdate, description: descriptionUpdate } = data

    if (nameUpdate === name && descriptionUpdate === description) {
      toast({
        variant: "destructive",
        title: "You have not made any changes",
        description: "Please make changes to update your form",
        action: <ToastAction altText="Okay">Okay</ToastAction>,
      })
      return
    }

    let updatedFormData: {
      name: string
      description: string
    } = {
      name: nameUpdate,
      description: descriptionUpdate,
    }

    await updateFormDocument({ id, updatedFormData })

    await index.partialUpdateObject({
      objectID: id,
      name: nameUpdate,
      description: descriptionUpdate,
    })

    reset({
      name: nameUpdate,
      description: descriptionUpdate,
    })

    setOpenEditDialog(false)
    toast({
      title: "Your form has been updated successfully !",
      action: <ToastAction altText="Okay">Okay</ToastAction>,
    })
  }

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
      key={id}
    >
      <div
        className={`absolute inset-x-0 top-0 h-3 w-full`}
        style={{
          background: `${color}`,
        }}
      ></div>
      <Link href={`/form/${id}`} className="flex flex-col items-start p-4">
        <h5 className="my-4 mr-8 line-clamp-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          {name}
        </h5>
        <p className="text-md mb-3 line-clamp-3 font-normal text-slate-700 dark:text-slate-400">
          {description}
        </p>
        <div className="mt-4 flex w-full items-center justify-between gap-2">
          <span className="flex items-center gap-1 text-slate-700 dark:text-slate-400">
            <Timer className="mr-1.5 h-4 w-4" />
            <span className="text-sm font-medium">
              {formatDateTime(moment(createdAt))}
            </span>
          </span>
          <span className="flex items-center gap-1 text-slate-700 dark:text-slate-400">
            <MessageSquare className="mr-1.5 h-4 w-4" />
            <span className="text-sm font-medium">
              {responses.length} response{responses > 1 && "s"}
            </span>
          </span>
        </div>
      </Link>
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
                      Edit a form
                    </h3>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    <div className="mb-4 flex w-full flex-col items-start gap-1.5">
                      <Label htmlFor="name">Insert name</Label>
                      <Input
                        placeholder="Insert name of your form here..."
                        id="name"
                        {...register("name")}
                      />
                      <p className="text-sm text-red-500">
                        {errors.name && <>{errors.name.message}</>}
                      </p>
                    </div>
                    <div className="flex w-full flex-col items-start gap-1.5">
                      <Label htmlFor="description">Description of form</Label>
                      <Textarea
                        placeholder="Insert description of your form..."
                        id="description"
                        className="h-24"
                        {...register("description")}
                      />
                      <p className="text-sm text-red-500">
                        {errors.description && (
                          <>{errors.description.message}</>
                        )}
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
                    Are you sure you want to delete this form ?
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
