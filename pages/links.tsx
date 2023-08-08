"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLogin } from "@/firebase/auth/githubLogin"
import { useCreateDocument } from "@/firebase/firestore/createDocument"
import { useGetDocumentFromUser } from "@/firebase/firestore/getDocumentFromUser"
import { yupResolver } from "@hookform/resolvers/yup"
import { FileCog, Github, Loader2, Lock, Plus } from "lucide-react"
import moment from "moment"
import { useForm } from "react-hook-form"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import * as yup from "yup"

import { cn } from "@/lib/utils"
import CardLink from "@/components/card-link"
import EmptyCard from "@/components/empty-card"
import { Layout } from "@/components/layout"
import LoaderLinks from "@/components/loader-links"
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
import { Separator } from "@/components/ui/separator"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export default function Dashboard() {
  const { user } = useAuthContext()
  const { login, isPending } = useGitHubLogin()
  const { toast } = useToast()

  const notifyCodeAdded = () =>
    toast({
      title: "Your link has been added successfully !",
      action: <ToastAction altText="Okay">Okay</ToastAction>,
    })

  const pseudo = user?.reloadUserInfo.screenName.toLowerCase()

  const {
    isLoading: isLoadingLinks,
    isError: isErrorLinks,
    data: dataLinks,
  } = useGetDocumentFromUser(pseudo, "links")

  const schema = yup.object().shape({
    link: yup
      .string()
      .matches(
        /^(http|https):\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/,
        "Invalid link format"
      )
      .required(),
    name: yup.string().required(),
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
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const [openDialog, setOpenDialog] = useState(false)
  const { createDocument, isLoading, isError, isSuccess }: any =
    useCreateDocument("links")

  const onSubmit = async (data) => {
    const { link, name, tags } = data
    const tabTabs = tags
      ? tags.split(",").map((word) => word.trim().toLowerCase())
      : []
    if (tabTabs[tabTabs.length - 1] === "") {
      tabTabs.pop()
    }

    let newDocument = {
      link: link,
      name: name,
      tags: tabTabs,
      createdAt: moment().valueOf(),
      idAuthor: pseudo,
    }

    createDocument(newDocument)

    reset({
      link: "",
      name: "",
      tags: "",
    })
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
        <title>Sharuco | Links</title>
        <meta
          name="description"
          content="Sharuco allows you to share code codes that you have found
         useful."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sharuco" />
        <meta name="twitter:description" content="Your dashboard on Sharuco" />
        <meta
          name="twitter:image"
          content="https://sharuco.lndev.me/sharuco-dashboard.png"
        />

        <meta property="og:title" content="Sharuco Dashboard" />
        <meta property="og:description" content="Your dashboard on Sharuco" />
        <meta
          property="og:image"
          content="https://sharuco.lndev.me/sharuco-§123443dashboard.png"
        />
        <meta property="og:url" content="https://sharuco.lndev.me/dashboard" />
        <meta property="og:type" content="website" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-2xl font-extrabold leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-4xl">
            Sharuco Link
          </h1>
          <p
            className={cn(
              "text-sm font-medium leading-5 text-gray-500 dark:text-gray-400",
              "sm:text-base md:text-lg lg:text-lg"
            )}
          >
            Keep the links that you found useful and that will help you later.
          </p>
        </div>
        {user ? (
          <div className="flex flex-col justify-between gap-2 sm:flex-row">
            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
              <AlertDialogTrigger asChild>
                <button
                  className={buttonVariants({ size: "lg" })}
                  onClick={() => setOpenDialog(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add new link
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-h-[640px] overflow-hidden overflow-y-auto scrollbar-hide">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                      Add new link
                    </h3>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    <div className="mb-4 flex w-full flex-col items-start gap-1.5">
                      <Label htmlFor="code">Insert your link</Label>
                      <Input
                        placeholder="Insert your link here..."
                        id="code"
                        {...register("link")}
                      />
                      <p className="text-sm text-red-500">
                        {errors.link && <>{errors.link.message}</>}
                      </p>
                    </div>
                    <div className="mb-4 flex w-full flex-col items-start gap-1.5">
                      <Label htmlFor="description">Name of link</Label>
                      <Input
                        placeholder="Insert name of your link here..."
                        id="description"
                        {...register("name")}
                      />
                      <p className="text-sm text-red-500">
                        {errors.name && <>{errors.name.message}</>}
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
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Add
                  </button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {/* <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href={`/user/${pseudo}`}
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              <User className="mr-2 h-4 w-4" />
              Your profile
            </Link>
          </div> */}
          </div>
        ) : null}
        <Separator className="my-4" />
        {user ? (
          <>
            {isLoadingLinks && <LoaderLinks />}
            {dataLinks && (
              <>
                {dataLinks.length > 0 && (
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
                      {dataLinks.map(
                        (link: {
                          id: string
                          idAuthor: string
                          link: string
                          name: string
                          tags: string[]
                          createdAt: any
                        }) => (
                          <CardLink
                            key={link.id}
                            id={link.id}
                            idAuthor={link.idAuthor}
                            link={link.link}
                            name={link.name}
                            tags={link.tags}
                            createdAt={link.createdAt}
                          />
                        )
                      )}
                    </Masonry>
                  </ResponsiveMasonry>
                )}
                {dataLinks.length == 0 && (
                  <EmptyCard
                    icon={<FileCog className="h-12 w-12" />}
                    title="No link found"
                    description="You have not added any link yet."
                  />
                )}
              </>
            )}
            {isErrorLinks && (
              <EmptyCard
                icon={<FileCog className="h-12 w-12" />}
                title="An error has occurred"
                description="An error has occurred, please try again later."
              />
            )}
          </>
        ) : (
          <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed border-slate-300 dark:border-slate-700">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <Lock className="h-12 w-12" />
              <h3 className="mt-4 text-lg font-semibold">Access denied</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                To access Sharuco Link you must first be logged in.
              </p>
              <button
                className={cn(
                  "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 py-2 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                )}
                disabled={isPending}
                onClick={login}
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Github className="mr-2 h-4 w-4" />
                )}
                Login with Github
              </button>
            </div>
          </div>
        )}
      </section>
    </Layout>
  )
}
