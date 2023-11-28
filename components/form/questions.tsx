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
import algoliasearch from "algoliasearch"
import hljs from "highlight.js"
import {
  AlignJustify,
  Calendar,
  Check,
  CircleDot,
  Eye,
  EyeOff,
  FileCog,
  FileQuestion,
  Heading,
  Heart,
  LinkIcon,
  List,
  ListChecks,
  Loader2,
  Mail,
  MessageSquare,
  Minus,
  Plus,
  Save,
  Send,
  Settings,
  Trash,
  Type,
  User,
  View,
  X,
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
  const params = useParams()
  const { user, userPseudo } = useAuthContext()
  const router = useRouter()

  const { toast } = useToast()

  const notifyUrlCopied = () =>
    toast({
      title: "Url of your code copied to clipboard",
      description: "You can share it wherever you want",
      action: <ToastAction altText="Okay">Okay</ToastAction>,
    })

  const {
    updateFormDocument,
    isLoading: isLoadingUpdateForm,
    isError: isErrorUpdateForm,
    error: errorUpdateForm,
    isSuccess: isSuccessUpdateForm,
    reset: resetUpdateForm,
  }: any = useUpdateFormDocument("forms")

  type QuestionType =
    | "heading"
    | "text"
    | "email"
    | "link"
    | "longtext"
    | "date"
    | "uniquechoice"
    | "listchoice"
    | "multiplechoice"

  interface Question {
    text: string
    type: QuestionType
    label: string
  }

  interface FormData {
    questions: Question[]
  }

  const schema = yup.object().shape({
    questions: yup.array().of(
      yup.object().shape({
        label: yup.string().required("The label is required"),
        //text: yup.string().required("The placeholder is required"),
      })
    ),
  })

  const handleAddField = (type: QuestionType) => {
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  })

  useEffect(() => {
    setValue("questions", dataForm.questions)
  }, [dataForm, setValue])

  const handleRemoveField = (index: number) => {
    remove(index)
  }

  const ALGOLIA_INDEX_NAME = "forms"

  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_KEY
  )
  const index = client.initIndex(ALGOLIA_INDEX_NAME)

  const onSubmit = async (data: FormData) => {
    //console.log(data)

    let updatedFormData: {
      questions: Question[]
    } = {
      questions: data.questions,
    }

    const id = params["form"]

    await updateFormDocument({ id, updatedFormData })

    await index.partialUpdateObject({
      objectID: id,
      questions: data.questions,
    })
  }

  return (
    <div className="flex w-full flex-col items-start gap-4 sm:flex-row">
      {dataForm.idAuthor === userPseudo && (
        <>
          <div className="flex w-full shrink-0 flex-col items-start gap-2 rounded-md sm:sticky sm:top-20 sm:w-[250px]">
            <button
              onClick={() => handleAddField("heading")}
              className="flex w-full items-center justify-start gap-1 rounded-md px-4 py-2 hover:bg-slate-100 hover:dark:bg-slate-800"
            >
              <Heading className="h-5 w-5" />
              <span className="ml-2 text-sm font-semibold">Heading</span>
            </button>
            <button
              onClick={() => handleAddField("text")}
              className="flex w-full items-center justify-start gap-1 rounded-md px-4 py-2 hover:bg-slate-100 hover:dark:bg-slate-800"
            >
              <Minus className="h-5 w-5" />
              <span className="ml-2 text-sm font-semibold">Short answer</span>
            </button>
            <button
              onClick={() => handleAddField("longtext")}
              className="flex w-full items-center justify-start gap-1 rounded-md px-4 py-2 hover:bg-slate-100 hover:dark:bg-slate-800"
            >
              <AlignJustify className="h-5 w-5" />
              <span className="ml-2 text-sm font-semibold">Long answer</span>
            </button>
            <button
              //onClick={() => handleAddField("link")}
              className="flex w-full items-center justify-start gap-1 rounded-md px-4 py-2 hover:bg-slate-100 hover:dark:bg-slate-800"
            >
              <LinkIcon className="h-5 w-5" />
              <span className="ml-2 text-sm font-semibold">Link</span>
              <span className="mr-2 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                soon
              </span>
            </button>
            <button
              //onClick={() => handleAddField("email")}
              className="flex w-full items-center justify-start gap-1 rounded-md px-4 py-2 hover:bg-slate-100 hover:dark:bg-slate-800"
            >
              <Mail className="h-5 w-5" />
              <span className="ml-2 text-sm font-semibold">E-mail</span>
              <span className="mr-2 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                soon
              </span>
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
              <span className="ml-2 text-sm font-semibold">
                List of choices
              </span>
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
        </>
      )}
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
          {fields.map((field, index) => {
            const watchedFieldType = watch(`questions[${index}].type`)
            return (
              <div
                className="relative flex w-full flex-col items-start gap-2 first:mt-2"
                key={field.id}
              >
                <label className="flex w-3/4 flex-col items-start">
                  {watchedFieldType === "heading" ? (
                    <Input
                      {...register(`questions.${index}.label` as const)}
                      //defaultValue={field.label}
                      className="text-md h-6 border-none p-0 font-semibold outline-none hover:border-none hover:outline-none hover:ring-0 focus:border-none focus:outline-none focus:ring-0"
                      placeholder="Your label"
                    />
                  ) : (
                    <Input
                      {...register(`questions.${index}.label` as const)}
                      //defaultValue={field.label}
                      className="h-8 border-none pl-0 outline-none hover:border-none hover:outline-none hover:ring-0 focus:border-none focus:outline-none focus:ring-0"
                      placeholder="Your label"
                    />
                  )}

                  {errors?.questions?.[index]?.label && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {errors.questions[index].label.message}
                    </p>
                  )}
                </label>
                {(watchedFieldType === "text" ||
                  watchedFieldType === "email" ||
                  watchedFieldType === "link") && (
                  <Input
                    {...register(`questions.${index}.text` as const)}
                    placeholder="Enter placeholder"
                    //placeholder={field.text}
                  />
                )}
                {watchedFieldType === "longtext" && (
                  <Textarea
                    {...register(`questions.${index}.text` as const)}
                    placeholder="Enter placeholder"
                  />
                )}
                <div className="flex w-full items-center justify-start">
                  <span className="mr-2 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                    {watchedFieldType}
                  </span>
                </div>
                {/* {errors?.questions?.[index]?.text && (
                <p>{errors.questions[index].text.message}</p>
              )} */}
                {dataForm.idAuthor === userPseudo && (
                  <Button
                    variant="destructive"
                    className="absolute -top-2 right-2 flex h-10 w-10 items-center justify-center rounded-full p-2"
                    onClick={() => handleRemoveField(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )
          })}
          {fields.length < 1 && (
            <EmptyCard
              icon={<FileQuestion className="h-8 w-8" />}
              title="No questions yet"
              description="Click on the buttons above to add questions to your form"
            />
          )}
        </div>
        <Separator className="my-2 w-full" />

        {isSuccessUpdateForm && (
          <div
            className="flex w-full items-center rounded-lg bg-green-50 p-4 text-green-800 dark:bg-gray-800 dark:text-green-400"
            role="alert"
          >
            <Check className="h-4 w-4" />
            <span className="sr-only">Info</span>
            <div className="ml-3 text-sm font-medium">
              Your questions have been updated
            </div>
            <button
              type="button"
              className="-m-1.5 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 p-1.5 text-green-500 hover:bg-green-200 focus:ring-2 focus:ring-green-400 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
              onClick={resetUpdateForm}
            >
              <span className="sr-only">Close</span>
              <X />
            </button>
          </div>
        )}
        {dataForm.idAuthor === userPseudo && (
          <Button
            variant="outline"
            disabled={isLoadingUpdateForm}
            onClick={isLoadingUpdateForm ? undefined : handleSubmit(onSubmit)}
          >
            {isLoadingUpdateForm ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save questions
          </Button>
        )}
      </div>
    </div>
  )
}
