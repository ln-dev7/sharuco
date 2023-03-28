"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLoign } from "@/firebase/auth/githubLogin"
import { useDeleteDocument } from "@/firebase/firestore/deleteDocument"
import { useDocument } from "@/firebase/firestore/getDocument"
import { useUpdateCodeDocument } from "@/firebase/firestore/updateCodeDocument"
import copyToClipboard from "@/utils/copyToClipboard"
import highlight from "@/utils/highlight"
import indentCode from "@/utils/indentCode"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function CardCodeAdmin({
  id,
  idAuthor,
  language,
  code,
  description,
  tags,
  favoris: favorisInit,
  isPrivate,
  comments: commentsInit,
}) {
  const notifyCodeCopied = () => toast.success("Code copied to clipboard")
  const notifyUrlCopied = () => toast.success("Url of code copied to clipboard")

  const searchParams = useSearchParams()

  const { user } = useAuthContext()
  const pseudo = user?.reloadUserInfo.screenName
  const { login, isPending } = useGitHubLoign()

  const shareUrl = `https://sharuco.lndev.me/code-preview/${id}`

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
  const [checkboxOn, setCheckboxOn] = useState(isPrivate)

  const schema = yup.object().shape({
    code: yup.string().required(),
    description: yup.string().required(),
    language: yup
      .string()
      .matches(/^[a-zA-Z]+$/, "The language field should only contain letters")
      .required(),
    tags: yup
      .string()
      .test(
        "tags",
        "The tags field must contain only letters, commas and/or spaces",
        (val) => !val || /^[a-zA-Z, ]*$/.test(val)
      ),
    isPrivate: yup.boolean(),
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
    setValue("code", indentCode(code))
    setValue("description", description)
    setValue("language", language)
    setValue("tags", tags.join().trim().replace(/\s+/g, ""))
    setValue("isPrivate", checkboxOn)
  }, [code, description, language, tags, checkboxOn, setValue])

  const { updateCodeDocument, isLoading, isError, isSuccess }: any =
    useUpdateCodeDocument("codes")

  const onSubmit = async (data) => {
    const {
      code: codeUpdate,
      description: descriptionUpdate,
      language: languageUpdate,
      tags: tagsUpdate,
      isPrivate: isPrivateUpdate,
    } = data

    const linearCode = linearizeCode(codeUpdate)
    const tabTabs = tagsUpdate
      ? tagsUpdate.split(",").map((word) => word.trim().toLowerCase())
      : []
    if (tabTabs[tabTabs.length - 1] === "") {
      tabTabs.pop()
    }

    if (
      linearCode === code &&
      descriptionUpdate === description &&
      languageUpdate === language &&
      tagsUpdate === tags.join(",") &&
      isPrivateUpdate === isPrivate
    ) {
      toast.error("You have not made any changes")
      return
    }

    let updatedCodeData: {
      code: string
      description: string
      isPrivate: boolean
      language: string
      tags: string[]
      favoris?: string[]
      comments?: any[]
    } = {
      code: linearCode,
      description: descriptionUpdate,
      isPrivate: !!isPrivateUpdate,
      language: languageUpdate.toLowerCase(),
      tags: tabTabs,
      favoris:
        isPrivateUpdate === true && isPrivate === false ? [] : favorisInit,
      comments:
        isPrivateUpdate === true && isPrivate === false ? [] : commentsInit,
    }

    updateCodeDocument({ id, updatedCodeData })

    reset({
      code: indentCode(linearCode),
      description: descriptionUpdate,
      language: languageUpdate,
      tags: tagsUpdate,
      isPrivate: isPrivateUpdate,
    })
    setCheckboxOn(isPrivateUpdate)
    toast.success("Your code has been updated successfully !")
  }

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
                  <AlertDialogContent className="scrollbar-hide max-h-[640px] overflow-hidden overflow-y-auto">
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
                            {...register("code")}
                          />
                          <p className="text-sm text-red-500">
                            {errors.code && <>{errors.code.message}</>}
                          </p>
                        </div>
                        <div className="mb-4 flex w-full flex-col items-start gap-1.5">
                          <Label htmlFor="description">Edit escription</Label>
                          <Textarea
                            placeholder="What does this code do ?"
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
                          <Label htmlFor="language">Edit language</Label>
                          <Input
                            type="text"
                            id="language"
                            placeholder="The code is written in what language ?"
                            {...register("language")}
                          />
                          <p className="text-md font-medium text-slate-500">
                            please enter only one language
                          </p>
                          <p className="text-sm text-red-500">
                            {errors.language && <>{errors.language.message}</>}
                          </p>
                        </div>
                        <div className="mb-4 flex w-full flex-col items-start gap-1.5">
                          <Label htmlFor="tags">Edit tags</Label>
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
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            {...register("isPrivate")}
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
                        <div
                          className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-gray-800 dark:text-red-400"
                          role="alert"
                        >
                          <span className="font-semibold">Warning alert !</span>{" "}
                          If you change your code from public to private, you
                          will lose all the favourites and comments of this code
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
                          quote={`I discovered this code on sharuco.lndev.me , I share it with you here. - « ${description} » #CaParleDev #ShareWithSharuco`}
                        >
                          <FacebookIcon size={38} round />
                        </FacebookShareButton>
                        <TwitterShareButton
                          url={shareUrl}
                          title={`I discovered this code on @sharuco_app , I share it with you here. - « ${description} »`}
                          hashtags={["CaParleDev", "ShareWithSharuco"]}
                        >
                          <TwitterIcon size={38} round />
                        </TwitterShareButton>
                        <LinkedinShareButton
                          url={shareUrl}
                          title={`I discovered this code on sharuco.lndev.me , I share it with you here. - « ${description} » #CaParleDev #ShareWithSharuco`}
                          source="https://sharuco.lndev.me"
                        >
                          <LinkedinIcon size={38} round />
                        </LinkedinShareButton>
                        <EmailShareButton
                          url={shareUrl}
                          subject={`Share code on sharuco.lndev.me`}
                          body={`I discovered this code on sharuco.lndev.me , I share it with you here. - « ${description} » #CaParleDev #ShareWithSharuco`}
                        >
                          <EmailIcon size={38} round />
                        </EmailShareButton>
                        <WhatsappShareButton
                          url={shareUrl}
                          title={`I discovered this code on sharuco.lndev.me , I share it with you here. - « ${description} » #CaParleDev #ShareWithSharuco`}
                        >
                          <WhatsappIcon size={38} round />
                        </WhatsappShareButton>
                        <TelegramShareButton
                          url={shareUrl}
                          title={`I discovered this code on sharuco.lndev.me , I share it with you here. - « ${description} » #CaParleDev #ShareWithSharuco`}
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
                        Are you sure you want to delete this code ?
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <button
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
                      </button>
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
      <div className="mb-4 flex items-center justify-between gap-2">
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
        {searchParams.get("code-preview") === null && !isPrivate && (
          <div className="shrink-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/code-preview/${id}`}
                    className="flex gap-1 text-slate-700 dark:text-slate-400"
                  >
                    {commentsInit.length}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                      />
                    </svg>

                    <span className="sr-only">Add or view</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add or View comments</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  )
}
