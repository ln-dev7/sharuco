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
import { useDeleteDocument } from "@/firebase/firestore/deleteDocument"
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
import { data } from "cheerio/lib/api/attributes.js"
import hljs from "highlight.js"
import {
  Calendar,
  Check,
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

export default function SettingsForms({ dataForm }: { dataForm: any }) {
  const params = useParams()
  const { user, userPseudo } = useAuthContext()
  const router = useRouter()

  const id = params["form"] as string

  const { toast } = useToast()

  const notifyUrlCopied = () =>
    toast({
      title: "Url of your code copied to clipboard",
      description: "You can share it wherever you want",
      action: <ToastAction altText="Okay">Okay</ToastAction>,
    })

  const ALGOLIA_INDEX_NAME = "forms"

  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_KEY
  )
  const index = client.initIndex(ALGOLIA_INDEX_NAME)

  const [checkboxAcceptPayment, setCheckboxAcceptPayment] = useState(
    dataForm.acceptPayment
  )

  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
    color: yup
      .string()
      .matches(
        /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
        'Color must be a valid hex color code starting with "#"'
      )
      .required("Color is required"),
    redirectOnCompletion: yup
      .string()
      .url("Redirect URL must be a valid URL")
      .nullable(),
    // acceptPayment: yup.boolean(),
    // publicNotchPayApiKey: yup.string().when("acceptPayment", {
    //   is: true,
    //   then: (schema) =>
    //     schema
    //       .matches(
    //         /^(sb\.|b\.|pk\.)/,
    //         'Public NotchPay API key must start with "pk." or "b." or "sb."'
    //       )
    //       .required("Public NotchPay API key is required"),
    // }),
    // amountNotchPay: yup.number().when("acceptPayment", {
    //   is: true,
    //   then: (schema) =>
    //     schema
    //       .min(2, "Amount for NotchPay must be greater than 2")
    //       .typeError("Amount for NotchPay must be a valid number")
    //       .required("Amount for NotchPay is required"),
    // }),
  })

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    setValue("name", dataForm.name)
    setValue("description", dataForm.description)
    setValue("color", dataForm.color)
    setValue("redirectOnCompletion", dataForm.redirectOnCompletion)
    // setValue("publicNotchPayApiKey", dataForm.publicNotchPayApiKey)
    // setValue("amountNotchPay", dataForm.amountNotchPay)
    // setValue("acceptPayment", dataForm.acceptPayment)
  }, [dataForm])

  const {
    updateFormDocument,
    isLoading: isLoadingUpdateForm,
    isError: isErrorUpdateForm,
    isSuccess: isSuccessUpdateForm,
    reset: resetUpdateForm,
  }: any = useUpdateFormDocument("forms")

  const { deleteDocument, isLoading: isLoadingDelete }: any =
    useDeleteDocument("forms")

  const [confirmFormName, setConfirmFormName] = useState("")
  const handleDeleteDocument = () => {
    deleteDocument(id)
    index.deleteObject(id)
    router.push("/forms")
  }

  const onSubmit = async (data) => {
    const {
      name: nameUpdate,
      description: descriptionUpdate,
      color: colorUpdate,
      redirectOnCompletion: redirectOnCompletionUpdate,
      // publicNotchPayApiKey: publicNotchPayApiKeyUpdate,
      // amountNotchPay: amountNotchPayUpdate,
      // acceptPayment: acceptPaymentUpdate,
    } = data

    if (
      nameUpdate === dataForm.name &&
      descriptionUpdate === dataForm.description &&
      colorUpdate === dataForm.color &&
      redirectOnCompletionUpdate === dataForm.redirectOnCompletion
      // && publicNotchPayApiKeyUpdate === dataForm.publicNotchPayApiKey &&
      // amountNotchPayUpdate === dataForm.amountNotchPay &&
      // acceptPaymentUpdate === dataForm.acceptPayment
    ) {
      toast({
        variant: "destructive",
        title: "You have not made any changes",
        description: "Please make changes to update your settings",
        action: <ToastAction altText="Okay">Okay</ToastAction>,
      })
      return
    }

    let updatedFormData: {
      name: string
      description: string
      color: string
      redirectOnCompletion: string
      // publicNotchPayApiKey: string
      // amountNotchPay: number
      // acceptPayment: boolean
    } = {
      name: nameUpdate,
      description: descriptionUpdate,
      color: colorUpdate,
      redirectOnCompletion: redirectOnCompletionUpdate,
      // publicNotchPayApiKey: publicNotchPayApiKeyUpdate,
      // amountNotchPay: amountNotchPayUpdate,
      // acceptPayment: acceptPaymentUpdate,
    }

    await updateFormDocument({ id, updatedFormData })

    await index.partialUpdateObject({
      objectID: id,
      name: nameUpdate,
      description: descriptionUpdate,
      color: colorUpdate,
      redirectOnCompletion: redirectOnCompletionUpdate,
      // publicNotchPayApiKey: publicNotchPayApiKeyUpdate,
      // amountNotchPay: amountNotchPayUpdate,
      // acceptPayment: acceptPaymentUpdate,
    })

    reset({
      name: nameUpdate,
      description: descriptionUpdate,
      color: colorUpdate,
      redirectOnCompletion: redirectOnCompletionUpdate,
      // publicNotchPayApiKey: publicNotchPayApiKeyUpdate,
      // amountNotchPay: amountNotchPayUpdate,
      // acceptPayment: acceptPaymentUpdate,
    })
  }

  return (
    <div className="flex shrink-0 items-center justify-center rounded-md py-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-start justify-center gap-4 text-center">
        <div className="flex flex-col items-start">
          <h3 className="text-xl font-semibold">General</h3>
        </div>
        <Separator className="opacity-50" />
        <div className="flex w-full flex-col items-start gap-2">
          <Label>Name</Label>
          <Input
            placeholder="Name of the form"
            {...register("name")}
            defaultValue={dataForm.name}
          />
          <p className="text-sm text-red-500">
            {errors.name && <>{errors.name.message}</>}
          </p>
        </div>
        <div className="flex w-full flex-col items-start gap-2">
          <Label>Description</Label>
          <Textarea
            placeholder="Description of the form"
            className="h-24"
            {...register("description")}
          />
          <p className="text-sm text-red-500">
            {errors.description && <>{errors.description.message}</>}
          </p>
        </div>

        <div className="flex w-full flex-col items-start gap-2">
          <Label>Color of the form</Label>
          <div className="flex w-full items-center gap-2">
            <Input
              className="w-full"
              placeholder="#000000"
              {...register("color")}
            />
            <div
              className="block h-9 w-9 shrink-0 rounded-full"
              style={{
                background: `${dataForm.color}`,
              }}
            ></div>
          </div>
          <p className="text-sm text-red-500">
            {errors.color && <>{errors.color.message}</>}
          </p>
        </div>
        <div className="flex w-full flex-col items-start gap-2">
          <div className="flex w-full flex-col items-start gap-1">
            <Label className="text-left">
              Redirect to this URL when the form is submitted.
            </Label>
            <p className="text-left text-sm">
              Leave the field blank if you do not want to redirect to a URL
            </p>
          </div>
          <Input
            placeholder="https://example.com?success=true"
            {...register("redirectOnCompletion")}
          />
          <p className="text-sm text-red-500">
            {errors.redirectOnCompletion && (
              <>{errors.redirectOnCompletion.message}</>
            )}
          </p>
        </div>
        {/* <Separator className="my-2" />
        <div className="flex flex-col items-start">
          <h3 className="text-xl font-semibold">Payment</h3>
          <p className="text-left text-sm">
            You can use{" "}
            <a
              href="https://business.notchpay.co"
              className="font-bold underline underline-offset-4"
            >
              NotchPay
            </a>{" "}
            to accept payments on your form. You can create a NotchPay account{" "}
            <a
              href="https://business.notchpay.co"
              className="font-bold underline underline-offset-4"
            >
              here
            </a>
            .
          </p>
        </div>
        <Separator className="opacity-50" />
        <div className="flex w-full flex-col items-start gap-2">
          <div className="flex w-full flex-col items-start gap-1">
            <Label>Public NotchPay API key</Label>
            <p className="text-left text-sm">
              You can have it here :{" "}
              <a
                href="https://business.notchpay.co/settings/developer"
                className="font-semibold underline underline-offset-4"
              >
                https://business.notchpay.co/settings/developer
              </a>
            </p>
          </div>
          <Input
            placeholder="(pk or sb or b).xxxxxxx...xxxxxxxx"
            {...register("publicNotchPayApiKey")}
          />
          <p className="text-sm text-red-500">
            {errors.publicNotchPayApiKey && checkboxAcceptPayment && (
              <>{errors.publicNotchPayApiKey.message}</>
            )}
          </p>
        </div>
        <div className="flex w-full flex-col items-start gap-2">
          <Label>Amount ( in EURO ) </Label>
          <Input placeholder="2 EURO" {...register("amountNotchPay")} />
          <p className="text-sm text-red-500">
            {errors.amountNotchPay && checkboxAcceptPayment && (
              <>{errors.amountNotchPay.message}</>
            )}
          </p>
        </div>
        <div className="flex w-full items-center justify-start gap-2">
          <input
            type="checkbox"
            {...register("acceptPayment")}
            name="acceptPayment"
            id="acceptPayment"
            className={`relative h-[24px] w-[24px] cursor-pointer appearance-none rounded-full bg-slate-200 outline-none dark:bg-slate-800
                      ${
                        checkboxAcceptPayment
                          ? "before:absolute before:inset-0 before:scale-75 before:rounded-full before:bg-slate-500 before:transition-transform"
                          : ""
                      } 
                      `}
            checked={checkboxAcceptPayment}
            onChange={() => setCheckboxAcceptPayment(!checkboxAcceptPayment)}
          />
          <Label htmlFor="acceptPayment">
            Does this form accept payments ?{" "}
            {checkboxAcceptPayment ? (
              <span className="font-bold text-teal-300"> Yes</span>
            ) : (
              <span className="font-bold text-teal-300"> No</span>
            )}
          </Label>
        </div> */}

        <div className="sticky inset-x-0 bottom-0 flex w-full flex-col items-start gap-2 border-t  bg-white py-4 dark:bg-slate-900">
          <div className="w-full flex items-center justify-between">
            <Button
              variant="default"
              disabled={isLoadingUpdateForm}
              onClick={isLoadingUpdateForm ? undefined : handleSubmit(onSubmit)}
            >
              {isLoadingUpdateForm ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save changes
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete form
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete this form ?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="space-y-3">
                    <div
                      className="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-gray-800 dark:text-red-400 font-semibold"
                      role="alert"
                    >
                      This action is irreversible, please reflect beforehand.
                    </div>
                    <div className="space-y-2">
                      <p>
                        Enter the form name{" "}
                        <span className="font-bold">{dataForm.name}</span> to
                        continue:
                      </p>
                      <Input
                        onChange={(e) => {
                          setConfirmFormName(e.target.value)
                        }}
                        className=""
                      />
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <button
                    className={cn(
                      "inline-flex h-10 items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-600 dark:hover:bg-slate-200 dark:hover:text-slate-900 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                    )}
                    disabled={
                      isLoadingDelete || confirmFormName !== dataForm.name
                    }
                    onClick={
                      !isLoadingDelete ? handleDeleteDocument : undefined
                    }
                  >
                    {isLoadingDelete ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="mr-2 h-4 w-4" />
                    )}
                    Delete
                  </button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          {isSuccessUpdateForm && (
            <div
              className="mt-2 flex w-full items-center rounded-lg bg-green-50 p-4 text-green-800 dark:bg-gray-800 dark:text-green-400"
              role="alert"
            >
              <Check className="h-4 w-4" />
              <span className="sr-only">Info</span>
              <div className="ml-3 text-sm font-medium">
                Your settings have been updated !
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
        </div>
      </div>
    </div>
  )
}
