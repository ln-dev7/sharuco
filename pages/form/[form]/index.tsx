"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
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
import { useUpdateFormDocument } from "@/firebase/firestore/updateFormDocument"
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
  FileQuestion,
  Heart,
  LinkIcon,
  Loader2,
  MessageSquare,
  Plus,
  Send,
  Settings,
  User,
  View,
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

export default function FormPage() {
  const searchParams = useSearchParams()
  const { user } = useAuthContext()
  const router = useRouter()

  const { toast } = useToast()

  useEffect(() => {
    if (!user) {
      router.push("/forms")
    }
  })

  const notifyUrlCopied = () =>
    toast({
      title: "Url of your code copied to clipboard",
      description: "You can share it wherever you want",
      action: <ToastAction altText="Okay">Okay</ToastAction>,
    })

  const pseudo = user?.reloadUserInfo.screenName.toLowerCase()

  const {
    data: dataForm,
    isLoading: isLoadingForm,
    isError: isErrorForm,
    error: errorForm,
  }: {
    data: any
    isLoading: boolean
    isError: boolean
    error: any
  } = useDocument(searchParams.get("form"), "forms")

  const {
    updateFormDocument,
    isLoading: isLoadingUpdateForm,
    isError: isErrorUpdateForm,
    isSuccess: isSuccessUpdateForm,
  }: any = useUpdateFormDocument("forms")

  const changeStatutOfForm = async () => {
    let updatedFormData: {
      published: boolean
    } = {
      published: !dataForm?.data?.published,
    }

    const id = searchParams.get("form")

    await updateFormDocument({ id, updatedFormData })

    toast({
      title: "Form status changed",
      description: `Your form is now ${
        !dataForm?.data?.published ? "public" : "private"
      }`,
      action: <ToastAction altText="Okay">Okay</ToastAction>,
    })
  }

  return (
    <Layout>
      <Head>
        <title>Sharuco | Form : {searchParams.get("form")}</title>
        <meta
          name="description"
          content="Sharuco allows you to share code codes that you have found
          useful."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>{" "}
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        {isLoadingForm && (
          <div className="flex w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        )}
        {dataForm && dataForm.exists && dataForm.data.idAuthor === pseudo && (
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col items-start gap-2">
              <h1 className="text-2xl font-extrabold leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-4xl">
                {dataForm.data.name}
              </h1>
              <p
                className={cn(
                  "text-sm font-medium leading-5 text-gray-500 dark:text-gray-400",
                  "sm:text-base md:text-lg lg:text-lg"
                )}
              >
                {dataForm.data.description}
              </p>
            </div>
            <Tabs defaultValue="questions" className="w-full">
              <TabsList>
                <div>
                  <TabsTrigger value="questions">
                    <FileQuestion className="mr-2 h-4 w-4" />
                    Questions
                  </TabsTrigger>
                  <TabsTrigger value="responses">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Responses
                  </TabsTrigger>
                  <TabsTrigger value="publish">
                    <Send className="mr-2 h-4 w-4" />
                    Publish
                  </TabsTrigger>
                </div>
              </TabsList>
              <TabsContent
                className="border-none p-0 pt-4"
                value="questions"
              ></TabsContent>
              <TabsContent className="border-none p-0 pt-4" value="responses">
                {dataForm.data.responses &&
                dataForm.data.responses.length > 0 ? (
                  <div></div>
                ) : (
                  <EmptyCard
                    icon={<MessageSquare className="h-8 w-8" />}
                    title="No responses yet"
                    description="Responses to your form will appear here"
                  />
                )}
              </TabsContent>
              <TabsContent className="border-none p-0 pt-4" value="publish">
                <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed border-slate-300 dark:border-slate-700">
                  <div className="mx-auto flex w-full max-w-xl flex-col gap-4 items-center justify-center text-center p-4">
                    <Link
                      href={`/form/view/${searchParams.get("form")}`}
                      className={buttonVariants({
                        size: "default",
                        variant: "subtle",
                      })}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View form
                    </Link>
                    <h3 className="mt-4 text-md font-semibold">
                      {dataForm.data.published
                        ? "Your form is currently online and can be viewed and answered by anyone at the link"
                        : "Your form is not published so can only be seen by you alone"}
                    </h3>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <p className="text-muted-foreground underline underline-offset-4 cursor-pointer mb-4 mt-2 text-sm">
                          Change the status of your form
                        </p>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {dataForm.data.published
                              ? "Want to make your form private  ?"
                              : "Do you want to make your form public ?"}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {dataForm.data.published
                              ? "Your form will no longer be visible to anyone except you"
                              : "Your form will be visible to everyone and anyone will be able to answer it"}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => changeStatutOfForm()}
                          >
                            {dataForm.data.published
                              ? "make private"
                              : "make public"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <div className="flex flex-col md:flex-row w-full items-center gap-2">
                      <Input
                        className="w-full"
                        type="text"
                        placeholder={`https://sharuco.lndev.me/form/view/${searchParams.get(
                          "form"
                        )}`}
                        value={`https://sharuco.lndev.me/form/view/${searchParams.get(
                          "form"
                        )}`}
                      />
                      <Button
                        onClick={() => {
                          copyToClipboard(
                            `https://sharuco.lndev.me/form/view/${searchParams.get(
                              "form"
                            )}`
                          )
                          notifyUrlCopied()
                        }}
                        className="shrink-0 w-full sm:w-fit"
                      >
                        Copy link
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
        {((dataForm && !dataForm.exists) ||
          (dataForm &&
            dataForm.exists &&
            dataForm.data.idAuthor !== pseudo)) && (
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold">This form does not exist.</h1>
            <Link
              href="/forms"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Create your own form
            </Link>
          </div>
        )}
        {isErrorForm && (
          <>
            {errorForm.message == "Missing or insufficient permissions." ? (
              <div className="flex flex-col items-center gap-4">
                <h1 className="text-2xl font-bold">
                  This form does not exist.
                </h1>
                <Link
                  href="/forms"
                  className={buttonVariants({ size: "lg", variant: "outline" })}
                >
                  Create your own form
                </Link>
              </div>
            ) : (
              <Error />
            )}
          </>
        )}
      </section>
    </Layout>
  )
}
