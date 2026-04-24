"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { checkIdAvailability } from "@/firebase/firestore/checkIfIDExistOnCollection"
import { useDeleteDocument } from "@/firebase/firestore/deleteDocument"
import { useUpdateFormDocument } from "@/firebase/firestore/updateFormDocument"
import { yupResolver } from "@hookform/resolvers/yup"
import algoliasearch from "algoliasearch"
import { Check, Loader2, Save, Trash, X } from "lucide-react"
import { useForm } from "react-hook-form"
import * as yup from "yup"

import { cn } from "@/lib/utils"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export default function SettingsForms({ dataForm }: { dataForm: any }) {
  const params = useParams()
  const router = useRouter()

  const id = params["form"] as string

  const { toast } = useToast()

  const ALGOLIA_INDEX_NAME = "forms"

  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_KEY
  )
  const index = client.initIndex(ALGOLIA_INDEX_NAME)

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
  })

  const {
    register,
    handleSubmit,
    setValue,
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
  }, [dataForm, setValue])

  const {
    updateFormDocument,
    isLoading: isLoadingUpdateForm,
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

  const [usernamePeopleToAdd, setUsernamePeopleToAdd] = useState("")
  const [checkIfUsernameExist, setCheckIfUsernameExist] = useState(false)
  const addCollaborator = async (pseudo: string) => {
    setCheckIfUsernameExist(true)
    checkIdAvailability("users", pseudo)
      .then((isAvailable) => {
        if (isAvailable) {
          const updatedFormData = {
            collaborators: [
              ...dataForm.collaborators,
              {
                pseudo: pseudo,
              },
            ],
          }

          updateFormDocument({ id, updatedFormData })
        } else {
          toast({
            variant: "destructive",
            title: "This user not exist on Sharuco",
            description: "Make sure you have entered the correct user name.",
            action: <ToastAction altText="Okay">Okay</ToastAction>,
          })
          return
        }
      })
      .catch((error) => console.error("Error : ", error))
      .finally(() => {
        setCheckIfUsernameExist(false)
      })
  }
  const removeCollaborator = async (pseudo: string) => {
    const updatedFormData = {
      collaborators: dataForm.collaborators.filter(
        (item) => item.pseudo !== pseudo
      ),
    }

    updateFormDocument({ id, updatedFormData })
  }

  const onSubmit = async (data) => {
    const {
      name: nameUpdate,
      description: descriptionUpdate,
      color: colorUpdate,
      redirectOnCompletion: redirectOnCompletionUpdate,
    } = data

    if (
      nameUpdate === dataForm.name &&
      descriptionUpdate === dataForm.description &&
      colorUpdate === dataForm.color &&
      redirectOnCompletionUpdate === dataForm.redirectOnCompletion
    ) {
      toast({
        variant: "destructive",
        title: "You have not made any changes",
        description: "Please make changes to update your settings",
        action: <ToastAction altText="Okay">Okay</ToastAction>,
      })
      return
    }

    const updatedFormData: {
      name: string
      description: string
      color: string
      redirectOnCompletion: string
    } = {
      name: nameUpdate,
      description: descriptionUpdate,
      color: colorUpdate,
      redirectOnCompletion: redirectOnCompletionUpdate,
    }

    await updateFormDocument({ id, updatedFormData })

    await index.partialUpdateObject({
      objectID: id,
      name: nameUpdate,
      description: descriptionUpdate,
      color: colorUpdate,
      redirectOnCompletion: redirectOnCompletionUpdate,
    })

    reset({
      name: nameUpdate,
      description: descriptionUpdate,
      color: colorUpdate,
      redirectOnCompletion: redirectOnCompletionUpdate,
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
        <div className="flex flex-col items-start">
          <h3 className="text-xl font-semibold">Team</h3>
        </div>
        <Separator className="opacity-50" />
        <div className="flex w-full flex-col items-start gap-2">
          <div className="flex w-full flex-col items-start gap-1">
            <Label className="text-left">Add people to manage this form.</Label>
            <p className="text-left text-sm">
              The added persons will be able to consult the answers to your
              form.
            </p>
          </div>
          <div className="mb-2 flex w-full items-center gap-2">
            <Input
              placeholder="Enter username"
              onChange={(e) => {
                setUsernamePeopleToAdd(e.target.value)
              }}
              value={usernamePeopleToAdd}
            />
            <Button
              disabled={
                usernamePeopleToAdd === "" ||
                checkIfUsernameExist ||
                isLoadingUpdateForm
              }
              className="shrink-0"
              onClick={() => {
                setUsernamePeopleToAdd("")
                addCollaborator(usernamePeopleToAdd)
              }}
            >
              {checkIfUsernameExist && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add people
            </Button>
          </div>
          {dataForm.collaborators.length !== 0 && (
            <div className="flex w-full flex-col gap-2">
              {dataForm.collaborators.map((collaborator) => (
                <div
                  key={collaborator.pseudo}
                  className="flex w-full items-center rounded-md bg-zinc-50 px-5 py-3 dark:bg-zinc-800"
                >
                  <div className="flex w-full">
                    <a
                      href={`/user/${collaborator.pseudo}`}
                      className="cursor-pointer text-sm font-semibold underline underline-offset-4"
                    >
                      {collaborator.pseudo}
                    </a>
                  </div>
                  <span
                    className="block shrink-0 cursor-pointer text-sm font-medium text-red-600 underline underline-offset-4"
                    onClick={() => {
                      if (!isLoadingUpdateForm) {
                        removeCollaborator(collaborator.pseudo)
                      }
                    }}
                  >
                    Remove
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sticky inset-x-0 bottom-0 flex w-full flex-col items-start gap-2 border-t bg-white py-4 dark:bg-zinc-900">
          <div className="flex w-full items-center justify-between">
            <Button
              variant="default"
              disabled={isLoadingUpdateForm || checkIfUsernameExist}
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
                      className="rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-800 dark:bg-gray-800 dark:text-red-400"
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
                        value={confirmFormName}
                        className=""
                      />
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => {
                      setConfirmFormName("")
                    }}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <button
                    className={cn(
                      "inline-flex h-10 items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-900 focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-600 dark:hover:bg-zinc-200 dark:hover:text-zinc-900 dark:focus:ring-zinc-400 dark:focus:ring-offset-zinc-900"
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
