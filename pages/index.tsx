import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLoign } from "@/firebase/auth/githubLogin"
import { useCreateDocument } from "@/firebase/firestore/createDocument"
import { useDocuments } from "@/firebase/firestore/getDocuments"
import linearizeCode from "@/utils/linearizeCode"
import { yupResolver } from "@hookform/resolvers/yup"
import { Code2, Github, Loader2, Plus } from "lucide-react"
import moment from "moment"
import { useForm } from "react-hook-form"
import { Toaster, toast } from "react-hot-toast"
import * as yup from "yup"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Layout } from "@/components/layout"
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
import { Textarea } from "@/components/ui/textarea"

export default function IndexPage() {
  const { login, isPending } = useGitHubLoign()

  const notifyCodeAdded = () =>
    toast.success("Your code has been added successfully !")

  const { user } = useAuthContext()

  const {
    data: dataUsers,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = useDocuments("users")

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

  const { createDocument, isLoading, isError, isSuccess }: any =
    useCreateDocument("codes")

  const onSubmit = async (data) => {
    const { code, description, language, tags, isPrivate } = data
    const linearCode = linearizeCode(code)
    const tabTabs = tags ? tags.split(",") : []
    if (tabTabs[tabTabs.length - 1] === "") {
      tabTabs.pop()
    }

    const newDocument = {
      code: linearCode,
      description: description,
      isPrivate: !!isPrivate,
      language: language,
      tags: tabTabs,
      date: moment().valueOf(),
      favoris: [],
      idAuthor: user.reloadUserInfo.screenName,
    }

    createDocument(newDocument)

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

  const [userCountry, setUserCountry] = useState("")
  useEffect(() => {
    setUserCountry(window.navigator.language.split("-")[1])
  }, [])

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
      <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            Share your code
            <br className="hidden sm:inline" />
            with everyone.
          </h1>
          <p className="max-w-[700px] text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
            Sharuco allows you to share code codes that you have found useful.
          </p>
        </div>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 md:flex-row">
          <Link
            href={siteConfig.links.explore}
            className={buttonVariants({ size: "lg" })}
          >
            Explore code
          </Link>
          {user ? (
            <Link
              href="/dashboard"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              <Code2 className="mr-2 h-4 w-4" />
              Your dashboard
            </Link>
          ) : (
            <button
              className={buttonVariants({ variant: "outline", size: "lg" })}
              disabled={isPending}
              onClick={login}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Github className="mr-2 h-4 w-4" />
              )}
              Sign in with Github
            </button>
          )}
        </div>
        {!user && userCountry == "CM" && (
          <div
            className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <span className="font-semibold">Warning alert !</span> We have noticed
            that you are in <span className="font-semibold">Cameroon</span> , if you are using an{" "}
            <span className="font-semibold">Orange connection</span> you need to
            use a VPN and change your location in order to connect.
          </div>
        )}
        <p className="text-sm text-slate-700 dark:text-slate-400">
          Follow us on{" "}
          <Link
            href="https://twitter.com/ln_dev7"
            className="font-bold underline underline-offset-4"
          >
            Twitter
          </Link>{" "}
          for the latest updates
        </p>
        {/* {!isLoadingUsers ? (
          <p className="text-sm text-slate-700 dark:text-slate-400">
            <span className="font-bold">{dataUsers.length}</span> users
            registered on sharuco.
          </p>
        ) : (
          <Loader2 className="h-4 w-4 animate-spin" />
        )} */}
        <div
          className="mt-4 overflow-hidden rounded-lg border bg-white shadow-md"
          data-radix-aspect-ratio-wrapper
        >
          <video autoPlay muted loop className="overflow-hidden rounded-lg">
            <source
              src="https://leonelngoyadatabase.leonelngoya.com/sharuco-hero-video.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </section>
      <Toaster position="top-right" reverseOrder={false} />
      {user && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="subtle"
              className="fixed bottom-4 right-4 z-10 h-14 w-14 rounded-full p-0"
            >
              <Plus className="h-6 w-6" />
              <span className="sr-only">Open modal</span>
            </Button>
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
                <div
                  className="mt-4 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-gray-800 dark:text-yellow-300"
                  role="alert"
                >
                  <span className="font-medium">Warning alert!</span> :
                  Currently the modification and deletion of a code are not
                  available
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
                Submit
              </button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Layout>
  )
}
