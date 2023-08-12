"use client"

import { useEffect } from "react"
import Head from "next/head"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  allLanguages,
  getExtensionByName,
  languagesName,
} from "@/constants/languages"
import { SUPER_ADMIN } from "@/constants/super-admin"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLogin } from "@/firebase/auth/githubLogin"
import { useDocument } from "@/firebase/firestore/getDocument"
import { useUpdateCodeDocument } from "@/firebase/firestore/updateCodeDocument"
import copyToClipboard from "@/utils/copyToClipboard"
import highlight from "@/utils/highlight"
import linearizeCode from "@/utils/linearizeCode"
import { yupResolver } from "@hookform/resolvers/yup"
import hljs from "highlight.js"
import {
  Copy,
  Github,
  Link2,
  Loader2,
  Trash2,
  User,
  Verified,
  View,
} from "lucide-react"
import moment from "moment"
import { useForm } from "react-hook-form"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import * as yup from "yup"

import { cn } from "@/lib/utils"
import CardCode from "@/components/cards/card-code"
import CardCodeAdmin from "@/components/cards/card-code-admin"
import Error from "@/components/error"
import { Layout } from "@/components/layout"
import Loader from "@/components/loaders/loader"
import LoaderCode from "@/components/loaders/loader-code"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export default function CodePreview() {
  const searchParams = useSearchParams()
  const { user } = useAuthContext()
  const pseudo = user?.reloadUserInfo.screenName.toLowerCase()

  const { toast } = useToast()

  const notifyCodeCopied = () =>
    toast({
      title: "Code copied to clipboard",
      description: "You can paste it wherever you want",
      action: <ToastAction altText="Okay">Okay</ToastAction>,
    })

  const { login, isPending } = useGitHubLogin()

  const {
    data: dataUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useDocument(pseudo, "users")

  const {
    data: dataCode,
    isLoading: isLoadingCode,
    isError: isErrorCode,
  } = useDocument(searchParams.get("code-preview"), "codes")

  const schema = yup.object().shape({
    code: yup.string(),
    comment: yup.string().required(),
    language: yup.string(),
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

  const {
    updateCodeDocument,
    isLoading: isLoadingAddComment,
    isError: isErrorAddComment,
    isSuccess: isSuccessAddComment,
  }: any = useUpdateCodeDocument("codes")

  function convertirMentionsEnLiens(texte) {
    var regExp = /@([\w-]+)/g
    var texteAvecLiens = texte.replace(regExp, '<a href="/$1">@$1</a>')
    return texteAvecLiens
  }

  const onSubmit = async (data) => {
    const { code, comment, language } = data

    const linearCode = linearizeCode(code)

    let updatedCodeData: {
      comments: any[]
    } = {
      comments: [
        ...dataCode?.data?.comments,
        {
          idComment: pseudo + moment().valueOf(),
          idAuthor: pseudo,
          //comment: convertirMentionsEnLiens(comment),
          comment: comment,
          createdAt: moment().valueOf(),
          photoURL: dataUser?.data.photoURL,
          premium: dataUser?.data.premium,
          code: linearCode,
          language: language,
        },
      ],
    }

    const id = searchParams.get("code-preview")

    await updateCodeDocument({ id, updatedCodeData })

    reset({
      code: "",
      comment: "",
      language: "",
    })

    toast({
      title: "Comment submitted successfully",
      description: "Your comment has been submitted successfully",
      action: <ToastAction altText="Okay">Okay</ToastAction>,
    })
  }

  const handleDeletComment = async (idComment) => {
    const id = searchParams.get("code-preview")

    const updatedCodeData = {
      comments: dataCode?.data?.comments.filter(
        (comment) => comment.idComment !== idComment
      ),
    }

    await updateCodeDocument({ id, updatedCodeData })

    toast({
      title: "Comment deleted successfully",
      description: "Your comment has been deleted successfully",
      action: <ToastAction altText="Okay">Okay</ToastAction>,
    })
  }

  useEffect(() => {
    if (window.location.hash === "#commentsCode" && dataCode) {
      const el = document.querySelector("#commentsCode")
      el.scrollIntoView()
    }
  }, [dataCode])

  return (
    <Layout>
      <Head>
        <title>Sharuco - Code : {searchParams.get("code-preview")}</title>
        <meta
          name="description"
          content="Sharuco allows you to share code codes that you have found
          useful."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>{" "}
      <section className="container grid items-center gap-0 pb-8 pt-6 md:py-10">
        {isLoadingCode && <LoaderCode />}
        {dataCode && dataCode.exists && !dataCode.data.isPrivate && (
          <div className="w-full">
            <ResponsiveMasonry
              columnsCountBreakPoints={{
                all: 1,
              }}
            >
              <Masonry>
                {dataUser?.data.pseudo === dataCode.data.idAuthor ||
                SUPER_ADMIN.includes(dataUser?.data.pseudo) ? (
                  <CardCodeAdmin
                    key={searchParams.get("code-preview")}
                    id={searchParams.get("code-preview")}
                    idAuthor={dataCode.data.idAuthor}
                    language={dataCode.data.language}
                    code={dataCode.data.code}
                    description={dataCode.data.description}
                    tags={dataCode.data.tags}
                    favoris={dataCode.data.favoris}
                    isPrivate={dataCode.data.isPrivate}
                    comments={dataCode.data.comments}
                  />
                ) : (
                  <CardCode
                    key={searchParams.get("code-preview")}
                    id={searchParams.get("code-preview")}
                    idAuthor={dataCode.data.idAuthor}
                    language={dataCode.data.language}
                    code={dataCode.data.code}
                    description={dataCode.data.description}
                    tags={dataCode.data.tags}
                    favoris={dataCode.data.favoris}
                    isPrivate={dataCode.data.isPrivate}
                    currentUser={dataUser?.data}
                    comments={dataCode.data.comments}
                  />
                )}
              </Masonry>
            </ResponsiveMasonry>
            <div className="mb-6 mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <p>
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                  Published {moment(dataCode.data.createdAt).fromNow()}
                </span>
              </p>
              {dataCode?.data?.githubGistInfos ? (
                <Link
                  href={dataCode?.data?.githubGistInfos?.gistUrl}
                  target="_blank"
                  className={buttonVariants({ size: "lg", variant: "subtle" })}
                >
                  <View className="mr-2 h-4 w-4" />
                  View on Github Gist
                </Link>
              ) : null}
            </div>
            <div className="flex w-full flex-col items-start gap-2">
              <div
                id="commentsCode"
                className="flex w-full flex-col items-start"
              >
                <h2 className="text-2xl font-bold">
                  {dataCode.data.comments.length} Comment(s)
                </h2>
                <Separator className="my-4" />
              </div>
              <div className="flex w-full flex-col-reverse items-center gap-4 lg:flex-row lg:items-start">
                <div className="flex w-full flex-col gap-8">
                  {dataCode.data.comments &&
                    dataCode.data.comments
                      //.sort((a, b) => b.createdAt - a.createdAt)
                      .map((comment) => (
                        <div
                          key={comment.idComment}
                          className="flex flex-col gap-4"
                        >
                          <div className="flex flex-wrap items-center">
                            <Link
                              href={`/user/${comment.idAuthor}`}
                              className="mr-2 flex items-center justify-start gap-2"
                            >
                              <Avatar className="h-8 w-8 cursor-pointer">
                                {isLoadingUser && (
                                  <AvatarFallback>
                                    <Loader />
                                  </AvatarFallback>
                                )}
                                <AvatarImage
                                  src={comment.photoURL}
                                  alt={comment.idAuthor}
                                />
                                <AvatarFallback>
                                  {comment.idAuthor.split(" ")[1] === undefined
                                    ? comment.idAuthor.split(" ")[0][0] +
                                      comment.idAuthor.split(" ")[0][1]
                                    : comment.idAuthor.split(" ")[0][0] +
                                      comment.idAuthor.split(" ")[1][0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex items-center justify-start gap-1">
                                <span className="text-md font-bold text-slate-700 hover:underline dark:text-slate-400 ">
                                  {comment.idAuthor}{" "}
                                </span>
                                <span>
                                  {comment.premium && (
                                    <Verified className="h-4 w-4 text-green-500" />
                                  )}
                                </span>
                              </div>
                            </Link>

                            <div className="flex items-center gap-2">
                              {comment.idAuthor === dataCode?.data.idAuthor && (
                                <span className="rounded-xl bg-teal-100 px-1.5 py-0.5 text-xs no-underline group-hover:no-underline dark:text-slate-900">
                                  Author
                                </span>
                              )}
                              •
                              <span className="rounded-xl py-0.5 text-xs font-semibold text-slate-900 dark:text-white">
                                {moment(comment.createdAt).fromNow()}
                              </span>
                            </div>
                          </div>
                          <div className="flex w-full flex-col gap-2 rounded-md bg-slate-100 p-4 dark:bg-slate-800">
                            <p className="text-md font-semibold text-slate-900 dark:text-white">
                              {comment.comment}
                            </p>
                            {/* <p
                              dangerouslySetInnerHTML={{
                                __html: comment.comment,
                              }}
                              className="font-semibold text-md text-slate-900 dark:text-white"
                            ></p> */}

                            {comment.code && (
                              <ResponsiveMasonry
                                columnsCountBreakPoints={{
                                  all: 1,
                                }}
                              >
                                <Masonry>
                                  <div className="w-full overflow-hidden rounded-lg bg-slate-900 dark:bg-black">
                                    <div className="flex items-center justify-between bg-[#343541] px-4 py-1">
                                      <span className="text-xs font-medium text-white">
                                        {comment.language.toLowerCase()}
                                      </span>
                                      <span
                                        className="flex cursor-pointer items-center p-1 text-xs font-medium text-white"
                                        onClick={() => {
                                          copyToClipboard(comment.code)
                                          notifyCodeCopied()
                                        }}
                                      >
                                        <Copy className="mr-2 h-4 w-4" />
                                        Copy code
                                      </span>
                                    </div>
                                    <pre className="max-h-[380px] w-full overflow-auto rounded-lg rounded-t-none bg-slate-900 p-4 dark:bg-black">
                                      <code
                                        className="text-white"
                                        dangerouslySetInnerHTML={{
                                          __html: highlight(
                                            comment.code,
                                            comment.language.toLowerCase()
                                          ),
                                        }}
                                      />
                                    </pre>
                                  </div>
                                </Masonry>
                              </ResponsiveMasonry>
                            )}
                          </div>
                          {(comment.idAuthor === dataUser?.data.pseudo ||
                            dataCode.data.idAuthor === dataUser?.data.pseudo ||
                            SUPER_ADMIN.includes(dataUser?.data.pseudo)) && (
                            <div>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button className="flex items-center justify-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500">
                                    <Trash2 className="h-4 w-4" />
                                    <span>Delete</span>
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you sure you want to delete this
                                      comment ?
                                    </AlertDialogTitle>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <button
                                      className={cn(
                                        "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                                      )}
                                      onClick={() => {
                                        handleDeletComment(comment.idComment)
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}
                        </div>
                      ))}
                </div>
                <div className="flex w-full items-center justify-center md:w-[600px]">
                  {user ? (
                    <div className="grid w-full gap-2">
                      <div className="mb-2 flex w-full flex-col items-start gap-1.5">
                        <Label htmlFor="description">Your comment *</Label>
                        <Textarea
                          placeholder="Insert your comment here..."
                          id="comment"
                          {...register("comment")}
                        />
                        <p className="text-sm text-red-500">
                          {errors.comment && <>{errors.comment.message}</>}
                        </p>
                      </div>
                      <div className="mb-2 flex w-full flex-col items-start gap-1.5">
                        <Label htmlFor="code">Code review</Label>
                        <Textarea
                          placeholder="Insert your code review here..."
                          id="code"
                          {...register("code")}
                          onChange={(e) => {
                            handleCodeChange(e.target.value)
                          }}
                        />
                        <p className="text-sm text-red-500">
                          {errors.code && <>{errors.code.message}</>}
                        </p>
                      </div>
                      <div className="mb-2 flex w-full flex-col items-start gap-1.5">
                        <Label htmlFor="language">
                          Language of code review
                        </Label>
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
                      <button
                        className={cn(
                          "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                        )}
                        disabled={isLoadingAddComment}
                        onClick={
                          !isLoadingAddComment
                            ? handleSubmit(onSubmit)
                            : undefined
                        }
                      >
                        {isLoadingAddComment && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Add comment
                      </button>
                    </div>
                  ) : (
                    <button
                      className={cn(
                        "inline-flex h-10 w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                      )}
                      disabled={isPending}
                      onClick={login}
                    >
                      {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Github className="mr-2 h-4 w-4" />
                      )}
                      Login with Github to comment
                    </button>
                  )}
                </div>
              </div>
              <Separator className="my-4" />
              <div className="mt-4 flex w-full flex-col items-start justify-center gap-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Who likes this code
                </h3>
                <div className="flex flex-wrap gap-2">
                  {dataCode.data.favoris.map((person) => (
                    <div
                      key={person}
                      className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100"
                    >
                      <User className="h-4 w-4" />
                      <Link
                        href={`/user/${person}`}
                        className="hover:underline"
                      >
                        {person}
                      </Link>
                    </div>
                  ))}
                  {dataCode.data.favoris.length === 0 && (
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      No one likes this code yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {((dataCode && !dataCode.exists) ||
          (dataCode && dataCode.exists && dataCode.data.isPrivate)) && (
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold">
              This code code does not exist.
            </h1>
            <Link
              href="/explore"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Explore code
            </Link>
          </div>
        )}
        {isErrorCode && <Error />}
      </section>
    </Layout>
  )
}
