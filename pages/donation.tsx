"use client"

import { useEffect, useRef, useState } from "react"
import usePaymentInitialization from "@/notchpay/donation/initializePayment.js"

//import axios from "axios"
import "highlight.js/styles/vs.css"
import Head from "next/head"
import { useAuthContext } from "@/context/AuthContext"
import { yupResolver } from "@hookform/resolvers/yup"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import * as yup from "yup"

import { Layout } from "@/components/layout"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function Donation() {
  const { user } = useAuthContext()
  const [paymentDone, setPaymentDone] = useState(false)

  const checkPaymentStatus = async () => {
    const transactionDonationReference = localStorage.getItem(
      "transaction-donation-reference"
    )
    const CAPTURE_URL = `https://api.notchpay.co/payments/${transactionDonationReference}`

    if (!transactionDonationReference) {
      return
    }

    try {
      const response = await axios.get(CAPTURE_URL, {
        headers: {
          Accept: "application/json",
          Authorization: process.env.NEXT_PUBLIC_NOTCH_PAY_PUBLIC_KEY,
        },
      })
      const paymentStatus = response.data.transaction.status

      if (paymentStatus === "complete") {
        localStorage.removeItem("transaction-donation-reference")
        setPaymentDone(true)
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (window.location.search.includes("?reference=")) {
      checkPaymentStatus()
    }
  }, [])

  const { initializePayment, isLoading, isError } = usePaymentInitialization()

  const schema = yup.object().shape({
    price: yup.number().integer().min(1).required(),
    email: !user ? yup.string().email().required() : yup.string().email(),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data) => {
    const { price, email } = data
    const emailToUse = user ? user.email : email
    initializePayment(emailToUse, parseInt(price), "Donation for Sharuco")
    reset({
      price: "",
    })
  }

  return (
    <Layout>
      <Head>
        <title>Sharuco | Donation</title>
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
      <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-2xl font-bold leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-5xl">
            Support Sharuco
          </h1>
          <p className="max-w-[700px] text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
            Sharuco is a free and open source project.
            <br className="hidden sm:inline" /> If you want to support the
            project, you can make a donation.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start w-full gap-2">
          <div className="w-full flex flex-col sm:flex-row items-start gap-2">
            <div className="w-full flex flex-col items-start gap-2">
              <Input
                type="text"
                placeholder="Enter the amount in euro ( € )"
                id="price"
                {...register("price")}
              />
              <p className="text-sm text-red-500">
                {errors.price && <>{errors.price.message}</>}
              </p>
            </div>
            {!user ? (
              <div className="w-full flex flex-col items-start gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  id="emai"
                  {...register("email")}
                />
                <p className="text-sm text-red-500">
                  {errors.email && <>{errors.email.message}</>}
                </p>
              </div>
            ) : null}
          </div>
          <Button
            className="shrink-0 w-full sm:w-fit"
            disabled={isLoading}
            onClick={!isLoading ? handleSubmit(onSubmit) : undefined}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Make a donation
          </Button>
        </div>
        {paymentDone ? (
          <div className="inline-flex items-center rounded-lg border border-green-200 bg-green-100 p-4 text-sm font-medium text-green-800 dark:bg-gray-800 dark:text-green-300 dark:border-none">
            Thanks you for your donation!
          </div>
        ) : null}
        <div className="w-full flex items-center justify-center">
          <span className="text-lg font-bold">OR</span>
        </div>
        <div className="w-full flex items-center justify-center">
          <a
            href="https://www.buymeacoffee.com/lndev"
            target="_blank"
            className={buttonVariants({ size: "lg", variant: "default" })}
          >
            Support with Buy me a coffee
          </a>
        </div>
      </section>
    </Layout>
  )
}
