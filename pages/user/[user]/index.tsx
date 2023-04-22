"use client"

import Head from "next/head"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useDocument } from "@/firebase/firestore/getDocument"
import { useGetFavoriteCode } from "@/firebase/firestore/getFavoriteCode"
import { useGetIsPrivateCodeFromUser } from "@/firebase/firestore/getIsPrivateCodeFromUser"
import { Eye, Star, Verified } from "lucide-react"
import moment from "moment"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import CardCode from "@/components/card-code"
import Error from "@/components/error"
import { Layout } from "@/components/layout"
import Loader from "@/components/loader"
import LoaderCodes from "@/components/loader-codes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

  const {
    isLoading: isLoadingFavoriteCodes,
    isError: isErrorFavoriteCodes,
    data: dataFavoriteCodes,
  } = useGetFavoriteCode(searchParams.get("user"))

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
        {isLoading && <LoaderCodes isUserProfile={true} />}
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
                  {data.data.premium && (
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
            <Tabs defaultValue="public-code" className="w-full">
              <TabsList>
                <div>
                  <TabsTrigger value="public-code">
                    <Eye className="mr-2 h-4 w-4" />
                    public code
                  </TabsTrigger>
                  <TabsTrigger value="favorite-code">
                    <Star className="mr-2 h-4 w-4" />
                    Favorite code
                  </TabsTrigger>
                </div>
              </TabsList>
              <TabsContent className="border-none p-0 pt-4" value="public-code">
                {isLoadingPublicCodes && <LoaderCodes />}
                {dataPublicCodes && (
                  <>
                    <ResponsiveMasonry
                      columnsCountBreakPoints={{
                        659: 1,
                        660: 1,
                        720: 1,
                        1200: 2,
                      }}
                      className="w-full"
                    >
                      <Masonry gutter="2rem">
                        {dataPublicCodes.map(
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
              </TabsContent>
              <TabsContent
                className="border-none p-0 pt-4"
                value="favorite-code"
              >
                {isLoadingFavoriteCodes && <LoaderCodes />}
                {dataFavoriteCodes && (
                  <>
                    <ResponsiveMasonry
                      columnsCountBreakPoints={{
                        659: 1,
                        660: 1,
                        720: 1,
                        1200: 2,
                      }}
                      className="w-full"
                    >
                      <Masonry gutter="2rem">
                        {dataFavoriteCodes.map(
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
                    {dataFavoriteCodes.length == 0 && (
                      <div className="flex flex-col items-center gap-4">
                        <h1 className="text-center text-2xl font-bold">
                          This user has not favorite any code yet
                        </h1>
                      </div>
                    )}
                  </>
                )}
                {isErrorFavoriteCodes && <Error />}
              </TabsContent>
            </Tabs>
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
