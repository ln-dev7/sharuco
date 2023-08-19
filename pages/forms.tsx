"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { colors, getRandomColor } from "@/constants/colors"
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
import CardForm from "@/components/cards/card-form"
import EmptyCard from "@/components/empty-card"
import { Layout } from "@/components/layout"
import LoaderForms from "@/components/loaders/loader-forms"
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
import { Textarea } from "@/components/ui/textarea"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export default function Forms() {
  const { user } = useAuthContext()
  const { login, isPending } = useGitHubLogin()
  const { toast } = useToast()

  const notifyCodeAdded = () =>
    toast({
      title: "Your form has been created successfully !",
      action: <ToastAction altText="Okay">Okay</ToastAction>,
    })

  const pseudo = user?.reloadUserInfo.screenName.toLowerCase()

  const {
    data: dataUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useDocument(pseudo, "users")

  const { updateUserDocument }: any = useUpdateUserDocument("users")

  const {
    isLoading: isLoadingForms,
    isError: isErrorForms,
    data: dataForms,
  } = useGetDocumentFromUser(pseudo, "forms")

  const schema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string().required(),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const [openCreateFormDialog, setOpenCreateFormDialog] = useState(false)
  const { createDocument, isLoading, isError, isSuccess }: any =
    useCreateDocument("forms")

  const onSubmit = async (data) => {
    const { name, description } = data

    let newDocument = {
      name: name,
      description: description,
      createdAt: moment().valueOf(),
      idAuthor: pseudo,
      color: getRandomColor(colors),
      published: false,
      questions: [],
      responses: [],
    }

    createDocument(newDocument)

    reset({
      name: "",
      description: "",
    })
  }

  useEffect(() => {
    if (isSuccess) {
      notifyCodeAdded()
      setOpenCreateFormDialog(!isSuccess)
    }
  }, [isSuccess])

  return (
    <Layout>
      <Head>
        <title>Sharuco | Forms</title>
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
            Sharuco Form
          </h1>
          <p
            className={cn(
              "text-sm font-medium leading-5 text-gray-500 dark:text-gray-400",
              "sm:text-base md:text-lg lg:text-lg"
            )}
          >
            Create and share forms to receive answers very quickly.
          </p>
        </div>
        {user ? (
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <AlertDialog
              open={openCreateFormDialog}
              onOpenChange={setOpenCreateFormDialog}
            >
              <AlertDialogTrigger className="w-full shrink-0 sm:w-fit" asChild>
                <button
                  className={buttonVariants({ size: "lg" })}
                  onClick={() => setOpenCreateFormDialog(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create new form
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="scrollbar-hide max-h-[640px] overflow-hidden overflow-y-auto">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                      Create new form
                    </h3>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    <div className="mb-4 flex w-full flex-col items-start gap-1.5">
                      <Label htmlFor="code">Insert name</Label>
                      <Input
                        placeholder="Insert name of your form here..."
                        id="name"
                        {...register("name")}
                      />
                      <p className="text-sm text-red-500">
                        {errors.name && <>{errors.name.message}</>}
                      </p>
                    </div>
                    <div className="flex w-full flex-col items-start gap-1.5">
                      <Label htmlFor="description">Decription of form</Label>
                      <Textarea
                        placeholder="Insert description of your form..."
                        id="description"
                        className="h-24"
                        {...register("description")}
                      />
                      <p className="text-sm text-red-500">
                        {errors.description && (
                          <>{errors.description.message}</>
                        )}
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
          </div>
        ) : null}
        <Separator className="my-4" />
        {user ? (
          <>
            {isLoadingForms && <LoaderForms />}
            {dataForms && (
              <>
                {dataForms.length > 0 && (
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
                      {dataForms.map(
                        (form: {
                          id: string
                          idAuthor: string
                          name: string
                          description: string
                          color: string
                          responses: any[]
                          createdAt: any
                        }) => (
                          <CardForm
                            key={form.id}
                            id={form.id}
                            idAuthor={form.idAuthor}
                            name={form.name}
                            description={form.description}
                            color={form.color}
                            responses={form.responses}
                            createdAt={form.createdAt}
                          />
                        )
                      )}
                    </Masonry>
                  </ResponsiveMasonry>
                )}
                {dataForms.length == 0 && (
                  <EmptyCard
                    icon={<FileCog className="h-12 w-12" />}
                    title="No form found"
                    description="You have not added any form yet."
                  />
                )}
              </>
            )}
            {isErrorForms && (
              <EmptyCard
                icon={<FileCog className="h-12 w-12" />}
                title="An error has occurred"
                description="An error has occurred, please try again later or refresh the page."
              />
            )}
          </>
        ) : (
          <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed border-slate-300 dark:border-slate-700">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <Lock className="h-12 w-12" />
              <h3 className="mt-4 text-lg font-semibold">Access denied</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                To access Sharuco Form you must first be logged in.
              </p>
              <button
                className={cn(
                  "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
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
