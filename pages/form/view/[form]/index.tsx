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
  Terminal,
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

export default function FormViewPage() {
  const searchParams = useSearchParams()
  const { user } = useAuthContext()
  const router = useRouter()

  const pseudo = user?.reloadUserInfo.screenName.toLowerCase() || ""

  const { toast } = useToast()

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

  return (
    <Layout>
      <Head>
        <title>Sharuco | View Form</title>
        <meta
          name="description"
          content="Sharuco allows you to share code codes that you have found
          useful."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>{" "}
      <section className="fixed inset-0 z-50 bg-white dark:bg-slate-900">
        <div className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="flex w-full items-center justify-start">
            <Link href="/forms" className="font-bold flex items-center">
              <Terminal className="h-6 w-6 mr-2" />
              Sharuco Form
            </Link>
          </div>
          <Separator />
          {isLoadingForm && (
            <div className="flex w-full items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin" />
            </div>
          )}
          {dataForm &&
            dataForm.exists &&
            (dataForm.data.published || dataForm.data.idAuthor === pseudo) && (
              <div>Hello</div>
            )}
          {((dataForm && !dataForm.exists) ||
            (dataForm &&
              dataForm.exists &&
              !dataForm.data.published &&
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
                    className={buttonVariants({
                      size: "lg",
                      variant: "outline",
                    })}
                  >
                    Create your own form
                  </Link>
                </div>
              ) : (
                <Error />
              )}
            </>
          )}
          <Separator />
          <div className="flex w-full items-center justify-center">
            <Link href="/">
              Powered by{" "}
              <span className="font-bold hover:underline hover:underline-offset-4">
                Sharuco
              </span>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
