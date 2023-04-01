"use client"

import Head from "next/head"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useDocument } from "@/firebase/firestore/getDocument"
import { useGetIsPrivateCodeFromUser } from "@/firebase/firestore/getIsPrivateCodeFromUser"
import { Verified } from "lucide-react"
import moment from "moment"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import CardCode from "@/components/card-code"
import Error from "@/components/error"
import { Layout } from "@/components/layout"
import Loader from "@/components/loader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"

export default function User() {
  const searchParams = useSearchParams()

  const { data, isLoading, isError } = useDocument(
    searchParams.get("user"),
    "users"
  )

  const {
    isLoading: isLoadingPublicCodes,
    isError: isErrorPublicCodes,
    data: dataPublicCodes,
  } = useGetIsPrivateCodeFromUser(false, searchParams.get("user"))

  return (
    <Layout>
      <Head>
        <title>Sharuco</title>
        <meta
          name="description"
          content="Sharuco allows you to share code codes that you have found
           useful."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sharuco" />
        <meta name="twitter:description" content="View this user on Sharuco" />
        <meta
          name="twitter:image"
          content="https://sharuco.lndev.me/sharuco-user.png"
        />

        <meta property="og:title" content="Sharuco" />
        <meta property="og:description" content="View this user on Sharuco" />
        <meta
          property="og:image"
          content="https://sharuco.lndev.me/sharuco-user.png"
        />
        <meta property="og:url" content="https://sharuco.lndev.me/ln-dev7" />
        <meta property="og:type" content="website" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
        {isLoading && <Loader />}
        {data && data.exists && (
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-40 w-40 cursor-pointer">
              <AvatarImage
                src={data.data.photoURL}
                alt={
                  data.data.displayName !== null
                    ? data.data.displayName
                    : searchParams.get("user")
                }
              />
              <AvatarFallback>
                {data.data.displayName !== null
                  ? data.data.displayName
                  : searchParams.get("user")}
              </AvatarFallback>
            </Avatar>
            <div className="mb-8 flex flex-col items-center gap-2">
              <div className="flex items-center gap-0">
                <h1 className="text-center text-4xl font-bold">
                  {data.data.displayName !== null ? (
                    <>
                      {data.data.displayName.split(" ")[0]}{" "}
                      {data.data.displayName.split(" ")[1] &&
                        data.data.displayName.split(" ")[1]}
                    </>
                  ) : (
                    searchParams.get("user")
                  )}
                </h1>
                <span className="ml-2">
                  {data.data.isCertified && (
                    <Verified className="h-6 w-6 text-green-500" />
                  )}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-center text-gray-500">
                  Joined{" "}
                  <span className="font-bold">
                    {moment(data.data.createdAt).fromNow()}
                  </span>
                </p>
              </div>
            </div>
            {isLoadingPublicCodes && <Loader />}
            {dataPublicCodes && (
              <>
                <ResponsiveMasonry
                  columnsCountBreakPoints={{
                    659: 1,
                    660: 2,
                    720: 2,
                    990: 3,
                  }}
                  className="w-full"
                >
                  <Masonry gutter="1rem">
                    {dataPublicCodes
                      .sort((a, b) => {
                        return b.createdAt - a.createdAt
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
                          isPrivate: boolean
                          currentUser: any
                          comments: any
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
                            isPrivate={code.isPrivate}
                            currentUser={data?.data}
                            comments={code.comments}
                          />
                        )
                      )}
                  </Masonry>
                </ResponsiveMasonry>
                {dataPublicCodes.length == 0 && (
                  <div className="flex flex-col items-center gap-4">
                    <h1 className="text-center text-2xl font-bold">
                      This user has not shared any code yet
                    </h1>
                  </div>
                )}
              </>
            )}
            {isErrorPublicCodes && <Error />}
          </div>
        )}
        {data && !data.exists && (
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold">User not found</h1>
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
