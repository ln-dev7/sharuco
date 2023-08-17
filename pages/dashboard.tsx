"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  allLanguages,
  getExtensionByName,
  languagesName,
} from "@/constants/languages"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLogout } from "@/firebase/auth/githubLogout"
import { useCreateDocument } from "@/firebase/firestore/createDocument"
import { useDocument } from "@/firebase/firestore/getDocument"
import { useGetDocumentFromUser } from "@/firebase/firestore/getDocumentFromUser"
import { useGetFavoriteCode } from "@/firebase/firestore/getFavoriteCode"
import { useGetIsPrivateCodeFromUser } from "@/firebase/firestore/getIsPrivateCodeFromUser"
import copyToClipboard from "@/utils/copyToClipboard.js"
import embedProject from "@/utils/embedStackblitzProject"
import indentCode from "@/utils/indentCode.js"
import linearizeCode from "@/utils/linearizeCode"
import { yupResolver } from "@hookform/resolvers/yup"
import sdk, { Project } from "@stackblitz/sdk"
import hljs from "highlight.js"
import {
  Eye,
  EyeOff,
  FileCog,
  Heart,
  LinkIcon,
  Loader2,
  Plus,
  Settings,
  User,
} from "lucide-react"
import moment from "moment"
import { useForm } from "react-hook-form"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import * as yup from "yup"

