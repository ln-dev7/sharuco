"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLogout } from "@/firebase/auth/githubLogout"
import { useDocument } from "@/firebase/firestore/getDocument"
import { useDocuments } from "@/firebase/firestore/getDocuments"
import { useGetFavoriteCode } from "@/firebase/firestore/getFavoriteCode"
import { useGetIsPrivateCodeFromUser } from "@/firebase/firestore/getIsPrivateCodeFromUser"
import { useGetIsPrivateCodes } from "@/firebase/firestore/getIsPrivateCodes"
import copyToClipboard from "@/utils/copyToClipboard"
import delinearizeCode from "@/utils/delinearizeCode"
import highlight from "@/utils/highlight"
import indentCode from "@/utils/indentCode"
import {
  Copy,
  Edit,
  Eye,
  EyeOff,
  Github,
  Loader2,
  MoreHorizontal,
  Plus,
  Settings2,
  Share,
  Star,
  Trash,
  User,
} from "lucide-react"
import moment from "moment"
import Prism from "prismjs"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import { cn } from "@/lib/utils"
import CardCode from "@/components/card-code"
import Error from "@/components/error"
import { Layout } from "@/components/layout"
import Loader from "@/components/loader"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ToastAction } from "@/components/ui/toast"
import "prism-themes/themes/prism-one-dark.min.css"
import { useGitHubLoign } from "@/firebase/auth/githubLogin"
import { useDeleteDocument } from "@/firebase/firestore/deleteDocument"
import { useUpdateDocument } from "@/firebase/firestore/updateDocument"
import linearizeCode from "@/utils/linearizeCode"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import toast, { Toaster } from "react-hot-toast"
import { useQuery } from "react-query"
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

import { siteConfig } from "@/config/site"

