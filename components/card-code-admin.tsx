"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLoign } from "@/firebase/auth/githubLogin"
import { useDeleteDocument } from "@/firebase/firestore/deleteDocument"
import { useDocument } from "@/firebase/firestore/getDocument"
import { useUpdateCodeDocument } from "@/firebase/firestore/updateCodeDocument"
import copyToClipboard from "@/utils/copyToClipboard"
import highlight from "@/utils/highlight"
import linearizeCode from "@/utils/linearizeCode"
import { yupResolver } from "@hookform/resolvers/yup"
import { Copy, Edit, Loader2, Settings2, Share, Trash } from "lucide-react"

import { cn } from "@/lib/utils"
import Loader from "@/components/loader"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import "prism-themes/themes/prism-one-dark.min.css"
import { useForm } from "react-hook-form"
import toast, { Toaster } from "react-hot-toast"
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share"
import * as yup from "yup"

export default function CardCodeAdmin({
  id,
  idAuthor,
  language,
  code,
  description,
  tags,
  favoris: favorisInit,
  isPrivate,
}) {
  const notifyCodeCopied = () => toast.success("Code copied to clipboard")
  const notifyUrlCopied = () => toast.success("Url of code copied to clipboard")
  const notifyCodeAdded = () =>
    toast.success("Your code has been added successfully !")
  const { user } = useAuthContext()
  const pseudo = user?.reloadUserInfo.screenName
  const { login, isPending } = useGitHubLoign()

  const shareUrl = `https://sharuco.lndev.me/code-preview/${id}`

  const {
    data: dataCode,
    isLoading: isLoadingCode,
    isError: isErrorCode,
  } = useDocument(id, "codes")

  //

  const {
    deleteDocument,
    isLoading: isLoadingDD,
    isError: isErrorDD,
    isSuccess: isSuccessDD,
  }: any = useDeleteDocument("codes")

  const handleDeleteDocument = () => {
    deleteDocument(id)
  }

  //
  const [checkboxOn, setCheckboxOn] = useState(false)

  const schema = yup.object().shape({
    code: yup.string().required(),
    description: yup.string().required(),
    language: yup.string().required(),
    tags: yup.string(),
    isPrivate: yup.boolean(),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const { updateDocument, isLoading, isError, isSuccess }: any =
    useUpdateCodeDocument("codes")

  const onSubmit = async (data) => {
    const { code, description, language, tags, isPrivate } = data
    const linearCode = linearizeCode(code)
    const now = Date.now()
    const tabTabs = tags ? tags.split(",") : []
    if (tabTabs[tabTabs.length - 1] === "") {
      tabTabs.pop()
    }

    const updatedData = {
      code: linearCode,
      description: description,
      isPrivate: !!isPrivate,
      language: language,
      tags: tabTabs,
    }

    updateDocument({ id, updatedData })

    reset({
      code: "",
      description: "",
      language: "",
      tags: "",
      isPrivate: false,
    })
    setCheckboxOn(false)
  }

  useEffect(() => {
    if (isSuccess) {
      notifyCodeAdded()
    }
  }, [isSuccess])

  //

  const {
    data: dataUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useDocument(idAuthor, "users")

  return (
    <div key={id} className="flex flex-col gap-2">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex items-center justify-between">
        <Button
          variant="subtle"
          onClick={() => {
            copyToClipboard(code)
            notifyCodeCopied()
          }}
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy code
        </Button>
        <div className="flex items-center justify-start gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="w-10 p-0">
                <Settings2 className="h-4 w-4" />
                <span className="sr-only">Open settings</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">
                      Edit
                      <Edit className="ml-2 h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  {/* <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                          Edit a code
                        </h3>
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        <div className="mb-4 flex w-full flex-col items-start gap-1.5">
                          <Label htmlFor="code">Edit your code</Label>
                          <Textarea
                            placeholder="Insert your code here..."
                            id="code"
                            value={dataCode?.data?.code}
                            {...register("code")}
                          />
                          {errors.code && (
                            <p className="text-sm text-red-500">
                              This field is required
                            </p>
                          )}
                        </div>
                        <div className="mb-4 flex w-full flex-col items-start gap-1.5">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            placeholder="What does this code do ?"
                            id="description"
                            value={dataCode?.data?.description}
                            {...register("description")}
                          />
                          {errors.description && (
                            <p className="text-sm text-red-500">
                              This field is required
                            </p>
                          )}
                        </div>
                        <div className="mb-4 flex w-full flex-col items-start gap-1.5">
                          <Label htmlFor="language">Language</Label>
                          <Input
                            type="text"
                            id="language"
                            placeholder="The code is written in what language ?"
                            value={dataCode?.data?.language}
                            {...register("language")}
                          />
                          {errors.language && (
                            <p className="text-sm text-red-500">
                              This field is required
                            </p>
                          )}
                        </div>
                        <div className="mb-4 flex w-full flex-col items-start gap-1.5">
                          <Label htmlFor="tags">Tags</Label>
                          <Input
                            type="text"
                            id="tags"
                            placeholder="Enter a tags ..."
                            value={dataCode?.data?.tags}
                            {...register("tags")}
                          />
                          <p className="text-sm text-slate-500">
                            Please separate tags with{" "}
                            <span className="text-slate-700 dark:text-slate-300">
                              ,
                            </span>
                          </p>
                          {errors.tags && (
                            <p className="text-sm text-red-500">
                              This field is required
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            {...register("isPrivate")}
                            value={dataCode?.data?.isPrivate}
                            name="isPrivate"
                            id="isPrivate"
                            className={`h-[24px] w-[24px] cursor-pointer appearance-none rounded-full bg-slate-200 outline-none ring-slate-500
                       ring-offset-0 focus:ring-slate-400 focus:ring-offset-slate-900 dark:bg-slate-800
                      ${checkboxOn ? "ring-2" : "ring-0"}
                      `}
                            checked={checkboxOn}
                            onChange={() => setCheckboxOn(!checkboxOn)}
                          />
                          <Label htmlFor="isPrivate">
                            Will this code be private ?{" "}
                            {checkboxOn ? (
                              <span className="font-bold text-teal-300">
                                Yes
                              </span>
                            ) : (
                              <span className="font-bold text-teal-300">
                                No
                              </span>
                            )}
                          </Label>
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
                        onClick={
                          !isLoading ? handleSubmit(onSubmit) : undefined
                        }
                      >
                        {isLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Submit
                      </button>
                    </AlertDialogFooter>
                  </AlertDialogContent> */}
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Edit a code is not available yet.
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>{" "}
                      <a
                        href="mailto:sharuco@leonelngoya.com"
                        className={cn(
                          "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 py-2 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                        )}
                      >
                        Contact us
                      </a>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>{" "}
                {!isPrivate && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button>
                        Share
                        <Share className="ml-2 h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Share this code on your social networks.
                        </AlertDialogTitle>
                      </AlertDialogHeader>
                      <div className="flex gap-2">
                        <FacebookShareButton
                          url={shareUrl}
                          quote={`I discovered this code on sharuco.lndev.me and found it useful, I share it with you here`}
                        >
                          <FacebookIcon size={38} round />
                        </FacebookShareButton>
                        <TwitterShareButton
                          url={shareUrl}
                          title={`I discovered this code on sharuco.lndev.me and found it useful, I share it with you here.`}
                          hashtags={["CaParleDev", "ShareWithSharuco"]}
                        >
                          <TwitterIcon size={38} round />
                        </TwitterShareButton>
                        <LinkedinShareButton
                          url={shareUrl}
                          title={`I discovered this code on sharuco.lndev.me and found it useful, I share it with you here. #CaParleDev`}
                          source="https://sharuco.lndev.me"
                        >
                          <LinkedinIcon size={38} round />
                        </LinkedinShareButton>
                        <EmailShareButton
                          url={shareUrl}
                          subject={`Share code on sharuco.lndev.me`}
                          body={`I discovered this code on sharuco.lndev.me and found it useful, I share it with you here. #CaParleDev`}
                        >
                          <EmailIcon size={38} round />
                        </EmailShareButton>
                        <WhatsappShareButton
                          url={shareUrl}
                          title={`I discovered this code on sharuco.lndev.me and found it useful, I share it with you here. #CaParleDev`}
                        >
                          <WhatsappIcon size={38} round />
                        </WhatsappShareButton>
                        <TelegramShareButton
                          url={shareUrl}
                          title={`I discovered this code on sharuco.lndev.me and found it useful, I share it with you here. #CaParleDev`}
                        >
                          <TelegramIcon size={38} round />
                        </TelegramShareButton>
                        <Button
                          variant="subtle"
                          className="h-10 w-10 rounded-full p-0"
                          onClick={() => {
                            copyToClipboard(shareUrl)
                            notifyUrlCopied()
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      Delete
                      <Trash className="ml-2 h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {/* Are you sure you want to delete this code ? */}
                        Delete code is not yet available.
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <a
                        href="mailto:sharuco@leonelngoya.com"
                        className={cn(
                          "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 py-2 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                        )}
                      >
                        Contact us
                      </a>
                      {/* <button
                        className={cn(
                          "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 py-2 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                        )}
                        disabled={isLoadingDD}
                        onClick={
                          !isLoadingDD ? handleDeleteDocument : undefined
                        }
                      >
                        {isLoadingDD && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Delete
                      </button> */}
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg bg-slate-900 dark:bg-black">
        <pre className="max-h-[480px] w-auto overflow-auto rounded-lg border border-slate-600 bg-slate-900 p-4 dark:bg-black">
          <code
            className="text-white"
            dangerouslySetInnerHTML={{
              __html: highlight(code, language),
            }}
          />
        </pre>
      </div>
      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/${idAuthor}`}
          className="flex items-center justify-start gap-2"
        >
          <Avatar className="h-8 w-8 cursor-pointer">
            {isLoadingUser && (
              <AvatarFallback>
                <Loader />
              </AvatarFallback>
            )}
            {dataUser && dataUser.exists && (
              <>
                <AvatarImage
                  src={dataUser.data.photoURL}
                  alt={dataUser.data.displayName}
                />
                <AvatarFallback>
                  {dataUser.data.displayName.split(" ")[1] === undefined
                    ? dataUser.data.displayName.split(" ")[0][0] +
                      dataUser.data.displayName.split(" ")[0][1]
                    : dataUser.data.displayName.split(" ")[0][0] +
                      dataUser.data.displayName.split(" ")[1][0]}
                </AvatarFallback>
              </>
            )}
          </Avatar>
          <span className="text-md font-bold text-slate-700 hover:underline dark:text-slate-400 ">
            {idAuthor}
          </span>
        </Link>
        <span className="p-2 text-sm font-bold italic text-slate-700 dark:text-slate-400">
          {language}
        </span>
      </div>
      <p className="text-sm text-slate-700 dark:text-slate-400">
        {description}
      </p>
      {tags && tags.length > 0 && (
        <div className="mb-4 flex items-center justify-start gap-2">
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
