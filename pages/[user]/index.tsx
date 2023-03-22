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
import { useGetIsPrivateCodes } from "@/firebase/firestore/getIsPrivateCodes"
import moment from "moment"

import { siteConfig } from "@/config/site"
import CardCode from "@/components/card-code"
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

  const {
    isLoading: isLoadingCodes,
    isError: isErrorCodes,
    data: dataCodes,
  } = useGetIsPrivateCodes(false)

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
            <h1 className="mb-8 text-4xl font-bold">{data.data.displayName}</h1>
            {isLoadingCodes && <Loader />}
            {dataCodes && dataCodes.length > 0 ? (
              <ResponsiveMasonry
                columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
                className="w-full"
              >
                <Masonry gutter="1rem">
                  {dataCodes
                    .sort((a, b) => {
                      return moment(b.createdAt).diff(moment(a.createdAt))
                    })
                    .map(
                      (code: {
                        id: string
                        idAuthor: string
                        language: string
                        code: string
                        description: string
                        tags: string[]
                        favoris: string[]
                      }) => (
                        <CardCode
                          key={code.id}
                          id={code.id}
                          idAuthor={code.idAuthor}
                          language={code.language}
                          code={code.code}
                          description={code.description}
                          tags={code.tags}
                          favoris={code.favoris}
                        />
                      )
                    )}
                </Masonry>
              </ResponsiveMasonry>
            ) : (
              <h1 className="text-2xl font-bold">
                This user has not shared any code yet
              </h1>
            )}
            {isErrorCodes && <Error />}
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
