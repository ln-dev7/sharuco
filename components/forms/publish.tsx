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

export default function PublishForms({ dataForm }: { dataForm: any }) {
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
    updateFormDocument,
    isLoading: isLoadingUpdateForm,
    isError: isErrorUpdateForm,
    isSuccess: isSuccessUpdateForm,
  }: any = useUpdateFormDocument("forms")

  const changeStatutOfForm = async () => {
    let updatedFormData: {
      published: boolean
    } = {
      published: !dataForm?.published,
    }

    const id = searchParams.get("form")

    await updateFormDocument({ id, updatedFormData })

    toast({
      title: "Form status changed",
      description: `Your form is now ${
        !dataForm?.published ? "public" : "private"
      }`,
      action: <ToastAction altText="Okay">Okay</ToastAction>,
    })
  }

  return (
    <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed border-slate-300 dark:border-slate-700">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-4 p-4 text-center">
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
        <h3 className="text-md mt-4 font-semibold">
          {dataForm.published
            ? "Your form is currently online and can be viewed and answered by anyone at the link"
            : "Your form is not published so can only be seen by you alone"}
        </h3>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <p className="mb-4 mt-2 cursor-pointer text-sm text-muted-foreground underline underline-offset-4">
              Change the status of your form
            </p>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {dataForm.published
                  ? "Want to make your form private  ?"
                  : "Do you want to make your form public ?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {dataForm.published
                  ? "Your form will no longer be visible to anyone except you"
                  : "Your form will be visible to everyone and anyone will be able to answer it"}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => changeStatutOfForm()}>
                {dataForm.published ? "make private" : "make public"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div className="flex w-full flex-col items-center gap-2 md:flex-row">
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
                `https://sharuco.lndev.me/form/view/${searchParams.get("form")}`
              )
              notifyUrlCopied()
            }}
            className="w-full shrink-0 sm:w-fit"
          >
            Copy link
          </Button>
        </div>
      </div>
    </div>
  )
}
