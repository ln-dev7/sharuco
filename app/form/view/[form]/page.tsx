"use client";

import { useAuthContext } from "@/context/AuthContext";
import { useDocument } from "@/firebase/firestore/getDocument";
import { useUpdateFormDocument } from "@/firebase/firestore/updateFormDocument";
import { yupResolver } from "@hookform/resolvers/yup";
import algoliasearch from "algoliasearch";
import { Check, Loader2, Send, Terminal, X } from "lucide-react";
import moment from "moment";
import Head from "next/head";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { uid } from "uid";
import * as yup from "yup";

import Error from "@/components/error";
import { Layout } from "@/components/layout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export default function FormViewPage() {
  const params = useParams();
  const { user, userPseudo } = useAuthContext();
  const router = useRouter() || "";

  type QuestionType =
    | "text"
    | "email"
    | "link"
    | "longtext"
    | "date"
    | "uniquechoice"
    | "listchoice"
    | "multiplechoice";

  const {
    data: dataForm,
    isLoading: isLoadingForm,
    isError: isErrorForm,
    error: errorForm,
  }: {
    data: any;
    isLoading: boolean;
    isError: boolean;
    error: any;
  } = useDocument(params["form"], "forms");

  //
  const [randomNumbers, setRandomNumbers] = useState(generateRandomNumbers());

  function generateRandomNumbers() {
    const number1 = Math.floor(Math.random() * 51);
    const number2 = Math.floor(Math.random() * 51);
    return { number1, number2 };
  }
  //

  const schema = yup.object().shape({
    responses: yup.array().of(
      yup.object().shape({
        text: yup.string().required("This field is required"),
      })
    ),
    answer: yup.number().integer(),
    // paymentStatut: yup.string(),
    // emailPayment: yup.string(),
  });

  const ALGOLIA_INDEX_NAME = "forms";

  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
    process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_KEY as string
  );
  const index = client.initIndex(ALGOLIA_INDEX_NAME);

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
  });

  const {
    updateFormDocument,
    isLoading: isLoadingUpdateForm,
    isError: isErrorUpdateForm,
    isSuccess: isSuccessUpdateForm,
    reset: resetUpdateForm,
  }: any = useUpdateFormDocument("forms");

  const onSubmit = async (data) => {
    // setPaymentDone(false)

    // Vérifie si la réponse de l'utilisateur est la somme des nombres aléatoires
    const userAnswer = parseInt(data.answer, 10);
    const correctAnswer = randomNumbers.number1 + randomNumbers.number2;

    if (userAnswer !== correctAnswer) {
      alert("The answer to the mathematical question is incorrect.");
      return;
    }

    let updatedFormData: {
      responses: any[];
      // paymentStatut?: string
      // emailPayment?: string
    } = {
      responses: [
        ...dataForm?.data?.responses,
        {
          idResponse: moment().valueOf() + uid(),
          createdAt: moment().valueOf(),
          // paymentStatut: data.paymentStatut ? data.paymentStatut : "",
          // emailPayment: data.emailPayment ? data.emailPayment : "",
          responses: [
            ...data.responses.map((response: any, index: number) => {
              return {
                text: response.text,
                type: dataForm?.data?.questions[index].type,
                label: dataForm?.data?.questions[index].label,
              };
            }),
          ],
        },
      ],
    };
    // console.log("updatedFormData", updatedFormData)

    const id = params["form"];

    await updateFormDocument({ id, updatedFormData });

    await index.partialUpdateObject({
      objectID: id,
      responses: updatedFormData.responses,
    });

    reset({
      responses: [
        ...dataForm?.data?.questions.map((question: any) => {
          return {
            text: question.type === "heading" ? "heading" : "",
          };
        }),
      ],
      answer: null,
    });

    setRandomNumbers(generateRandomNumbers());
  };

  if (dataForm?.data?.redirectOnCompletion && isSuccessUpdateForm) {
    window.location.href = dataForm.data.redirectOnCompletion;
  }

  // payment

  // const [paymentDone, setPaymentDone] = useState(false)

  // const checkPaymentStatus = async () => {
  //   const transactionReference = localStorage.getItem("transaction-reference")
  //   const CAPTURE_URL = `https://api.notchpay.co/payments/${transactionReference}`

  //   if (!transactionReference) {
  //     return
  //   }

  //   try {
  //     const response = await axios.get(CAPTURE_URL, {
  //       headers: {
  //         Accept: "application/json",
  //         Authorization: process.env.NEXT_PUBLIC_NOTCH_PAY_PUBLIC_KEY,
  //       },
  //     })
  //     console.log("response.data", response.data)
  //     const paymentStatus = response.data.transaction.status
  //     const emailPayment = response.data.transaction.customer.email

  //     if (paymentStatus === "complete") {
  //       localStorage.removeItem("transaction-reference")
  //       // setValue("paymentStatut", paymentStatus)
  //       // setValue("emailPayment", emailPayment)
  //       // setPaymentDone(true)
  //     } else {
  //     }
  //   } catch (error) {}
  // }

  // useEffect(() => {
  //   if (window.location.search.includes("?reference=")) {
  //     checkPaymentStatus()
  //   }
  // }, [])

  // const {
  //   initializePayment,
  //   isLoading: isLoadingPayment,
  //   isError: isErrorPayment,
  // } = usePaymentInitialization()

  // const schemaPayment = yup.object().shape({
  //   email: yup.string().email().required(),
  // })

  // const {
  //   register: registerPayment,
  //   handleSubmit: handleSubmitPayment,
  //   reset: resetPayment,
  //   formState: { errors: errorsPayment },
  // } = useForm({
  //   resolver: yupResolver(schemaPayment),
  // })

  // const onSubmitPayment = async (data) => {
  //   const { email } = data
  //   initializePayment(
  //     email,
  //     dataForm?.data?.amountNotchPay,
  //     dataForm?.data?.name,
  //     dataForm?.data?.publicNotchPayApiKey,
  //     `https://sharuco.lndev.me/form/view/${params["form"]}`
  //     //`http://localhost:3000/form/view/${params["form"]}`
  //   )
  //   resetPayment({
  //     email: "",
  //   })
  // }

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
      <section className="fixed inset-0 z-50 h-screen overflow-scroll bg-white dark:bg-zinc-900">
        <div className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
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
                  <h1 className="text-2xl font-extrabold leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-4xl">
                    {dataForm.data.name}
                  </h1>
                  <p className="text-center text-sm font-medium leading-5 text-gray-500 sm:text-base md:text-lg lg:text-lg dark:text-gray-400">
                    {dataForm.data.description}
                  </p>
                </div>
                <Separator className="mx-auto my-8 sm:w-2/3" />
                <div className="mx-auto w-full space-y-6 lg:w-2/3">
                  {/* {dataForm?.data?.acceptPayment && !paymentDone && (
                    <div className="flex flex-col items-start gap-4 rounded-xl border border-[#11B981] bg-emerald-50/50 px-4 py-6 dark:bg-emerald-500/5 sm:flex-row">
                      <a href="https://notchpay.co/" className="w-12 shrink-0">
                        <img
                          src="/partner/notchpay-favicon.svg"
                          alt="notchpay"
                        />
                      </a>
                      <div className="flex w-full flex-col items-start gap-2">
                        <p>
                          This form accepts a payment at the rate of{" "}
                          <span className="font-bold">
                            {dataForm?.data?.amountNotchPay} Euro
                          </span>{" "}
                          , If you make it this will be notified to the
                          administrator of this form.
                        </p>
                        <div className="flex w-full flex-col items-start gap-2 sm:flex-row">
                          <div className="flex w-full flex-col items-start gap-2">
                            <Input
                              className="w-full"
                              placeholder="Enter your email"
                              {...registerPayment("email")}
                            />
                            <p className="text-sm text-red-500">
                              {errorsPayment.email && (
                                <>{errorsPayment.email.message}</>
                              )}
                            </p>
                          </div>
                          <Button
                            className="w-full shrink-0 sm:w-fit"
                            disabled={isLoadingPayment}
                            onClick={
                              !isLoadingPayment
                                ? handleSubmitPayment(onSubmitPayment)
                                : undefined
                            }
                          >
                            {isLoadingPayment && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Pay {dataForm?.data?.amountNotchPay} EURO
                          </Button>
                        </div>
                      </div>
                    </div>
                  )} */}
                  {/* {paymentDone ? (
                    <div className="flex flex-col items-start gap-4 rounded-xl border border-[#11B981] bg-emerald-50/50 px-4 py-6 dark:bg-emerald-500/5 sm:flex-row">
                      <a href="https://notchpay.co/" className="w-12 shrink-0">
                        <img
                          src="/partner/notchpay-favicon.svg"
                          alt="notchpay"
                        />
                      </a>
                      <div className="flex w-full flex-col items-start gap-2 font-bold">
                        <p>Your payment has been made successfully !</p>
                        <p>
                          Fill out this form now without reloading the page !
                        </p>
                      </div>
                    </div>
                  ) : null} */}
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
                            // defaultValue={question.type}
                            className="hidden"
                          />
                        )}
                        {errors?.responses?.[index]?.text && (
                          <p className="text-xs font-medium text-red-500">
                            {errors.responses[index].text.message}
                          </p>
                        )}
                      </div>
                    );
                  })}
                  <div className="mx-auto my-8 flex w-full flex-col items-center gap-2 sm:w-2/3">
                    <div className="relative flex w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-lg bg-blue-600 p-8">
                      <h3 className="text-md z-10 text-center font-bold uppercase text-white">
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
    </Layout>
  );
}
