"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
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
  Calendar,
  CircleDot,
  Eye,
  EyeOff,
  FileCog,
  FileQuestion,
  Heart,
  LinkIcon,
  List,
  ListChecks,
  Loader2,
  MessageSquare,
  Plus,
  Save,
  Send,
  Settings,
  Settings2,
  Trash,
  Type,
  User,
  View,
} from "lucide-react"
import moment from "moment"
import { useFieldArray, useForm } from "react-hook-form"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import * as yup from "yup"

import { TemplateName } from "@/types/templatStackblitzName"
import { cn } from "@/lib/utils"
import CardCode from "@/components/cards/card-code"
import CardCodeAdmin from "@/components/cards/card-code-admin"
import EmptyCard from "@/components/empty-card"
import Error from "@/components/error"
import PublishForms from "@/components/form/publish"
import QuestionsForms from "@/components/form/questions"
import ResponsesForms from "@/components/form/responses"
import SettingsForms from "@/components/form/settings"
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
  DialogFooter,
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
  const params = useParams()
  const { user, userPseudo } = useAuthContext()
  const router = useRouter()

  const { toast } = useToast()

  useEffect(() => {
    if (!user) {
      router.push("/forms")
    }
  })

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
  } = useDocument(params["form"], "forms")

  const goToForm = (id) => {
    router.push(`/form/${id}`)
  }

  const {
    isLoading: isLoadingForms,
    isError: isErrorForms,
    data: dataForms,
  } = useGetDocumentFromUser(userPseudo, "forms")

  return (
    <Layout>
      <Head>
        <title>Sharuco | Form : {params["form"]}</title>
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
        {dataForm &&
          dataForm.exists &&
          dataForm.data.idAuthor === userPseudo && (
            <div className="flex w-full flex-col gap-4">
              <div className="flex w-full flex-col items-start justify-between gap-4 md:flex-row">
                <div className="flex flex-col items-start gap-2">
                  <h1 className="text-2xl font-extrabold leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-4xl">
                    {dataForm.data.name}
                  </h1>
                  <p className="text-sm font-medium leading-5 text-gray-500 dark:text-gray-400 sm:text-base md:text-lg lg:text-lg">
                    {dataForm.data.description}
                  </p>
                </div>
                <div className="md:mtb-0 mb-3">
                  <Select onValueChange={(value) => goToForm(value)}>
                    <SelectTrigger className="w-[240px]">
                      <SelectValue placeholder="Select a form" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Your Forms</SelectLabel>
                        {dataForms.map((form) => (
                          <SelectItem key={form.id} value={form.id}>
                            {form.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
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
                      <span className="ml-2 flex items-center justify-center rounded-md bg-slate-200 px-1 dark:bg-slate-700">
                        {dataForm.data.responses.length}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="publish">
                      <Send className="mr-2 h-4 w-4" />
                      Publish
                    </TabsTrigger>
                    <TabsTrigger value="settings">
                      <Settings2 className="mr-2 h-4 w-4" />
                      Settings
                    </TabsTrigger>
                  </div>
                </TabsList>
                <TabsContent className="border-none p-0 pt-4" value="questions">
                  <ResponsiveMasonry
                    columnsCountBreakPoints={{
                      659: 1,
                      660: 1,
                      720: 1,
                      1200: 1,
                    }}
                    className="w-full"
                  >
                    <Masonry gutter="1rem">
                      <QuestionsForms dataForm={dataForm.data} />
                    </Masonry>
                  </ResponsiveMasonry>
                </TabsContent>
                <TabsContent className="border-none p-0 pt-2" value="responses">
                  <ResponsiveMasonry
                    columnsCountBreakPoints={{
                      659: 1,
                      660: 1,
                      720: 1,
                      1200: 1,
                    }}
                    className="w-full"
                  >
                    <Masonry gutter="1rem">
                      <ResponsesForms dataForm={dataForm.data} />
                    </Masonry>
                  </ResponsiveMasonry>
                </TabsContent>
                <TabsContent className="border-none p-0 pt-2" value="publish">
                  <ResponsiveMasonry
                    columnsCountBreakPoints={{
                      659: 1,
                      660: 1,
                      720: 1,
                      1200: 1,
                    }}
                    className="w-full"
                  >
                    <Masonry gutter="1rem">
                      <PublishForms dataForm={dataForm.data} />
                    </Masonry>
                  </ResponsiveMasonry>
                </TabsContent>
                <TabsContent className="border-none p-0 pt-2" value="settings">
                  <ResponsiveMasonry
                    columnsCountBreakPoints={{
                      659: 1,
                      660: 1,
                      720: 1,
                      1200: 1,
                    }}
                    className="w-full"
                  >
                    <Masonry gutter="1rem">
                      <SettingsForms dataForm={dataForm.data} />
                    </Masonry>
                  </ResponsiveMasonry>
                </TabsContent>
              </Tabs>
            </div>
          )}
        {((dataForm && !dataForm.exists) ||
          (dataForm &&
            dataForm.exists &&
            dataForm.data.idAuthor !== userPseudo)) && (
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
