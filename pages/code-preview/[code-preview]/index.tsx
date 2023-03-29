"use client"

import Head from "next/head"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLoign } from "@/firebase/auth/githubLogin"
import { useDocument } from "@/firebase/firestore/getDocument"
import { useUpdateCodeDocument } from "@/firebase/firestore/updateCodeDocument"
import highlight from "@/utils/highlight"
import linearizeCode from "@/utils/linearizeCode"
import { yupResolver } from "@hookform/resolvers/yup"
import { Github, Loader2, Trash2, Verified } from "lucide-react"
import moment from "moment"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import { cn } from "@/lib/utils"
import CardCode from "@/components/card-code"
import CardCodeAdmin from "@/components/card-code-admin"
import Error from "@/components/error"
import { Layout } from "@/components/layout"
import Loader from "@/components/loader"
import { buttonVariants } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import "prism-themes/themes/prism-one-dark.min.css"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as yup from "yup"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function CodePreview() {
  const searchParams = useSearchParams()
  const { user } = useAuthContext()
  const pseudo = user?.reloadUserInfo.screenName

  const { login, isPending } = useGitHubLoign()

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
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

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
    const { code, comment } = data

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
          isCertified: dataUser?.data.isCertified,
          code: linearCode,
        },
      ],
    }

    const id = searchParams.get("code-preview")

    updateCodeDocument({ id, updatedCodeData })

    reset({
      code: "",
      comment: "",
    })

    toast.success("Comment submitted successfully")
  }

  const handleDeletComment = async (idComment) => {
    const id = searchParams.get("code-preview")

    const updatedCodeData = {
      comments: dataCode?.data?.comments.filter(
        (comment) => comment.idComment !== idComment
      ),
    }

    updateCodeDocument({ id, updatedCodeData })

    toast.success("Comment deleted successfully")
  }

  return (
    <Layout>
      <Head>
        <title>Sharuco</title>
        <meta
          name="description"
          content="Sharuco allows you to share code codes that you have found
                 useful."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-0 pt-6 pb-8 md:py-10">
        {isLoadingCode && <Loader />}
        {dataCode && dataCode.exists && !dataCode.data.isPrivate && (
          <div className="w-full">
            <ResponsiveMasonry
              columnsCountBreakPoints={{
                all: 1,
              }}
            >
              <Masonry>
                {dataUser?.data.pseudo === dataCode.data.idAuthor ? (
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
            <div className="flex w-full flex-col items-start gap-2">
              <div className="flex flex-col w-full items-start">
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
                              href={`/${comment.idAuthor}`}
                              className="flex items-center mr-2 justify-start gap-2"
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
                                  {comment.isCertified && (
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
                              className="text-md font-semibold text-slate-900 dark:text-white"
                            ></p> */}

                            {comment.code && (
                              <ResponsiveMasonry
                                columnsCountBreakPoints={{
                                  all: 1,
                                }}
                              >
                                <Masonry>
                                  <div className="w-full overflow-hidden rounded-lg bg-slate-900 dark:bg-black">
                                    <div className="bg-[#343541] py-1 px-4">
                                      <span className="text-xs font-medium text-white">
                                        {dataCode.data.language.toLowerCase()}
                                      </span>
                                    </div>
                                    <pre className="max-h-[380px] w-full overflow-auto rounded-lg rounded-t-none bg-slate-900 p-4 dark:bg-black">
                                      <code
                                        className="text-white"
                                        dangerouslySetInnerHTML={{
                                          __html: highlight(
                                            comment.code,
                                            dataCode.data.language
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
                            dataCode.data.idAuthor ===
                              dataUser?.data.pseudo) && (
                            <div>
                              <button
                                onClick={() => {
                                  handleDeletComment(comment.idComment)
                                }}
                                className="flex items-center justify-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete</span>
                              </button>
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
                        />
                        <p className="text-sm text-red-500">
                          {errors.code && <>{errors.code.message}</>}
                        </p>
                      </div>
                      <button
                        className={cn(
                          "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 py-2 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
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
                        "inline-flex h-10 w-full items-center justify-center rounded-md bg-slate-900 py-2 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
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
            </div>
          </div>
        )}
        {((dataCode && !dataCode.exists) ||
          (dataCode && dataCode.exists && dataCode.data.isPrivate)) && (
          <div className="flex flex-col items-center gap-4">
            <h1 className="tesxt-4xl font-bold">
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