export default function CardCodeAdmin({
  id,
  idAuthor,
  language,
  code,
  description,
  tags,
  favoris: favorisInit,
}) {
  const notifyCodeCopied = () => toast.success("Code copied to clipboard")
  const notifyUrlCopied = () => toast.success("Url of code copied to clipboard")
  const notifyCodeAdded = () =>
    toast.success("Your code has been added successfully !")
  const { user } = useAuthContext()
  const { login, isPending } = useGitHubLoign()

  const shareUrl = `https://shacuro.lndev.me/code-preview/${id}`

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
    useUpdateDocument("codes")

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

  const {
    data: dataCodes,
    isLoading: isLoadingCodes,
    isError: isErrorCodes,
  } = useDocument(id, "codes")

  const {
    updateDocument: updateDocumentFavoris,
    isLoading: isLoadingAddFavoris,
    isError: isErrorAddFavoris,
    isSuccess: isSuccessAddFavoris,
    error: errorAddFavoris,
  }: any = useUpdateDocument("codes")

  const addCodeOnFavoris = async (id: string) => {
    const updatedData = {
      favoris:
        favorisInit?.includes(user.reloadUserInfo.screenName) ?? false
          ? favorisInit.filter(
              (idUser: string) => idUser !== user.reloadUserInfo.screenName
            )
          : [...favorisInit, user.reloadUserInfo.screenName],
    }

    updateDocumentFavoris({ id, updatedData })
  }

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
          <Button onClick={() => addCodeOnFavoris(id)}>
            {isLoadingAddFavoris ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                {user &&
                favorisInit.includes(user.reloadUserInfo.screenName) ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#F9197F"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="#F9197F"
                    className="mr-2 h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                  </svg>
                ) : (
                  <Star className="mr-2 h-4 w-4" />
                )}
                {favorisInit.length}
              </>
            )}
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-10 p-0">
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
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                          Edit snippet
                        </h3>
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        <div className="mb-4 flex w-full flex-col items-start gap-1.5">
                          <Label htmlFor="code">Insert your code</Label>
                          <Textarea
                            placeholder="Insert your code here..."
                            id="code"
                          />
                        </div>
                        <div className="mb-4 flex w-full flex-col items-start gap-1.5">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            placeholder="What does this code do ?"
                            id="description"
                          />
                        </div>
                        <div className="mb-4 flex w-full flex-col items-start gap-1.5">
                          <Label htmlFor="language">Language</Label>
                          <Select>
                            <SelectTrigger className="w-full" id="language">
                              <SelectValue placeholder="What language is the code written in ?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="bash">Bash</SelectItem>
                              <SelectItem value="c">C</SelectItem>
                              <SelectItem value="csharp">C#</SelectItem>
                              <SelectItem value="cpp">C++</SelectItem>
                              <SelectItem value="css">CSS</SelectItem>
                              <SelectItem value="docker">Docker</SelectItem>
                              <SelectItem value="go">Go</SelectItem>
                              <SelectItem value="html">HTML</SelectItem>
                              <SelectItem value="java">Java</SelectItem>
                              <SelectItem value="javascript">
                                Javascript
                              </SelectItem>
                              <SelectItem value="json">JSON</SelectItem>
                              <SelectItem value="kotlin">Kotlin</SelectItem>
                              <SelectItem value="markdown">Markdown</SelectItem>
                              <SelectItem value="php">PHP</SelectItem>
                              <SelectItem value="python">Python</SelectItem>
                              <SelectItem value="sql">SQL</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="mb-4 flex w-full flex-col items-start gap-1.5">
                          <Label htmlFor="tags">Tags</Label>
                          <Input type="text" id="tags" placeholder="" />
                          <p className="text-sm text-slate-500">
                            Please separate tags with{" "}
                            <span className="text-slate-700 dark:text-slate-300">
                              ,
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Switch id="isPrivate" />
                          <Label htmlFor="isPrivate">
                            Will this code be private ?
                          </Label>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <button
                        className={cn(
                          "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 py-2 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                        )}
                        // disabled={isPending}
                        // onClick={login}
                      >
                        {/* {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Github className="mr-2 h-4 w-4" />
                )} */}
                        Save
                      </button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>{" "}
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
                        quote={`I discovered this code on shacuro.lndev.me and found it useful, I share it with you here`}
                      >
                        <FacebookIcon size={38} round />
                      </FacebookShareButton>
                      <TwitterShareButton
                        url={shareUrl}
                        title={`I discovered this code on shacuro.lndev.me and found it useful, I share it with you here.`}
                        hashtags={["CaParleDev", "ShareWithSharuco"]}
                      >
                        <TwitterIcon size={38} round />
                      </TwitterShareButton>
                      <LinkedinShareButton
                        url={shareUrl}
                        title={`I discovered this code on shacuro.lndev.me and found it useful, I share it with you here. #CaParleDev`}
                        source="https://shacuro.lndev.me"
                      >
                        <LinkedinIcon size={38} round />
                      </LinkedinShareButton>
                      <EmailShareButton
                        url={shareUrl}
                        subject={`Share code on shacuro.lndev.me`}
                        body={`I discovered this code on shacuro.lndev.me and found it useful, I share it with you here. #CaParleDev`}
                      >
                        <EmailIcon size={38} round />
                      </EmailShareButton>
                      <WhatsappShareButton
                        url={shareUrl}
                        title={`I discovered this code on shacuro.lndev.me and found it useful, I share it with you here. #CaParleDev`}
                      >
                        <WhatsappIcon size={38} round />
                      </WhatsappShareButton>
                      <TelegramShareButton
                        url={shareUrl}
                        title={`I discovered this code on shacuro.lndev.me and found it useful, I share it with you here. #CaParleDev`}
                      >
                        <TelegramIcon size={38} round />
                      </TelegramShareButton>
                      <Button
                        variant="subtle"
                        className="h-12 w-12 rounded-full"
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
      <div className="overflow-hidden rounded-lg">
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
