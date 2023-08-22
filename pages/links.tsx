"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLogin } from "@/firebase/auth/githubLogin"
import { useCreateDocument } from "@/firebase/firestore/createDocument"
import { useDocument } from "@/firebase/firestore/getDocument"
import { useGetDocumentFromUser } from "@/firebase/firestore/getDocumentFromUser"
import { useUpdateUserDocument } from "@/firebase/firestore/updateUserDocument"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  Eye,
  EyeOff,
  FileCog,
  Github,
  LinkIcon,
  Loader2,
  Lock,
  Plus,
  Trash,
} from "lucide-react"
import moment from "moment"
import { useForm } from "react-hook-form"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import * as yup from "yup"

import { cn } from "@/lib/utils"
import CardLinkAdmin from "@/components/cards/card-link-admin"
import EmptyCard from "@/components/empty-card"
import { Layout } from "@/components/layout"
import LinksConnected from "@/components/links/LinksConnected"
import LinksNotConnected from "@/components/links/LinksNotConnected"
import LoaderLinks from "@/components/loaders/loader-links"
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

export default function Links() {
  const { user, userPseudo } = useAuthContext()
  const { login, isPending } = useGitHubLogin()
  const { toast } = useToast()

  const notifyCodeAdded = () =>
    toast({
      title: "Your link has been added successfully !",
      action: <ToastAction altText="Okay">Okay</ToastAction>,
    })

  const {
    data: dataUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useDocument(userPseudo, "users")

  const [openChangeVisibilityDialog, setOpenChangeVisibilityDialog] =
    useState(false)

  const { updateUserDocument }: any = useUpdateUserDocument("users")

  const changeVisibiltyForLinkPage = async (pseudo: string) => {
    let updatedUserData = {
      publicLinkPage: !dataUser.data.publicLinkPage,
    }
    updateUserDocument({ pseudo, updatedUserData })
    setOpenChangeVisibilityDialog(false)
    const description = dataUser.data.publicLinkPage
      ? "Your link page is now public anyone can access it."
      : "Your link page is kept private, you are the only person who can view it "
    toast({
      title: "Visibility changed",
      description: description,
      action: <ToastAction altText="Okay">Okay</ToastAction>,
    })
  }

  const schema = yup.object().shape({
    link: yup
      .string()
      .matches(
        /^(http|https):\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/,
        "Invalid link format"
      )
      .required(),
    description: yup.string().required(),
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

  const [openCreateLinkDialog, setOpenCreateLinkDialog] = useState(false)
  const { createDocument, isLoading, isError, isSuccess }: any =
    useCreateDocument("links")

  const onSubmit = async (data) => {
    const { link, description, tags } = data
    const tabTabs = tags
      ? tags.split(",").map((word) => word.trim().toLowerCase())
      : []
    if (tabTabs[tabTabs.length - 1] === "") {
      tabTabs.pop()
    }

    let newDocument = {
      link: link,
      description: description,
      tags: tabTabs,
      createdAt: moment().valueOf(),
      idAuthor: userPseudo,
    }

    createDocument(newDocument)

    reset({
      link: "",
      description: "",
      tags: "",
    })
  }

  useEffect(() => {
    if (isSuccess) {
      notifyCodeAdded()
      setOpenCreateLinkDialog(!isSuccess)
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
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
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
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <AlertDialog
              open={openCreateLinkDialog}
              onOpenChange={setOpenCreateLinkDialog}
            >
              <AlertDialogTrigger className="w-full shrink-0 sm:w-fit" asChild>
                <button
                  className={buttonVariants({ size: "lg" })}
                  onClick={() => setOpenCreateLinkDialog(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add new link
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="scrollbar-hide max-h-[640px] overflow-hidden overflow-y-auto">
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
                      <Label htmlFor="description">Decription of link</Label>
                      <Input
                        placeholder="Insert description of your link here..."
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
                      "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
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
            <div className="flex w-full flex-col gap-2 sm:w-fit sm:flex-row">
              {dataUser?.data?.publicLinkPage && (
                <Link
                  href={`/link/${userPseudo}`}
                  className={buttonVariants({ size: "lg", variant: "outline" })}
                >
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Your public links
                </Link>
              )}
              <AlertDialog
                open={openChangeVisibilityDialog}
                onOpenChange={setOpenChangeVisibilityDialog}
              >
                <AlertDialogTrigger asChild>
                  <button
                    className={buttonVariants({
                      size: "lg",
                      variant: "subtle",
                    })}
                    onClick={() => setOpenChangeVisibilityDialog(true)}
                  >
                    {dataUser?.data?.publicLinkPage ? (
                      <Eye className="mr-2 h-4 w-4" />
                    ) : (
                      <EyeOff className="mr-2 h-4 w-4" />
                    )}
                    Change visibility
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Do you want to change the visibility of your link page?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {dataUser?.data?.publicLinkPage ? (
                        <>
                          By passing privately your public link page will no
                          longer be available.
                        </>
                      ) : (
                        <>
                          By going in public everyone to see your links here :{" "}
                          <Link
                            href={`/link/${userPseudo}`}
                            className="font-bold hover:underline hover:underline-offset-4"
                          >
                            {`https://sharuco.lndev.me/link/${userPseudo}`}
                          </Link>
                        </>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <button
                      className={cn(
                        "inline-flex h-10 items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-600 dark:hover:bg-slate-200 dark:hover:text-slate-900 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                      )}
                      onClick={() => {
                        changeVisibiltyForLinkPage(userPseudo)
                      }}
                    >
                      {dataUser?.data?.publicLinkPage ? (
                        <>Change to private</>
                      ) : (
                        <>Change to public</>
                      )}
                    </button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ) : null}
        <Separator className="my-4" />
        {user ? <LinksConnected /> : <LinksNotConnected />}
      </section>
    </Layout>
  )
}