import { TemplateName } from "@/types/templatStackblitzName"
import { cn } from "@/lib/utils"
import CardCode from "@/components/cards/card-code"
import CardCodeAdmin from "@/components/cards/card-code-admin"
import EmptyCard from "@/components/empty-card"
import Error from "@/components/error"
import { Layout } from "@/components/layout"
import LoaderCodes from "@/components/loaders/loader-codes"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export default function Dashboard() {
  const { user } = useAuthContext()
  const router = useRouter()
  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  })

  const { toast } = useToast()

  const { logout } = useGitHubLogout()
  const notifyCodeAdded = () =>
    toast({
      title: "Your code has been added successfully !",
      description: "You can find it in the manage code section.",
      action: <ToastAction altText="Okay">Okay</ToastAction>,
    })

  const notifyUserTokenCopied = () =>
    toast({
      title: "Your user token has been copied to your clipboard !",
      description: "You can find it in your profile section.",
      action: <ToastAction altText="Okay">Okay</ToastAction>,
    })
  const pseudo = user?.reloadUserInfo.screenName.toLowerCase()

  const {
    data: dataUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useDocument(pseudo, "users")

  const {
    isLoading: isLoadingPrivateCodes,
    isError: isErrorPrivateCodes,
    data: dataPrivateCodes,
  } = useGetIsPrivateCodeFromUser(true, pseudo)

  const {
    isLoading: isLoadingPublicCodes,
    isError: isErrorPublicCodes,
    data: dataPublicCodes,
  } = useGetIsPrivateCodeFromUser(false, pseudo)

  const {
    isLoading: isLoadingCodes,
    isError: isErrorCodes,
    data: dataCodes,
  } = useGetDocumentFromUser(pseudo, "codes")

  const {
    isLoading: isLoadingFavoriteCodes,
    isError: isErrorFavoriteCodes,
    data: dataFavoriteCodes,
  } = useGetFavoriteCode(pseudo)

  const [checkboxOn, setCheckboxOn] = useState(false)
  const [gistCheckboxOn, setGistCheckboxOn] = useState(false)
  const [isLoadingAddOnGithubGist, setIsLoadingAddOnGithubGist] =
    useState(false)
  const [isErrorAddOnGithubGist, setIsErrorAddOnGithubGist] = useState({
    isError: false,
    isUnauthorized: false,
  })

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
    isGithubGist: yup.boolean(),
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  function detectLanguage(code) {
    const language = hljs.highlightAuto(code).language
    return language || "text"
  }

  const [codeValue, setCodeValue] = useState("")
  function handleCodeChange(code) {
    const detectedLanguage = detectLanguage(code)
    if (!languagesName.includes(detectedLanguage)) {
      setValue("language", "other")
      return
    }
    setValue("language", detectedLanguage)
  }

  const [openDialog, setOpenDialog] = useState(false)
  const { createDocument, isLoading, isError, isSuccess }: any =
    useCreateDocument("codes")

  const onSubmit = async (data) => {
    const { code, description, language, tags, isPrivate, isGithubGist } = data
    const linearCode = linearizeCode(code)
    const tabTabs = tags
      ? tags.split(",").map((word) => word.trim().toLowerCase())
      : []
    if (tabTabs[tabTabs.length - 1] === "") {
      tabTabs.pop()
    }

    const extension = getExtensionByName(language)

    let newDocument = {
      code: linearCode,
      description: description,
      isPrivate: !!isPrivate,
      language: language.toLowerCase(),
      tags: tabTabs,
      createdAt: moment().valueOf(),
      favoris: [],
      favorisCount: 0,
      idAuthor: pseudo,
      comments: [],
    }

    if (isGithubGist && dataUser?.data?.personalAccessToken) {
      try {
        setIsLoadingAddOnGithubGist(true)
        setIsErrorAddOnGithubGist({
          isError: false,
          isUnauthorized: false,
        })
        const response = await fetch("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `token ${dataUser?.data?.personalAccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: description,
            public: !isPrivate,
            files: {
              [`sharuco-index${extension}`]: {
                content: indentCode(linearCode),
              },
            },
          }),
        })

        if (response.status === 401) {
          setIsErrorAddOnGithubGist({
            isError: true,
            isUnauthorized: true,
          })
          setIsLoadingAddOnGithubGist(false)
          return
        }

        const data = await response.json()
        const gistUrl = data.html_url
        const id = data.id
        copyToClipboard(gistUrl)

        toast({
          title: "Your code has been added on your GitHub Gist !",
          description: "Link of your has been copied to your clipboard !",
          action: <ToastAction altText="Okay">Okay</ToastAction>,
        })

        const newDocumentWithGist = {
          ...newDocument,
          githubGistInfos: { gistUrl, id },
        }

        createDocument(newDocumentWithGist)
      } catch (error) {
        setIsErrorAddOnGithubGist({
          isError: true,
          isUnauthorized: false,
        })
      } finally {
        setIsLoadingAddOnGithubGist(false)
      }
    } else {
      createDocument(newDocument)
    }

    reset({
      code: "",
      description: "",
      language: "",
      tags: "",
      isPrivate: false,
      isGithubGist: false,
    })
    setCheckboxOn(false)
    setGistCheckboxOn(false)
  }

  useEffect(() => {
    if (isSuccess) {
      notifyCodeAdded()
      setOpenDialog(!isSuccess)
    }
  }, [isSuccess])

  return (
    <Layout>
      <Head>
        <title>Sharuco | Your Dashboard</title>
        <meta
          name="description"
          content="Sharuco allows you to share code codes that you have found
          useful."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>{" "}
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-2xl font-extrabold leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-4xl">
            Dashboard
          </h1>
          <p
            className={cn(
              "text-sm font-medium leading-5 text-gray-500 dark:text-gray-400",
              "sm:text-base md:text-lg lg:text-lg"
            )}
          >
            You can{" "}
            <span className="text-gray-700 dark:text-gray-300">modify</span> or{" "}
            <span className="text-gray-700 dark:text-gray-300">delete</span> a
            code only on the{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              manage code
            </span>{" "}
            section.
          </p>

          <Link
            href="/add-personal-access-token"
            className="mt-2 inline-flex items-center rounded-full border border-green-200 bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800 dark:border-none dark:bg-gray-800 dark:text-green-300"
          >
            <span className="mr-1 h-2 w-2 shrink-0 rounded-full bg-green-500"></span>
            To be able to add code to your Github Gist, make sure you follow
            this guide.
          </Link>
        </div>
        <div className="flex flex-col justify-between gap-2 sm:flex-row">
          <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
            <AlertDialogTrigger asChild>
              <button
                className={buttonVariants({ size: "lg" })}
                onClick={() => setOpenDialog(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add new code
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-h-[640px] overflow-hidden overflow-y-auto scrollbar-hide">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                    Add new code
                  </h3>
                </AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="mb-4 flex w-full flex-col items-start gap-1.5">
                    <Label htmlFor="code">Insert your code</Label>
                    <Textarea
                      placeholder="Insert your code here..."
                      id="code"
                      {...register("code")}
                      className="h-32"
                      onChange={(e) => {
                        setCodeValue(e.target.value)
                        handleCodeChange(e.target.value)
                      }}
                    />
                    <div className="flex w-full items-center justify-center">
                      <Dialog>
                        {codeValue !== "" && (
                          <DialogTrigger asChild>
                            <button className="mt-2 flex items-center justify-center gap-2 rounded-md bg-[#1574ef] px-3 py-1 text-white">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1}
                                stroke="currentColor"
                                className="h-5 w-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                                />
                              </svg>
                              <span className="font-base text-sm tracking-wider text-white">
                                Edit this code in stackblitz
                              </span>
                            </button>
                          </DialogTrigger>
                        )}
                        <DialogContent className="sm:max-w-7xl">
                          <DialogHeader>
                            <DialogDescription>
                              Choose the template with which the code will be
                              executed{" "}
                            </DialogDescription>
                            <Select
                              onValueChange={(value: TemplateName) => {
                                embedProject(
                                  value,
                                  getValues("code"),
                                  getValues("language"),
                                  pseudo,
                                  getValues("description")
                                    ? getValues("description")
                                    : null
                                )
                              }}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Choose a template" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Templates</SelectLabel>
                                  <SelectItem value="angular-cli">
                                    angular-cli
                                  </SelectItem>
                                  <SelectItem value="create-react-app">
                                    create-react-app
                                  </SelectItem>
                                  <SelectItem value="html">html</SelectItem>
                                  <SelectItem value="javascript">
                                    javascript
                                  </SelectItem>
                                  <SelectItem value="polymer">
                                    polymer
                                  </SelectItem>
                                  <SelectItem value="typescript">
                                    typescript
                                  </SelectItem>
                                  <SelectItem value="vue">vue</SelectItem>
                                  <SelectItem value="node">node</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </DialogHeader>
                          <div
                            id="embed-stackblitz"
                            className="overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800"
                          ></div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <p className="text-sm text-red-500">
                      {errors.code && <>{errors.code.message}</>}
                    </p>
                  </div>
                  <div className="mb-4 flex w-full flex-col items-start gap-1.5">
                    <Label htmlFor="description">Description</Label>
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
                    <Label htmlFor="language">Language</Label>
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
                  {dataUser?.data?.personalAccessToken ? (
                    <div className="mt-4 flex items-center gap-4">
                      <input
                        type="checkbox"
                        {...register("isGithubGist")}
                        name="isGithubGist"
                        id="isGithubGist"
                        className={`h-[24px] w-[24px] cursor-pointer appearance-none rounded-full bg-slate-200 outline-none ring-slate-500
                           ring-offset-0 focus:ring-slate-400 focus:ring-offset-slate-900 dark:bg-slate-800
                          ${gistCheckboxOn ? "ring-2" : "ring-0"}
                          `}
                        checked={gistCheckboxOn}
                        onChange={() => setGistCheckboxOn(!gistCheckboxOn)}
                      />
                      <Label htmlFor="isGithubGist">
                        Do you also want to publish this code on your Github
                        Gist ?{" "}
                        {gistCheckboxOn ? (
                          <span className="font-bold text-teal-300">Yes</span>
                        ) : (
                          <span className="font-bold text-teal-300">No</span>
                        )}
                      </Label>
                    </div>
                  ) : (
                    <div
                      className="mt-4 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-gray-800 dark:text-yellow-300"
                      role="alert"
                    >
                      <Link href="/add-personal-access-token">
                        You cannot publish code on your Github Gist because you
                        have not yet followed{" "}
                        <span className="underline underline-offset-4">
                          this guide
                        </span>
                        .
                      </Link>
                    </div>
                  )}
                  {(isError ||
                    (isErrorAddOnGithubGist.isError &&
                      !isErrorAddOnGithubGist.isUnauthorized)) && (
                    <p className="pt-4 text-sm font-bold text-red-500">
                      An error has occurred, please try again later.
                    </p>
                  )}
                  {isErrorAddOnGithubGist.isUnauthorized && (
                    <div
                      className="mt-4 w-full rounded-lg bg-red-50 p-4 text-sm font-medium leading-6 text-red-800 dark:bg-gray-800 dark:text-red-400 lg:w-3/4"
                      role="alert"
                    >
                      <Link href="/add-personal-access-token">
                        Your personal access token is not valid. <br />
                        So you can&apos;t add code to your Github Gist. <br />
                        Please create a new one and update it by following{" "}
                        <span className="underline underline-offset-4">
                          this guide
                        </span>
                        .
                      </Link>
                    </div>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <button
                  className={cn(
                    "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                  )}
                  disabled={isLoading || isLoadingAddOnGithubGist}
                  onClick={
                    !(isLoading || isLoadingAddOnGithubGist)
                      ? handleSubmit(onSubmit)
                      : undefined
                  }
                >
                  {(isLoading || isLoadingAddOnGithubGist) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add
                </button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href={`/user/${pseudo}`}
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              <User className="mr-2 h-4 w-4" />
              Your profile
            </Link>
            <Link
              href={`/links`}
              className={buttonVariants({ size: "lg", variant: "subtle" })}
            >
              <LinkIcon className="mr-2 h-4 w-4" />
              Your links
            </Link>
          </div>
        </div>
        <Separator className="my-4" />
        <Tabs defaultValue="manage-code" className="w-full">
          <TabsList>
            <div>
              <TabsTrigger value="manage-code">
                <Settings className="mr-2 h-4 w-4" />
                Manage code
              </TabsTrigger>
              <TabsTrigger value="public-code">
                <Eye className="mr-2 h-4 w-4" />
                public code
              </TabsTrigger>
              <TabsTrigger value="private-code">
                <EyeOff className="mr-2 h-4 w-4" />
                Private code
              </TabsTrigger>
              <TabsTrigger value="favorite-code">
                <Heart className="mr-2 h-4 w-4" />
                Favorite code
              </TabsTrigger>
            </div>
          </TabsList>
          <TabsContent className="border-none p-0 pt-4" value="manage-code">
            {isLoadingCodes && <LoaderCodes />}
            {dataCodes && (
              <>
                {dataCodes.length > 0 && (
                  <ResponsiveMasonry
                    columnsCountBreakPoints={{
                      659: 1,
                      660: 2,
                      720: 2,
                      990: 3,
                    }}
                    className="w-full"
                  >
                    <Masonry gutter="2rem">
                      {dataCodes.map(
                        (code: {
                          id: string
                          idAuthor: string
                          language: string
                          code: string
                          description: string
                          tags: string[]
                          favoris: string[]
                          isPrivate: boolean
                          comments: any
                        }) => (
                          <CardCodeAdmin
                            key={code.id}
                            id={code.id}
                            idAuthor={code.idAuthor}
                            language={code.language}
                            code={code.code}
                            description={code.description}
                            tags={code.tags}
                            favoris={code.favoris}
                            isPrivate={code.isPrivate}
                            comments={code.comments}
                          />
                        )
                      )}
                    </Masonry>
                  </ResponsiveMasonry>
                )}
                {dataCodes.length == 0 && (
                  <EmptyCard
                    icon={<FileCog className="h-12 w-12" />}
                    title="No code found"
                    description="You don't have any public code any yet."
                  />
                )}
              </>
            )}
            {(isErrorPublicCodes || isErrorPrivateCodes) && <Error />}
          </TabsContent>
          <TabsContent className="border-none p-0 pt-4" value="public-code">
            {isLoadingPublicCodes && <LoaderCodes />}
            {dataPublicCodes && (
              <>
                {dataPublicCodes.length > 0 && (
                  <ResponsiveMasonry
                    columnsCountBreakPoints={{
                      659: 1,
                      660: 1,
                      720: 1,
                      1200: 2,
                    }}
                    className="w-full"
                  >
                    <Masonry gutter="2rem">
                      {dataPublicCodes.map(
                        (code: {
                          id: string
                          idAuthor: string
                          language: string
                          code: string
                          description: string
                          tags: string[]
                          favoris: string[]
                          isPrivate: boolean
                          currentUser: any
                          comments: any
                        }) => (
                          <CardCode
                            key={code.id}
                            id={code.id}
                            idAuthor={code.idAuthor}
                            language={code.language}
                            code={code.code}
                            description={code.description}
                            tags={code.tags}
                            favoris={code.favoris}
                            isPrivate={code.isPrivate}
                            currentUser={dataUser?.data}
                            comments={code.comments}
                          />
                        )
                      )}
                    </Masonry>
                  </ResponsiveMasonry>
                )}
                {dataPublicCodes.length == 0 && (
                  <EmptyCard
                    icon={<FileCog className="h-12 w-12" />}
                    title="No code found"
                    description="You don't have any public code any yet."
                  />
                )}
              </>
            )}
            {isErrorPublicCodes && <Error />}
          </TabsContent>
          <TabsContent className="border-none p-0 pt-4" value="private-code">
            {isLoadingPrivateCodes && <LoaderCodes />}
            {dataPrivateCodes && (
              <>
                {dataPrivateCodes.length > 0 && (
                  <ResponsiveMasonry
                    columnsCountBreakPoints={{
                      659: 1,
                      660: 1,
                      720: 1,
                      1200: 2,
                    }}
                    className="w-full"
                  >
                    <Masonry gutter="2rem">
                      {dataPrivateCodes.map(
                        (code: {
                          id: string
                          idAuthor: string
                          language: string
                          code: string
                          description: string
                          tags: string[]
                          favoris: string[]
                          isPrivate: boolean
                          currentUser: any
                          comments: any
                        }) => (
                          <CardCode
                            key={code.id}
                            id={code.id}
                            idAuthor={code.idAuthor}
                            language={code.language}
                            code={code.code}
                            description={code.description}
                            tags={code.tags}
                            favoris={code.favoris}
                            isPrivate={code.isPrivate}
                            currentUser={dataUser?.data}
                            comments={code.comments}
                          />
                        )
                      )}
                    </Masonry>
                  </ResponsiveMasonry>
                )}
                {dataPrivateCodes.length == 0 && (
                  <EmptyCard
                    icon={<FileCog className="h-12 w-12" />}
                    title="No code found"
                    description="You don't have any private code any yet."
                  />
                )}
              </>
            )}
            {isErrorFavoriteCodes && <Error />}
          </TabsContent>
          <TabsContent className="border-none p-0 pt-4" value="favorite-code">
            {isLoadingFavoriteCodes && <LoaderCodes />}
            {dataFavoriteCodes && (
              <>
                {dataFavoriteCodes.length > 0 && (
                  <ResponsiveMasonry
                    columnsCountBreakPoints={{
                      659: 1,
                      660: 1,
                      720: 1,
                      1200: 2,
                    }}
                    className="w-full"
                  >
                    <Masonry gutter="2rem">
                      {dataFavoriteCodes.map(
                        (code: {
                          id: string
                          idAuthor: string
                          language: string
                          code: string
                          description: string
                          tags: string[]
                          favoris: string[]
                          isPrivate: boolean
                          currentUser: any
                          comments: any
                        }) => (
                          <CardCode
                            key={code.id}
                            id={code.id}
                            idAuthor={code.idAuthor}
                            language={code.language}
                            code={code.code}
                            description={code.description}
                            tags={code.tags}
                            favoris={code.favoris}
                            isPrivate={code.isPrivate}
                            currentUser={dataUser?.data}
                            comments={code.comments}
                          />
                        )
                      )}
                    </Masonry>
                  </ResponsiveMasonry>
                )}
                {dataFavoriteCodes.length == 0 && (
                  <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed border-slate-300 dark:border-slate-700">
                    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                      <FileCog className="h-12 w-12" />
                      <h3 className="mt-4 text-lg font-semibold">
                        You don&apos;t have any favorite code yet
                      </h3>
                      <p className="text-muted-foreground mb-4 mt-2 text-sm">
                        You can find your favorite code in the explore section.
                      </p>
                      <Link
                        href="/explore"
                        className={cn(
                          "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                        )}
                      >
                        Explore code
                      </Link>
                    </div>
                  </div>
                )}
              </>
            )}
            {isErrorFavoriteCodes && <Error />}
          </TabsContent>
        </Tabs>
        <Separator className="my-4" />
        <div className="flex flex-col items-start gap-2">
          <h1 className="mb-2 text-2xl font-extrabold leading-tight tracking-tighter">
            Danger Zone
          </h1>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete your account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete your account ?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action is irreversible, please reflect beforehand. You
                  will lose all your codes. <br className="hidden sm:inline" />
                  If you are sure, contact us
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <a
                  href="mailto:sharuco@leonelngoya.com"
                  className={cn(
                    "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                  )}
                >
                  Contact us
                </a>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>
    </Layout>
  )
}
