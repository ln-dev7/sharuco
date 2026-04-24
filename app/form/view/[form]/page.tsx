"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import { useDocument } from "@/firebase/firestore/getDocument"
import { useUpdateFormDocument } from "@/firebase/firestore/updateFormDocument"
import { yupResolver } from "@hookform/resolvers/yup"
import algoliasearch from "algoliasearch"
import { Check, Loader2, Send, Terminal, X } from "lucide-react"
import moment from "moment"
import { useForm } from "react-hook-form"
import { uid } from "uid"
import * as yup from "yup"

import Error from "@/components/error"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

export default function FormViewPage() {
  const params = useParams()
  const { userPseudo } = useAuthContext()

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
  } = useDocument(params["form"] as string, "forms")

  function generateRandomNumbers() {
    const number1 = Math.floor(Math.random() * 51)
    const number2 = Math.floor(Math.random() * 51)
    return { number1, number2 }
  }

  const [randomNumbers, setRandomNumbers] = useState(() =>
    generateRandomNumbers()
  )

  const schema = yup.object().shape({
    responses: yup.array().of(
      yup.object().shape({
        text: yup.string().required("This field is required"),
      })
    ),
    answer: yup.number().integer(),
  })

  const ALGOLIA_INDEX_NAME = "forms"

  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_KEY
  )
  const index = client.initIndex(ALGOLIA_INDEX_NAME)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const {
    updateFormDocument,
    isLoading: isLoadingUpdateForm,
    isSuccess: isSuccessUpdateForm,
    reset: resetUpdateForm,
  }: any = useUpdateFormDocument("forms")

  const onSubmit = async (data) => {
    // Vérifie si la réponse de l'utilisateur est la somme des nombres aléatoires
    const userAnswer = parseInt(data.answer, 10)
    const correctAnswer = randomNumbers.number1 + randomNumbers.number2

    if (userAnswer !== correctAnswer) {
      alert("The answer to the mathematical question is incorrect.")
      return
    }

    const updatedFormData: {
      responses: any[]
    } = {
      responses: [
        ...dataForm?.data?.responses,
        {
          idResponse: moment().valueOf() + uid(),
          createdAt: moment().valueOf(),
          responses: [
            ...data.responses.map((response: any, index: number) => {
              return {
                text: response.text,
                type: dataForm?.data?.questions[index].type,
                label: dataForm?.data?.questions[index].label,
              }
            }),
          ],
        },
      ],
    }

    const id = params["form"]

    await updateFormDocument({ id, updatedFormData })

    await index.partialUpdateObject({
      objectID: id,
      responses: updatedFormData.responses,
    })

    reset({
      responses: [
        ...dataForm?.data?.questions.map((question: any) => {
          return {
            text: question.type === "heading" ? "heading" : "",
          }
        }),
      ],
      answer: null,
    })

    setRandomNumbers(generateRandomNumbers())
  }

  useEffect(() => {
    if (dataForm?.data?.redirectOnCompletion && isSuccessUpdateForm) {
      window.location.href = dataForm.data.redirectOnCompletion
    }
  }, [dataForm?.data?.redirectOnCompletion, isSuccessUpdateForm])

  return (
    <>
      {" "}
      <section className="fixed inset-0 z-50 h-screen overflow-scroll bg-white dark:bg-zinc-900">
        <div className="container-wrapper grid items-center gap-6 pt-6 pb-8 md:py-10">
          <div className="flex w-full items-center justify-start">
            <Link href="/forms" className="flex items-center font-bold">
              <Terminal className="mr-2 h-6 w-6" />
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
            (dataForm.data.published ||
              dataForm.data.idAuthor === userPseudo) && (
              <div className="w-full py-8">
                <div
                  className={`absolute inset-x-0 top-0 h-3 w-full`}
                  style={{
                    background: `${dataForm.data.color}`,
                  }}
                ></div>
                <div className="flex w-full flex-col items-center justify-center gap-2">
                  <h1 className="text-2xl leading-tight font-extrabold tracking-tighter sm:text-2xl md:text-4xl lg:text-4xl">
                    {dataForm.data.name}
                  </h1>
                  <p className="text-center text-sm leading-5 font-medium text-gray-500 sm:text-base md:text-lg lg:text-lg dark:text-gray-400">
                    {dataForm.data.description}
                  </p>
                </div>
                <Separator className="mx-auto my-8 sm:w-2/3" />
                <div className="mx-auto w-full space-y-6 lg:w-2/3">
                  {dataForm?.data?.questions.map((question, index) => {
                    return (
                      <div
                        className="flex w-full flex-col items-start gap-2"
                        key={index}
                      >
                        {question.type !== "heading" ? (
                          <Label>{question.label}</Label>
                        ) : (
                          <h3 className="text-xl font-semibold">
                            {question.label}
                          </h3>
                        )}
                        {(question.type === "text" ||
                          question.type === "link" ||
                          question.type === "email") && (
                          <Input
                            {...register(`responses.${index}.text` as const)}
                            placeholder={question.text}
                          />
                        )}
                        {question.type === "longtext" && (
                          <Textarea
                            {...register(`responses.${index}.text` as const)}
                            placeholder={question.text}
                          />
                        )}
                        {question.type === "heading" && (
                          <Input
                            {...register(`responses.${index}.text` as const)}
                            placeholder={question.text}
                            value={question.type}
                            className="hidden"
                          />
                        )}
                        {errors?.responses?.[index]?.text && (
                          <p className="text-xs font-medium text-red-500">
                            {errors.responses[index].text.message}
                          </p>
                        )}
                      </div>
                    )
                  })}
                  <div className="mx-auto my-8 flex w-full flex-col items-center gap-2 sm:w-2/3">
                    <div className="relative flex w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-lg bg-blue-600 p-8">
                      <h3 className="text-md z-10 text-center font-bold text-white uppercase">
                        Prove you’re not a robot by solving this equation{" "}
                      </h3>
                      <span className="z-10 mb-2 block text-center text-4xl font-black text-white">
                        {randomNumbers.number1} + {randomNumbers.number2} = ?
                      </span>
                      <img
                        src="/assets/stacked-waves-haikei.svg"
                        alt="stacked-waves-haikei"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <input
                        type="number"
                        id="answer"
                        name="answer"
                        {...register("answer")}
                        className="z-10 h-10 w-full rounded-md bg-white px-3 py-2 text-sm font-medium text-zinc-900 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder={`${randomNumbers.number1} + ${randomNumbers.number2}`}
                      />
                    </div>
                  </div>
                  {isSuccessUpdateForm && (
                    <div
                      className="mx-auto mb-8 flex items-center rounded-lg bg-green-50 p-4 text-green-800 dark:bg-gray-800 dark:text-green-400"
                      role="alert"
                    >
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Info</span>
                      <div className="ml-3 text-sm font-medium">
                        Your form has been sent successfully, Thank you !
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
                  <Button
                    variant="default"
                    disabled={isLoadingUpdateForm}
                    onClick={
                      isLoadingUpdateForm ? undefined : handleSubmit(onSubmit)
                    }
                  >
                    {isLoadingUpdateForm ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Send
                  </Button>
                </div>
              </div>
            )}
          {((dataForm && !dataForm.exists) ||
            (dataForm &&
              dataForm.exists &&
              !dataForm.data.published &&
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
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <div
              className="flex items-center rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-gray-800 dark:text-yellow-300"
              role="alert"
            >
              <svg
                className="mr-3 inline h-4 w-4 shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="sr-only">Info</span>
              <div>
                <span className="font-medium">
                  NEVER send sensitive information to Shruco Form such as your
                  password or credit card !
                </span>
              </div>
            </div>
            <Link href="/">
              Powered by{" "}
              <span className="font-bold hover:underline hover:underline-offset-4">
                Sharuco
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
