"use client"

import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLoign } from "@/firebase/auth/githubLogin"
import usePaymentInitialization from "@/sharucoplus/initializePayment.js"
import axios from "axios"

import "highlight.js/styles/vs.css"
import { useEffect, useState } from "react"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import {
  PAYMENT_STATUS,
  SUBSCRIPTIONS_PRICE,
  SUBSCRIPTIONS_TYPE,
} from "@/constants/subscriptions-infos.js"
import { useDocument } from "@/firebase/firestore/getDocument.js"
import { useUpdateUserDocument } from "@/firebase/firestore/updateUserDocument.js"
import { Github, Loader2 } from "lucide-react"
import moment from "moment"

import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"

export default function IndexPage() {
  const { login, isPending } = useGitHubLoign()

  const { user } = useAuthContext()
  const pseudo = user?.reloadUserInfo.screenName
  const userEmail = user?.email

  const { updateUserDocument }: any = useUpdateUserDocument("users")

  //

  const {
    data: dataUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useDocument(pseudo, "users")

  const [isLoadingPaymentStatus, setIsLoadingPaymentStatus] = useState(false)
  const [isErrorPaymentStatus, setIsErrorPaymentStatus] = useState(false)

  const checkPaymentStatus = async () => {
    setIsLoadingPaymentStatus(true)
    setIsErrorPaymentStatus(false)

    const transactionReference = localStorage.getItem("transaction-reference")

    if (!transactionReference) {
      setIsErrorPaymentStatus(false)
      setIsLoadingPaymentStatus(false)
      return
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NOTCH_PAY_API_URL}/${transactionReference}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: process.env.NEXT_PUBLIC_NOTCH_PAY_PUBLIC_KEY,
          },
        }
      )

      console.log("Data", response.data)
      const paymentStatus = response.data.transaction.status
      const paymentDescription = response.data.transaction.description

      if (paymentStatus === PAYMENT_STATUS.COMPLETE) {
        console.log("payment completed")
        if (paymentDescription === SUBSCRIPTIONS_TYPE.MONTHLY) {
          updateUserDocument({
            pseudo,
            updatedUserData: {
              premium: true,
              premiumType: SUBSCRIPTIONS_TYPE.MONTHLY,
              premiumPrice: SUBSCRIPTIONS_PRICE.MONTHLY,
              premiumStartDay: moment().valueOf(),
            },
          })
        }
        if (paymentDescription === SUBSCRIPTIONS_TYPE.YEARLY) {
          updateUserDocument({
            pseudo,
            updatedUserData: {
              premium: true,
              premiumType: SUBSCRIPTIONS_TYPE.YEARLY,
              premiumPrice: SUBSCRIPTIONS_PRICE.YEARLY,
              premiumStartDay: moment().valueOf(),
            },
          })
        }
        if (paymentDescription === SUBSCRIPTIONS_TYPE.LIFE) {
          updateUserDocument({
            pseudo,
            updatedUserData: {
              premium: true,
              premiumType: SUBSCRIPTIONS_TYPE.LIFE,
              premiumPrice: SUBSCRIPTIONS_PRICE.LIFE,
              premiumStartDay: moment().valueOf(),
            },
          })
        }
        localStorage.removeItem("transaction-reference")
      } else {
        console.log("payment not completed")
      }
    } catch (error) {
      setIsErrorPaymentStatus(false)
      console.error(error)
    } finally {
      setIsLoadingPaymentStatus(false)
    }
  }

  useEffect(() => {
    if (window.location.search.includes("?reference=")) {
      checkPaymentStatus()
    }
  }, [])

  const {
    initializePayment,
    isLoading: isLoadingInitializePayment,
    isError: isErrorInitializePayment,
  } = usePaymentInitialization()

  const handlePaymentClickForMonth = (
    email: string,
    amount: number,
    description: string
  ) => {
    initializePayment(email, amount, description)
  }

  const handlePaymentClickForYear = (
    email: string,
    amount: number,
    description: string
  ) => {
    initializePayment(email, amount, description)
  }

  const handlePaymentClickForLife = (
    email: string,
    amount: number,
    description: string
  ) => {
    initializePayment(email, amount, description)
  }

  return (
    <Layout>
      <Head>
        <title>Join Sharuco Plus</title>
        <meta
          name="description"
          content="Sharuco allows you to share code codes that you have found
          useful."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sharuco" />
        <meta
          name="twitter:description"
          content="Share your code with everyone"
        />
        <meta
          name="twitter:image"
          content="https://sharuco.lndev.me/sharuco-banner.png"
        />

        <meta property="og:title" content="Sharuco" />
        <meta
          property="og:description"
          content="Share your code with everyone"
        />
        <meta
          property="og:image"
          content="https://sharuco.lndev.me/sharuco-banner.png"
        />
        <meta property="og:url" content="https://sharuco.lndev.me" />
        <meta property="og:type" content="website" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="border-b border-b-slate-700 bg-[#02040A]">
        <div className="container relative grid items-center  gap-6 overflow-hidden pt-6 pb-8 md:py-10">
          <div className=" flex flex-col  items-start gap-2">
            <h1 className="font-display inline bg-gradient-to-r from-green-300 via-blue-500 to-green-300 bg-clip-text text-3xl font-extrabold leading-tight tracking-tight text-transparent sm:text-3xl md:text-5xl lg:text-6xl">
              {user && dataUser?.data.premium ? (
                <>Sharuco Plus</>
              ) : (
                <>Join Sharuco Plus</>
              )}
            </h1>

            <p className="max-w-[700px] text-lg text-slate-400 sm:text-xl">
              {user && dataUser?.data.premium ? (
                <>
                  You are part of the elite, currently you have access to all
                  the features of Sharuco.
                </>
              ) : (
                <>
                  Enjoy all the features of Sharuco by joining our premium
                  community.
                </>
              )}
            </p>
            {user && dataUser?.data.premium ? (
              <Link
                href="/popular"
                className="group relative mb-2 mr-2 mt-4 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5 text-sm font-bold text-white group-hover:from-cyan-500 group-hover:to-blue-500"
              >
                <span className="relative rounded-md bg-gray-900 px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0">
                  Popular code
                </span>
              </Link>
            ) : (
              <Link
                href="#pricing"
                className="group relative mb-2 mr-2 mt-4 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5 text-sm font-bold text-white group-hover:from-cyan-500 group-hover:to-blue-500"
              >
                <span className="relative rounded-md bg-gray-900 px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0">
                  Compare plans
                </span>
              </Link>
            )}
            <svg
              aria-hidden="true"
              viewBox="0 0 668 1069"
              width="668"
              height="1069"
              fill="none"
              className="absolute top-1/2 left-1/2 block -translate-y-1/2 lg:translate-y-[-50%]"
            >
              <defs>
                <clipPath id=":R1l6:-clip-path">
                  <path
                    fill="#fff"
                    transform="rotate(-180 334 534.4)"
                    d="M0 0h668v1068.8H0z"
                  ></path>
                </clipPath>
              </defs>
              <g
                opacity=".4"
                clip-path="url(#:R1l6:-clip-path)"
                stroke-width="4"
              >
                <path
                  opacity=".3"
                  d="M584.5 770.4v-474M484.5 770.4v-474M384.5 770.4v-474M283.5 769.4v-474M183.5 768.4v-474M83.5 767.4v-474"
                  stroke="#334155"
                ></path>
                <path
                  d="M83.5 221.275v6.587a50.1 50.1 0 0 0 22.309 41.686l55.581 37.054a50.102 50.102 0 0 1 22.309 41.686v6.587M83.5 716.012v6.588a50.099 50.099 0 0 0 22.309 41.685l55.581 37.054a50.102 50.102 0 0 1 22.309 41.686v6.587M183.7 584.5v6.587a50.1 50.1 0 0 0 22.31 41.686l55.581 37.054a50.097 50.097 0 0 1 22.309 41.685v6.588M384.101 277.637v6.588a50.1 50.1 0 0 0 22.309 41.685l55.581 37.054a50.1 50.1 0 0 1 22.31 41.686v6.587M384.1 770.288v6.587a50.1 50.1 0 0 1-22.309 41.686l-55.581 37.054A50.099 50.099 0 0 0 283.9 897.3v6.588"
                  stroke="#334155"
                ></path>
                <path
                  d="M384.1 770.288v6.587a50.1 50.1 0 0 1-22.309 41.686l-55.581 37.054A50.099 50.099 0 0 0 283.9 897.3v6.588M484.3 594.937v6.587a50.1 50.1 0 0 1-22.31 41.686l-55.581 37.054A50.1 50.1 0 0 0 384.1 721.95v6.587M484.3 872.575v6.587a50.1 50.1 0 0 1-22.31 41.686l-55.581 37.054a50.098 50.098 0 0 0-22.309 41.686v6.582M584.501 663.824v39.988a50.099 50.099 0 0 1-22.31 41.685l-55.581 37.054a50.102 50.102 0 0 0-22.309 41.686v6.587M283.899 945.637v6.588a50.1 50.1 0 0 1-22.309 41.685l-55.581 37.05a50.12 50.12 0 0 0-22.31 41.69v6.59M384.1 277.637c0 19.946 12.763 37.655 31.686 43.962l137.028 45.676c18.923 6.308 31.686 24.016 31.686 43.962M183.7 463.425v30.69c0 21.564 13.799 40.709 34.257 47.529l134.457 44.819c18.922 6.307 31.686 24.016 31.686 43.962M83.5 102.288c0 19.515 13.554 36.412 32.604 40.645l235.391 52.309c19.05 4.234 32.605 21.13 32.605 40.646M83.5 463.425v-58.45M183.699 542.75V396.625M283.9 1068.8V945.637M83.5 363.225v-141.95M83.5 179.524v-77.237M83.5 60.537V0M384.1 630.425V277.637M484.301 830.824V594.937M584.5 1068.8V663.825M484.301 555.275V452.988M584.5 622.075V452.988M384.1 728.537v-56.362M384.1 1068.8v-20.88M384.1 1006.17V770.287M283.9 903.888V759.85M183.699 1066.71V891.362M83.5 1068.8V716.012M83.5 674.263V505.175"
                  stroke="#334155"
                ></path>
                <circle
                  cx="83.5"
                  cy="384.1"
                  r="10.438"
                  transform="rotate(-180 83.5 384.1)"
                  fill="#1E293B"
                  stroke="#334155"
                ></circle>
                <circle
                  cx="83.5"
                  cy="200.399"
                  r="10.438"
                  transform="rotate(-180 83.5 200.399)"
                  stroke="#334155"
                ></circle>
                <circle
                  cx="83.5"
                  cy="81.412"
                  r="10.438"
                  transform="rotate(-180 83.5 81.412)"
                  stroke="#334155"
                ></circle>
                <circle
                  cx="183.699"
                  cy="375.75"
                  r="10.438"
                  transform="rotate(-180 183.699 375.75)"
                  fill="#1E293B"
                  stroke="#334155"
                ></circle>
                <circle
                  cx="183.699"
                  cy="563.625"
                  r="10.438"
                  transform="rotate(-180 183.699 563.625)"
                  fill="#1E293B"
                  stroke="#334155"
                ></circle>
                <circle
                  cx="384.1"
                  cy="651.3"
                  r="10.438"
                  transform="rotate(-180 384.1 651.3)"
                  fill="#1E293B"
                  stroke="#334155"
                ></circle>
                <circle
                  cx="484.301"
                  cy="574.062"
                  r="10.438"
                  transform="rotate(-180 484.301 574.062)"
                  fill="#0EA5E9"
                  fill-opacity=".42"
                  stroke="#0EA5E9"
                ></circle>
                <circle
                  cx="384.1"
                  cy="749.412"
                  r="10.438"
                  transform="rotate(-180 384.1 749.412)"
                  fill="#1E293B"
                  stroke="#334155"
                ></circle>
                <circle
                  cx="384.1"
                  cy="1027.05"
                  r="10.438"
                  transform="rotate(-180 384.1 1027.05)"
                  stroke="#334155"
                ></circle>
                <circle
                  cx="283.9"
                  cy="924.763"
                  r="10.438"
                  transform="rotate(-180 283.9 924.763)"
                  stroke="#334155"
                ></circle>
                <circle
                  cx="183.699"
                  cy="870.487"
                  r="10.438"
                  transform="rotate(-180 183.699 870.487)"
                  stroke="#334155"
                ></circle>
                <circle
                  cx="283.9"
                  cy="738.975"
                  r="10.438"
                  transform="rotate(-180 283.9 738.975)"
                  fill="#1E293B"
                  stroke="#334155"
                ></circle>
                <circle
                  cx="83.5"
                  cy="695.138"
                  r="10.438"
                  transform="rotate(-180 83.5 695.138)"
                  fill="#1E293B"
                  stroke="#334155"
                ></circle>
                <circle
                  cx="83.5"
                  cy="484.3"
                  r="10.438"
                  transform="rotate(-180 83.5 484.3)"
                  fill="#0EA5E9"
                  fill-opacity=".42"
                  stroke="#0EA5E9"
                ></circle>
                <circle
                  cx="484.301"
                  cy="432.112"
                  r="10.438"
                  transform="rotate(-180 484.301 432.112)"
                  fill="#1E293B"
                  stroke="#334155"
                ></circle>
                <circle
                  cx="584.5"
                  cy="432.112"
                  r="10.438"
                  transform="rotate(-180 584.5 432.112)"
                  fill="#1E293B"
                  stroke="#334155"
                ></circle>
                <circle
                  cx="584.5"
                  cy="642.95"
                  r="10.438"
                  transform="rotate(-180 584.5 642.95)"
                  fill="#1E293B"
                  stroke="#334155"
                ></circle>
                <circle
                  cx="484.301"
                  cy="851.699"
                  r="10.438"
                  transform="rotate(-180 484.301 851.699)"
                  stroke="#334155"
                ></circle>
                <circle
                  cx="384.1"
                  cy="256.763"
                  r="10.438"
                  transform="rotate(-180 384.1 256.763)"
                  stroke="#334155"
                ></circle>
              </g>
            </svg>
          </div>
        </div>
      </section>
      {/* <section id="features" className="border-b border-b-slate-700">
        <div className="container relative grid items-center  gap-6 overflow-hidden pt-6 pb-8 md:py-10">
          <h2></h2>
          <p>
          </p>
        </div>
      </section> */}
      <section id="pricing" className="relative overflow-hidden bg-[#02040A]">
        <Image
          src="/bg-plus.webp"
          alt="Sharuco Plus banner"
          width={3200}
          height={2960}
          className="absolute top-1/2 block w-[150%]  -translate-y-1/2 lg:translate-y-[-50%]"
        />
        <div className="container relative grid items-center gap-6 pt-6 pb-8 md:py-10">
          {user && dataUser?.data.premium ? (
            <>
              {" "}
              <h2 className="text-center text-2xl font-extrabold leading-tight tracking-tighter text-white sm:text-2xl md:text-4xl lg:text-4xl">
                Enjoy all the features of Sharuco Plus
              </h2>
              <div className="flex flex-col-reverse items-center justify-center gap-4 md:flex-row md:items-start">
                <div className="relative flex w-full max-w-sm shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#82EAAE] to-[#3F89F0] p-0.5 lg:max-w-lg">
                  <div className="w-full max-w-sm rounded-lg border border-gray-700 bg-gray-800 p-4 shadow sm:p-8 lg:max-w-lg">
                    <p className="text-center font-bold mb-6 text-white">
                      Your subscription is active until :{" "}
                      {dataUser?.data.premiumType ===
                        SUBSCRIPTIONS_TYPE.MONTHLY && (
                        <>
                          {moment(dataUser?.data.premiumStartDay)
                            .add(1, "months")
                            .format("DD MMMM YYYY")}
                        </>
                      )}
                      {dataUser?.data.premiumType ===
                        SUBSCRIPTIONS_TYPE.YEARLY && (
                        <>
                          {moment(dataUser?.data.premiumStartDay)
                            .add(1, "years")
                            .format("DD MMMM YYYY")}
                        </>
                      )}
                      {dataUser?.data.premiumType ===
                        SUBSCRIPTIONS_TYPE.LIFE && <>never</>}
                    </p>
                    <ul role="list" className="mt-0 mb-7 space-y-5">
                      <li className="flex space-x-3">
                        <svg
                          aria-hidden="true"
                          className="h-5 w-5 flex-shrink-0 text-[#4794E9]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Check icon</title>
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <span className="text-base font-normal leading-tight text-gray-400">
                          Generate your images without the « sharuco.lndev.me »
                        </span>
                      </li>
                      <li className="flex space-x-3">
                        <svg
                          aria-hidden="true"
                          className="flex-shrink-0 w-5 h-5 text-[#4794E9]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Check icon</title>
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <span className="text-base font-normal leading-tight text-gray-400">
                          Publish an infinite amount of code per day ( private
                          and public ){" "}
                        </span>
                      </li>
                      <li className="flex space-x-3">
                        <svg
                          aria-hidden="true"
                          className="flex-shrink-0 w-5 h-5 text-[#4794E9]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Check icon</title>
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <span className="text-base font-normal leading-tight text-gray-400">
                          View the most popular codes
                        </span>
                      </li>
                      <li className="flex space-x-3">
                        <svg
                          aria-hidden="true"
                          className="flex-shrink-0 w-5 h-5 text-[#4794E9]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Check icon</title>
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <span className="text-base font-normal leading-tight text-gray-400">
                          Save a code regardless of its length
                        </span>
                      </li>
                      <li className="flex space-x-3">
                        <svg
                          aria-hidden="true"
                          className="flex-shrink-0 w-5 h-5 text-[#4794E9]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Check icon</title>
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <span className="text-base font-normal leading-tight text-gray-400">
                          Add code from different programming languages into a
                          single block of code
                          <span className="ml-2 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                            Soon
                          </span>
                        </span>
                      </li>
                      <li className="flex space-x-3">
                        <svg
                          aria-hidden="true"
                          className="flex-shrink-0 w-5 h-5 text-[#4794E9]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Check icon</title>
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <span className="text-base font-normal leading-tight text-gray-400">
                          Get a badge on your profile
                        </span>
                      </li>
                    </ul>
                    <Link
                      href="/popular"
                      className="w-full group relative flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#82EAAE] to-[#3F89F0] p-0.5 text-sm font-bold text-white hover:to-gray-900 hover:from-gray-900"
                    >
                      <span className="w-full flex items-center justify-center relative rounded-md bg-gray-900 px-5 py-2.5 transition-all duration-75 ease-in">
                        Show popular codes
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <a href="mailto:sharuco@leonelngoya.com">
                  <button className="rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
                    Contact us for all your questions
                  </button>
                </a>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-center text-2xl font-extrabold leading-tight tracking-tighter text-white sm:text-2xl md:text-4xl lg:text-4xl">
                Have access to all features
              </h2>
              <p className="text-center font-medium text-white">
                Choose the premium plan to have access to all Sharuco features.
                Keep and share your code easily 🏄🏾‍♂️ <br />
              </p>
              <div className="flex flex-col-reverse items-center justify-center gap-4 md:flex-row md:items-start">
                <div className="w-full max-w-sm rounded-lg border  border-gray-700 bg-gray-800 p-4 shadow sm:p-8">
                  <h5 className="mb-4 text-xl font-bold text-gray-400">
                    Sharuco Basic
                  </h5>
                  <div className="flex items-baseline text-white">
                    <span className="text-5xl font-extrabold tracking-tight">
                      0
                    </span>
                    <span className="text-3xl font-semibold">€</span>
                    <span className="ml-1 text-xl font-normal text-gray-400">
                      /month
                    </span>
                  </div>
                  <ul role="list" className="space-y-5 my-7">
                    <li className="flex space-x-3 line-through decoration-gray-500">
                      <svg
                        aria-hidden="true"
                        className="flex-shrink-0 w-5 h-5 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Check icon</title>
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <span className="text-base font-normal leading-tight text-gray-500">
                        Generate your images without the « sharuco.lndev.me »
                      </span>
                    </li>
                    <li className="flex space-x-3">
                      <svg
                        aria-hidden="true"
                        className="flex-shrink-0 w-5 h-5 text-[#4794E9]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Check icon</title>
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <span className="text-base font-normal leading-tight text-gray-400">
                        Publish maximum 5 codes per day ( max. 2 private )
                      </span>
                    </li>
                    <li className="flex space-x-3 line-through decoration-gray-500">
                      <svg
                        aria-hidden="true"
                        className="flex-shrink-0 w-5 h-5 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Check icon</title>
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <span className="text-base font-normal leading-tight text-gray-500">
                        View the most popular codes
                      </span>
                    </li>
                    <li className="flex space-x-3">
                      <svg
                        aria-hidden="true"
                        className="flex-shrink-0 w-5 h-5 text-[#4794E9]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Check icon</title>
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <span className="text-base font-normal leading-tight text-gray-400">
                        Your codes will have a limited length
                      </span>
                    </li>
                    <li className="flex space-x-3 line-through decoration-gray-500">
                      <svg
                        aria-hidden="true"
                        className="flex-shrink-0 w-5 h-5 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Check icon</title>
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <span className="text-base font-normal leading-tight text-gray-500">
                        Add code from different programming languages into a
                        single block of code
                      </span>
                    </li>
                    <li className="flex space-x-3 line-through decoration-gray-500">
                      <svg
                        aria-hidden="true"
                        className="flex-shrink-0 w-5 h-5 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Check icon</title>
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <span className="text-base font-normal leading-tight text-gray-500">
                        Get a badge on your profile
                      </span>
                    </li>
                  </ul>
                  <h6 className="text-md text-center font-bold text-gray-400">
                    Your current plan
                  </h6>
                </div>

                <div className="relative flex w-full max-w-sm shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#82EAAE] to-[#3F89F0] p-0.5 lg:max-w-lg">
                  <div className="w-full max-w-sm rounded-lg border border-gray-700 bg-gray-800 p-4 shadow sm:p-8 lg:max-w-lg">
                    <h5 className="mb-4 text-xl font-bold text-gray-400">
                      Sharuco Plus 🏄🏾‍♂️
                    </h5>
                    <div className="flex items-baseline text-white">
                      <span className="text-5xl font-extrabold tracking-tight">
                        {SUBSCRIPTIONS_PRICE.MONTHLY}
                      </span>
                      <span className="text-3xl font-semibold">€</span>
                      <span className="ml-1 text-xl font-normal text-gray-400">
                        /month
                      </span>
                    </div>
                    <ul role="list" className="my-7 space-y-5">
                      <li className="flex space-x-3">
                        <svg
                          aria-hidden="true"
                          className="h-5 w-5 flex-shrink-0 text-[#4794E9]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Check icon</title>
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <span className="text-base font-normal leading-tight text-gray-400">
                          Generate your images without the « sharuco.lndev.me »
                        </span>
                      </li>
                      <li className="flex space-x-3">
                        <svg
                          aria-hidden="true"
                          className="flex-shrink-0 w-5 h-5 text-[#4794E9]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Check icon</title>
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <span className="text-base font-normal leading-tight text-gray-400">
                          Publish an infinite amount of code per day ( private
                          and public ){" "}
                        </span>
                      </li>
                      <li className="flex space-x-3">
                        <svg
                          aria-hidden="true"
                          className="flex-shrink-0 w-5 h-5 text-[#4794E9]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Check icon</title>
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <span className="text-base font-normal leading-tight text-gray-400">
                          View the most popular codes
                        </span>
                      </li>
                      <li className="flex space-x-3">
                        <svg
                          aria-hidden="true"
                          className="flex-shrink-0 w-5 h-5 text-[#4794E9]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Check icon</title>
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <span className="text-base font-normal leading-tight text-gray-400">
                          Save a code regardless of its length
                        </span>
                      </li>
                      <li className="flex space-x-3">
                        <svg
                          aria-hidden="true"
                          className="flex-shrink-0 w-5 h-5 text-[#4794E9]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Check icon</title>
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <span className="text-base font-normal leading-tight text-gray-400">
                          Add code from different programming languages into a
                          single block of code
                          <span className="ml-2 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                            Soon
                          </span>
                        </span>
                      </li>
                      <li className="flex space-x-3">
                        <svg
                          aria-hidden="true"
                          className="flex-shrink-0 w-5 h-5 text-[#4794E9]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Check icon</title>
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <span className="text-base font-normal leading-tight text-gray-400">
                          Get a badge on your profile
                        </span>
                      </li>
                    </ul>

                    {user ? (
                      <div className="flex flex-col items-center gap-2">
                        <button
                          className="w-full group relative flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#82EAAE] to-[#3F89F0] p-0.5 text-sm font-bold text-white hover:to-gray-900 hover:from-gray-900"
                          onClick={() =>
                            handlePaymentClickForMonth(
                              userEmail,
                              SUBSCRIPTIONS_PRICE.MONTHLY,
                              SUBSCRIPTIONS_TYPE.MONTHLY
                            )
                          }
                          disabled={isLoadingInitializePayment}
                        >
                          <span className="w-full flex items-center justify-center relative rounded-md bg-gray-900 px-5 py-2.5 transition-all duration-75 ease-in">
                            Buy {SUBSCRIPTIONS_PRICE.MONTHLY} € / month
                          </span>
                        </button>
                        <span className="flex items-center justify-center text-base font-normal leading-tight text-gray-400">
                          or
                        </span>
                        <div className="flex w-full flex-col items-center gap-4 lg:flex-row">
                          <button
                            className="w-full group relative flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#82EAAE] to-[#3F89F0] p-0.5 text-sm font-bold text-white hover:to-gray-900 hover:from-gray-900"
                            onClick={() =>
                              handlePaymentClickForYear(
                                userEmail,
                                SUBSCRIPTIONS_PRICE.YEARLY,
                                SUBSCRIPTIONS_TYPE.YEARLY
                              )
                            }
                            disabled={isLoadingInitializePayment}
                          >
                            <span className="w-full flex items-center justify-center relative rounded-md bg-gray-900 px-5 py-2.5 transition-all duration-75 ease-in">
                              {SUBSCRIPTIONS_PRICE.YEARLY} € / year
                            </span>
                          </button>
                          <button
                            className="w-full group relative flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#82EAAE] to-[#3F89F0] p-0.5 text-sm font-bold text-white hover:to-gray-900 hover:from-gray-900"
                            onClick={() =>
                              handlePaymentClickForLife(
                                userEmail,
                                SUBSCRIPTIONS_PRICE.LIFE,
                                SUBSCRIPTIONS_TYPE.LIFE
                              )
                            }
                            disabled={isLoadingInitializePayment}
                          >
                            <span className="w-full flex items-center justify-center relative rounded-md bg-gray-900 px-5 py-2.5 transition-all duration-75 ease-in">
                              {SUBSCRIPTIONS_PRICE.LIFE} € for life
                            </span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="w-full group relative flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#82EAAE] to-[#3F89F0] p-0.5 text-sm font-bold text-white hover:to-gray-900 hover:from-gray-900"
                        disabled={isPending}
                        onClick={login}
                      >
                        <span className="w-full flex items-center justify-center relative rounded-md bg-gray-900 px-5 py-2.5 transition-all duration-75 ease-in">
                          {isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Github className="mr-2 h-4 w-4" />
                          )}
                          Login with github to pay
                        </span>
                      </button>
                    )}
                    <p className="text-center font-bold mt-6 text-white">
                      * Without commitment
                    </p>
                    {isErrorInitializePayment || isLoadingInitializePayment ? (
                      <div className="flex w-full items-center justify-center pt-6">
                        {isLoadingInitializePayment ? (
                          <Loader2 className="mr-2 h-8 w-8 animate-spin text-white" />
                        ) : null}
                        {isErrorInitializePayment ? (
                          <span className="text-base font-medium leading-tight text-red-500">
                            An error occurred, please try again
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <a href="mailto:sharuco@leonelngoya.com">
                  <button className="rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
                    Contact us for all your questions
                  </button>
                </a>
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  )
}
