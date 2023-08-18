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

export default function QuestionsForms({ dataForm }: { dataForm: any }) {
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

  interface Question {
    text: string
    type:
      | "text"
      | "longtext"
      | "date"
      | "uniquechoice"
      | "listchoice"
      | "multiplechoice"
    label: string
  }

  interface FormData {
    questions: Question[]
  }

  const schema = yup.object().shape({
    questions: yup.array().of(
      yup.object().shape({
        label: yup.string().required("The label is required"),
        //text: yup.string().required("La réponse est requise"),
      })
    ),
  })

  const handleAddField = (
    type:
      | "text"
      | "longtext"
      | "date"
      | "uniquechoice"
      | "listchoice"
      | "multiplechoice"
  ) => {
    append({ type, text: "", label: "" })
  }

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: dataForm,
  })
  const watchedFields = watch("questions", [])
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  })

  // useEffect(() => {
  //   setValue("questions", dataForm.questions)
  // }, [dataForm, setValue])

  const handleRemoveField = (index: number) => {
    remove(index)
  }

  const onSubmit = async (data: FormData) => {
    //console.log(data)

    let updatedFormData: {
      questions: Question[]
    } = {
      questions: data.questions,
    }

    const id = searchParams.get("form")

    await updateFormDocument({ id, updatedFormData })

    toast({
      title: "Questions updated",
      description: `Your questions have been updated`,
      action: <ToastAction altText="Okay">Okay</ToastAction>,
    })
  }

  return (
    <div className="flex w-full flex-col items-start gap-4 sm:flex-row">
      <div className="flex w-full shrink-0 flex-col items-start gap-2 rounded-md sm:w-[250px]">
        <button
          onClick={() => handleAddField("text")}
          className="flex w-full items-center justify-start gap-1 rounded-md px-4 py-2 hover:bg-slate-100 hover:dark:bg-slate-800"
        >
          <Type className="h-5 w-5" />
          <span className="ml-2 text-sm font-semibold">Short answer</span>
        </button>
        <button
          onClick={() => handleAddField("longtext")}
          className="flex w-full items-center justify-start gap-1 rounded-md px-4 py-2 hover:bg-slate-100 hover:dark:bg-slate-800"
        >
          <Type className="h-5 w-5" />
          <span className="ml-2 text-sm font-semibold">Long answer</span>
        </button>
        <button className="flex w-full cursor-default items-center justify-start gap-1 rounded-md px-4 py-2 hover:bg-slate-100 hover:dark:bg-slate-800">
          <CircleDot className="h-5 w-5" />
          <span className="ml-2 text-sm font-semibold">Unique choice</span>
          <span className="mr-2 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            soon
          </span>
        </button>
        <button className="flex w-full cursor-default items-center justify-start gap-1 rounded-md px-4 py-2 hover:bg-slate-100 hover:dark:bg-slate-800">
          <ListChecks className="h-5 w-5" />
          <span className="ml-2 text-sm font-semibold">Multi choice</span>
          <span className="mr-2 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            soon
          </span>
        </button>
        <button className="flex w-full cursor-default items-center justify-start gap-1 rounded-md px-4 py-2 hover:bg-slate-100 hover:dark:bg-slate-800">
          <List className="h-5 w-5" />
          <span className="ml-2 text-sm font-semibold">List of choices</span>
          <span className="mr-2 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            soon
          </span>
        </button>
        <button className="flex w-full cursor-default items-center justify-start gap-1 rounded-md px-4 py-2 hover:bg-slate-100 hover:dark:bg-slate-800">
          <Calendar className="h-5 w-5" />
          <span className="ml-2 text-sm font-semibold">Date</span>
          <span className="mr-2 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            soon
          </span>
        </button>
        <Separator className="my-2 hidden w-full sm:block" />
      </div>
      <Separator className="my-2 block w-full sm:hidden" />
      <div
        id="questions"
        className="relative flex w-full flex-col items-start gap-4 overflow-hidden rounded-md border px-4 pb-4 pt-7"
      >
        <div
          className={`absolute inset-x-0 top-0 h-3 w-full`}
          style={{
            background: `${dataForm.color}`,
          }}
        ></div>
        <div className="w-full space-y-6">
          {fields.map((field, index) => (
            <div
              className="relative flex w-full flex-col items-start gap-2 first:mt-2"
              key={field.id}
            >
              <label className="flex flex-col items-start">
                <Input
                  {...register(`questions.${index}.label` as const)}
                  //defaultValue={field.label}
                  className="h-8 border-none outline-none"
                  placeholder="Your question"
                />
                {errors?.questions?.[index]?.label && (
                  <p className="text-xs font-medium text-red-500 mt-1">
                    {errors.questions[index].label.message}
                  </p>
                )}
              </label>
              {watchedFields[index]?.type === "text" && (
                <Input
                  {...register(`questions.${index}.text` as const)}
                  placeholder="Enter placeholder"
                  //placeholder={field.text}
                />
              )}
              {watchedFields[index]?.type === "longtext" && (
                <Textarea
                  {...register(`questions.${index}.text` as const)}
                  placeholder="Enter placeholder"
                />
              )}
              {/* {errors?.questions?.[index]?.text && (
              <p>{errors.questions[index].text.message}</p>
            )} */}
              <Button
                variant="destructive"
                className="absolute -top-2 right-2 flex h-10 w-10 items-center justify-center rounded-full p-2"
                onClick={() => handleRemoveField(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {fields.length < 1 && (
            <EmptyCard
              icon={<FileQuestion className="h-8 w-8" />}
              title="No questions yet"
              description="Click on the buttons above to add questions to your form"
            />
          )}
        </div>
        <Separator className="my-2 w-full" />
        <Button variant="outline" onClick={handleSubmit(onSubmit)}>
          <Save className="mr-2 h-4 w-4" />
          Save questions
        </Button>
      </div>
    </div>
  )
}