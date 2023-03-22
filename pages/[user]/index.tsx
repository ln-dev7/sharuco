"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import { useCollection } from "@/firebase/firestore/getCollection"
import { useCollections } from "@/firebase/firestore/getCollections"
import { useToast } from "@/hooks/use-toast"
import delinearizeCode from "@/utils/delinearizeCode"
import indentCode from "@/utils/indentCode"
import { Copy, Github, Loader2, Star } from "lucide-react"
import Prism from "prismjs"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import { ToastAction } from "@/components/ui/toast"
import "prism-themes/themes/prism-one-dark.min.css"
import { useSearchParams } from "next/navigation"

import { siteConfig } from "@/config/site"
import Error from "@/components/error"
import { Layout } from "@/components/layout"
import Loader from "@/components/loader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"

export default function User() {
  const searchParams = useSearchParams()

  const { data, isLoading, isError } = useCollection(
    searchParams.get("user"),
    "users"
  )

  return (
    <Layout>
      <Head>
        <title>Sharuco</title>
        <meta
          name="description"
          content="Sharuco allows you to share code snippets that you have found
           useful."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
          {isLoading && <Loader />}
          {data && data.exists && (
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-40 w-40 cursor-pointer">
                <AvatarImage
                  src={data.data.photoURL}
                  alt={data.data.displayName}
                />
                <AvatarFallback>{data.data.displayName}</AvatarFallback>
              </Avatar>
              <h1 className="text-4xl font-bold">{data.data.displayName}</h1>
            </div>
          )}
          {data && !data.exists && (
            <div className="flex flex-col items-center gap-4">
              <h1 className="tesxt-4xl font-bold">User not found</h1>
              <Link
                href="/"
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                Go back to home
              </Link>
            </div>
          )}
          {isError && <Error />}
      </section>
    </Layout>
  )
}
