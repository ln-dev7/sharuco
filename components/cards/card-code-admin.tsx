"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  allLanguages,
  getLanguageColor,
  languagesName,
} from "@/constants/languages"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLogin } from "@/firebase/auth/githubLogin"
import { useDeleteDocument } from "@/firebase/firestore/deleteDocument"
import { useDocument } from "@/firebase/firestore/getDocument"
import { useUpdateCodeDocument } from "@/firebase/firestore/updateCodeDocument"
import copyToClipboard from "@/utils/copyToClipboard"
import highlight from "@/utils/highlight"
import indentCode from "@/utils/indentCode"
import linearizeCode from "@/utils/linearizeCode"
import { yupResolver } from "@hookform/resolvers/yup"
import algoliasearch from "algoliasearch"
import hljs from "highlight.js"
import * as htmlToImage from "html-to-image"
import {
  Copy,
  Edit,
  Heart,
  Loader2,
  Save,
  Share,
  Trash,
  Verified,
} from "lucide-react"
import { useForm } from "react-hook-form"
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

import { cn } from "@/lib/utils"
import Loader from "@/components/loaders/loader"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ToastAction } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"

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
  const { toast } = useToast()
  const notifyCodeCopied = () =>
    toast({
      title: "Code copied to clipboard",
      description: "You can paste it wherever you want",
      action: <ToastAction altText="Okay">Okay</ToastAction>,
    })
  const notifyUrlCopied = () =>
    toast({
      title: "Url of code copied to clipboard",
      description: "You can share it wherever you want",
      action: <ToastAction altText="Okay">Okay</ToastAction>,
    })

  const searchParams = useSearchParams()

  const { user } = useAuthContext()
  const pseudo = user?.reloadUserInfo.screenName.toLowerCase()
  const { login, isPending } = useGitHubLogin()

  const shareUrl = `https://sharuco.lndev.me/code-preview/${id}`

  const [openShareDialog, setOpenShareDialog] = useState(false)

  const [openEditDialog, setOpenEditDialog] = useState(false)

  //

  const ALGOLIA_INDEX_NAME = "codes"

  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_KEY
  )
  const index = client.initIndex(ALGOLIA_INDEX_NAME)

  const { deleteDocument, isLoading: isLoadingDelete }: any =
    useDeleteDocument("codes")

  const handleDeleteDocument = () => {
    deleteDocument(id)
    index.deleteObject(id)
  }

  //
  const [checkboxOn, setCheckboxOn] = useState(isPrivate)

  const schema = yup.object().shape({
    code: yup.string().required(),
    description: yup.string().required(),
    language: yup.string().required(),
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
      toast({
        variant: "destructive",
        title: "You have not made any changes",
        description: "Please make changes to update your code",
        action: <ToastAction altText="Okay">Okay</ToastAction>,
      })
      return
    }

    let updatedCodeData: {
      code: string
      description: string
      isPrivate: boolean
      language: string
      tags: string[]
      favoris?: string[]
      favorisCount?: number
      comments?: any[]
    } = {
      code: linearCode,
      description: descriptionUpdate,
      isPrivate: !!isPrivateUpdate,
      language: languageUpdate.toLowerCase(),
      tags: tabTabs,
      favoris:
        isPrivateUpdate === true && isPrivate === false ? [] : favorisInit,
      favorisCount:
        isPrivateUpdate === true && isPrivate === false
          ? 0
          : favorisInit.length,
      comments:
        isPrivateUpdate === true && isPrivate === false ? [] : commentsInit,
    }

    await updateCodeDocument({ id, updatedCodeData })

    await index.partialUpdateObject({
      objectID: id,
      description: descriptionUpdate,
      isPrivate: !!isPrivateUpdate,
      language: languageUpdate.toLowerCase(),
      tags: tabTabs,
    })

    reset({
      code: indentCode(linearCode),
      description: descriptionUpdate,
      language: languageUpdate,
      tags: tagsUpdate,
      isPrivate: isPrivateUpdate,
    })
    setCheckboxOn(isPrivateUpdate)

    setOpenEditDialog(false)
    toast({
      title: "Your code has been updated successfully !",
      action: <ToastAction altText="Okay">Okay</ToastAction>,
    })
  }

  //

  const {
    data: dataUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useDocument(idAuthor, "users")

  const domRefImage = useRef(null)
  const [backgroundImage, setBackgroundImage] = useState(
    "bg-gradient-to-br from-blue-400 to-indigo-700"
  )

  const handleChangeBgImg1 = () => {
    setBackgroundImage("bg-gradient-to-br from-blue-400 to-indigo-700")
  }

  const handleChangeBgImg2 = () => {
    setBackgroundImage("bg-gradient-to-r from-pink-500 to-indigo-600")
  }

  const handleChangeBgImg3 = () => {
    setBackgroundImage("bg-gradient-to-br from-teal-400 to-green-500")
  }

  const handleChangeBgImg4 = () => {
    setBackgroundImage("bg-gradient-to-br from-yellow-300 to-orange-500")
  }
  const handleChangeBgImg5 = () => {
    setBackgroundImage("bg-gradient-to-br from-red-500 to-pink-600")
  }

  const [nameOfImage, setNameOfImage] = useState("")

  const downloadImage = async () => {
    const dataUrl = await htmlToImage.toPng(domRefImage.current)

    // download image
    const link = document.createElement("a")
    link.download = nameOfImage !== "" ? nameOfImage : `sharuco-code-${id}.png`
    link.href = dataUrl
    link.click()
  }

  function detectLanguage(code) {
    const language = hljs.highlightAuto(code).language
    return language || "text"
  }

  function handleCodeChange(code) {
    const detectedLanguage = detectLanguage(code)
    if (!languagesName.includes(detectedLanguage)) {
      setValue("language", "other")
      return
    }
    setValue("language", detectedLanguage)
  }

  return (
    <div key={id} className="mb-0 flex flex-col gap-2">
      <div className="flex w-full items-center justify-end">
        <div className="flex items-center gap-2">
          <AlertDialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                Edit
                <Edit className="ml-2 h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-h-[640px] overflow-hidden overflow-y-auto scrollbar-hide">
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
                      className="h-32"
                      onChange={(e) => {
                        handleCodeChange(e.target.value)
                      }}
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
                      {errors.description && <>{errors.description.message}</>}
                    </p>
                  </div>
                  <div className="mb-4 flex w-full flex-col items-start gap-1.5">
                    <Label htmlFor="language">Edit language</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                      name="language"
                      id="language"
                      {...register("language")}
                    >
                      <option value="" disabled selected>
                        {" "}
                        The code is written in what language ?
                      </option>
                      {allLanguages.map((language) => (
                        <option value={language.name.toLocaleLowerCase()}>
                          {language.name}
                        </option>
                      ))}
                    </select>
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
                  {searchParams.get("code-preview") === null && (
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
                          <span className="font-bold text-teal-300">Yes</span>
                        ) : (
                          <span className="font-bold text-teal-300">No</span>
                        )}
                      </Label>
                    </div>
                  )}
                  {searchParams.get("code-preview") === null && (
                    <div
                      className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-gray-800 dark:text-red-400"
                      role="alert"
                    >
                      <span className="font-semibold">Warning alert !</span> If
                      you change your code from public to private, you will lose
                      all the favourites and comments of this code
                    </div>
                  )}
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
                <AlertDialogDescription>
                  This action is irreversible, please reflect beforehand.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <button
                  className={cn(
                    "inline-flex h-10 items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-600 dark:hover:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                  )}
                  disabled={isLoadingDelete}
                  onClick={!isLoadingDelete ? handleDeleteDocument : undefined}
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
      </div>
      <div className="overflow-hidden rounded-lg bg-slate-900 dark:bg-black">
        <div className="flex items-center justify-between bg-[#343541] px-4 py-1">
          <span className="text-xs font-medium text-white">
            {language.toLowerCase()}
          </span>
          <div className="flex items-center gap-2">
            <span
              className="flex cursor-pointer items-center p-1 text-xs font-medium text-white"
              onClick={() => {
                copyToClipboard(code)
                notifyCodeCopied()
              }}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy code
            </span>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="cursor-pointer text-white">
                  <Save className="h-4 w-4 cursor-pointer" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="flex max-h-[640px] !w-auto !max-w-[1280px] flex-col items-center justify-start overflow-hidden overflow-y-auto scrollbar-hide">
                <AlertDialogFooter>
                  <AlertDialogCancel>Close</AlertDialogCancel>
                  <button
                    className={cn(
                      "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                    )}
                    onClick={downloadImage}
                  >
                    Download Image
                  </button>
                </AlertDialogFooter>
                <div className="flex w-full items-center justify-center gap-2">
                  <button
                    className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-700"
                    onClick={handleChangeBgImg1}
                  ></button>{" "}
                  <button
                    className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-indigo-600"
                    onClick={handleChangeBgImg2}
                  ></button>{" "}
                  <button
                    className="h-6 w-6 rounded-full bg-gradient-to-br from-teal-400 to-green-500"
                    onClick={handleChangeBgImg3}
                  ></button>
                  <button
                    className="h-6 w-6 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500"
                    onClick={handleChangeBgImg4}
                  ></button>
                  <button
                    className="h-6 w-6 rounded-full bg-gradient-to-br from-red-500 to-pink-600"
                    onClick={handleChangeBgImg5}
                  ></button>
                  <input
                    type="color"
                    className="h-8 w-8 cursor-pointer appearance-none rounded-full border-0 bg-transparent p-0"
                    value={backgroundImage}
                    onChange={(e) => {
                      setBackgroundImage(`${e.target.value}`)
                    }}
                  />
                </div>
                <div className="flex w-full items-center justify-center gap-2">
                  <Input
                    className="w-full"
                    type="text"
                    id="tags"
                    placeholder="Name of your image"
                    value={nameOfImage}
                    onChange={(e) => {
                      setNameOfImage(`${e.target.value}`)
                    }}
                  />
                </div>
                <div
                  ref={domRefImage}
                  className={`flex max-w-[1280px] flex-col items-center justify-center ${backgroundImage} p-8`}
                  style={{
                    backgroundColor: `${backgroundImage}`,
                  }}
                >
                  <h3 className="mb-2 text-center text-lg font-semibold text-white">
                    sharuco.lndev.me
                  </h3>
                  <div className="max-w-[1280px] overflow-hidden rounded-lg bg-slate-900 dark:bg-black">
                    <div className="flex items-center justify-between bg-[#343541] px-4 py-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`
                          flex h-4 w-4 items-center rounded-full p-1 text-xs font-medium text-white
                        `}
                          style={{
                            backgroundColor: `${
                              language !== "" && getLanguageColor(language)
                            }`,
                          }}
                        ></span>
                        <span className="text-xs font-medium text-white">
                          {language.toLowerCase()}
                        </span>
                      </div>
                      <span className="flex cursor-pointer items-center p-1 text-xs font-medium text-white">
                        @ {idAuthor}
                      </span>
                    </div>
                    <pre className="max-w-[1280px] rounded-lg rounded-t-none bg-slate-900 p-4 dark:bg-black">
                      <code
                        className="max-w-[1280px] text-white"
                        dangerouslySetInnerHTML={{
                          __html: highlight(code, language),
                        }}
                      />
                    </pre>
                  </div>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        {searchParams.get("code-preview") === null && !isPrivate ? (
          <Link href={`/code-preview/${id}`}>
            <pre className="max-h-[200px] w-auto overflow-auto rounded-lg rounded-t-none bg-slate-900 p-4 hover:bg-gray-900 dark:bg-black dark:hover:bg-zinc-900">
              <code
                className="text-white"
                dangerouslySetInnerHTML={{
                  __html: highlight(code, language),
                }}
              />
            </pre>
          </Link>
        ) : (
          <pre
            className={`${
              searchParams.get("code-preview") === null &&
              isPrivate &&
              "max-h-[200px] "
            }
          w-auto overflow-auto rounded-lg rounded-t-none bg-slate-900 p-4 dark:bg-black`}
          >
            <code
              className="text-white"
              dangerouslySetInnerHTML={{
                __html: highlight(code, language),
              }}
            />
          </pre>
        )}
      </div>
      <div className="flex items-center justify-between gap-4">
        <a
          href={dataUser && dataUser.exists ? `/user/${idAuthor}` : "#"}
          className="flex items-center justify-start gap-2"
        >
          <Avatar className="h-8 w-8 cursor-pointer">
            {isLoadingUser && (
              <AvatarFallback>
                <Loader />
              </AvatarFallback>
            )}
            {dataUser && dataUser.exists ? (
              <>
                <AvatarImage
                  src={dataUser.data.photoURL}
                  alt={
                    dataUser.data.displayName !== null
                      ? dataUser.data.displayName
                      : dataUser.data.pseudo
                  }
                />
                <AvatarFallback>
                  {dataUser.data.displayName !== null ? (
                    <>
                      {dataUser.data.displayName.split(" ")[1] === undefined
                        ? dataUser.data.displayName.split(" ")[0][0] +
                          dataUser.data.displayName.split(" ")[0][1]
                        : dataUser.data.displayName.split(" ")[0][0] +
                          dataUser.data.displayName.split(" ")[1][0]}
                    </>
                  ) : (
                    dataUser.data.pseudo[0] + dataUser.data.pseudo[1]
                  )}
                </AvatarFallback>
              </>
            ) : (
              <AvatarFallback>{idAuthor[0] + idAuthor[1]}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex items-center justify-start gap-1">
            <span className="text-md font-bold text-slate-700 hover:underline dark:text-slate-400 ">
              {idAuthor}{" "}
            </span>
            {dataUser && dataUser.exists && (
              <span>
                {dataUser.data.premium && (
                  <Verified className="h-4 w-4 text-green-500" />
                )}
              </span>
            )}
          </div>
        </a>
        <div className="flex shrink-0 items-center gap-4">
          {searchParams.get("code-preview") === null && !isPrivate && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/code-preview/${id}#commentsCode`}
                    className="flex gap-1 text-slate-700 hover:text-slate-500 dark:text-slate-400 hover:dark:text-white"
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
          )}
          {isPrivate ? null : (
            <div className="flex items-center text-slate-700 dark:text-slate-400 ">
              {user && favorisInit.includes(pseudo) ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#F9197F"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#F9197F"
                  className="mr-2 h-5 w-5"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              ) : (
                <Heart className="mr-2 h-5 w-5" />
              )}
              {favorisInit.length}
            </div>
          )}

          {!isPrivate && (
            <AlertDialog
              open={openShareDialog}
              onOpenChange={setOpenShareDialog}
            >
              <AlertDialogTrigger asChild>
                <span className="flex cursor-pointer items-center justify-center rounded-full p-1 text-slate-700 duration-200 hover:bg-[#1C9BEF] hover:text-white dark:text-slate-400 dark:hover:text-white">
                  <Share className="h-5 w-5" />
                </span>
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
                    onClick={() => setOpenShareDialog(false)}
                  >
                    <FacebookIcon size={38} round />
                  </FacebookShareButton>
                  <TwitterShareButton
                    url={shareUrl}
                    title={`I discovered this code on @sharuco_app , I share it with you here. - « ${description} »`}
                    hashtags={["CaParleDev", "ShareWithSharuco"]}
                    onClick={() => setOpenShareDialog(false)}
                  >
                    <TwitterIcon size={38} round />
                  </TwitterShareButton>
                  <LinkedinShareButton
                    url={shareUrl}
                    title={`I discovered this code on sharuco.lndev.me , I share it with you here. - « ${description} » #CaParleDev #ShareWithSharuco`}
                    source="https://sharuco.lndev.me"
                    onClick={() => setOpenShareDialog(false)}
                  >
                    <LinkedinIcon size={38} round />
                  </LinkedinShareButton>
                  <EmailShareButton
                    url={shareUrl}
                    subject={`Share code on sharuco.lndev.me`}
                    body={`I discovered this code on sharuco.lndev.me , I share it with you here. - « ${description} » #CaParleDev #ShareWithSharuco`}
                    onClick={() => setOpenShareDialog(false)}
                  >
                    <EmailIcon size={38} round />
                  </EmailShareButton>
                  <WhatsappShareButton
                    url={shareUrl}
                    title={`I discovered this code on sharuco.lndev.me , I share it with you here. - « ${description} » #CaParleDev #ShareWithSharuco`}
                    onClick={() => setOpenShareDialog(false)}
                  >
                    <WhatsappIcon size={38} round />
                  </WhatsappShareButton>
                  <TelegramShareButton
                    url={shareUrl}
                    title={`I discovered this code on sharuco.lndev.me , I share it with you here. - « ${description} » #CaParleDev #ShareWithSharuco`}
                    onClick={() => setOpenShareDialog(false)}
                  >
                    <TelegramIcon size={38} round />
                  </TelegramShareButton>
                  <Button
                    variant="subtle"
                    className="h-10 w-10 rounded-full p-0"
                    onClick={() => {
                      copyToClipboard(shareUrl)
                      notifyUrlCopied()
                      setOpenShareDialog(false)
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
        </div>
      </div>
      {searchParams.get("code-preview") === null && !isPrivate ? (
        <Link
          href={`/code-preview/${id}`}
          className="text-sm text-slate-700 dark:text-slate-400"
        >
          {description.length > 300
            ? description.substring(0, 300) + "..."
            : description}
        </Link>
      ) : (
        <p className="text-sm text-slate-700 dark:text-slate-400">
          {description}
        </p>
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
  )
}
