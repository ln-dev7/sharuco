"use client"

import { useEffect } from "react"
import Head from "next/head"
import Link from "next/link"
import {
  PAYMENT_STATUS,
  SUBSCRIPTIONS_PRICE,
  SUBSCRIPTIONS_TYPE,
} from "@/constants/subscriptions-infos.js"
import { useAuthContext } from "@/context/AuthContext"
import { useDocument } from "@/firebase/firestore/getDocument"
import { useGetIsPrivateCodes } from "@/firebase/firestore/getIsPrivateCodes"
import { useUpdateUserDocument } from "@/firebase/firestore/updateUserDocument.js"
import moment from "moment"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import CardCode from "@/components/card-code"
import Error from "@/components/error"
import { Layout } from "@/components/layout"
import Loader from "@/components/loader"

export default function Popular() {
  const { user } = useAuthContext()
  const pseudo = user?.reloadUserInfo.screenName

  const { updateUserDocument }: any = useUpdateUserDocument("users")

  const {
    data: dataUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useDocument(pseudo, "users")

  const {
    isLoading: isLoadingPublicCodes,
    isError: isErrorPublicCodes,
    data: dataPublicCodes,
  } = useGetIsPrivateCodes(false)
  return (
    <Layout>
      <Head>
        <title>Sharuco | Popular</title>
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
          content="Explore the most loved code codes."
        />
        <meta
          name="twitter:image"
          content="https://sharuco.lndev.me/sharuco-popular.png"
        />

        <meta property="og:title" content="Sharuco Popular" />
        <meta
          property="og:description"
          content="Explore the most loved code codes."
        />
        <meta
          property="og:image"
          content="https://sharuco.lndev.me/sharuco-popular.png"
        />
        <meta property="og:url" content="https://sharuco.lndev.me/popular" />
        <meta property="og:type" content="website" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-8 pt-6 pb-8 md:py-10">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-2xl font-extrabold leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-4xl">
            Discover the 20 most popular codes.
          </h1>
          {!(dataUser?.data.premium && user) ? (
            <p className="max-w-[700px] text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
              This page is reserved for premium members.
            </p>
          ) : null}

          {/* <SearchCode
            dataCodes={dataPublicCodes}
            isLoadingCodes={isLoadingPublicCodes}
            isErrorCodes={isErrorPublicCodes}
          /> */}
        </div>
        {/* page reserver aux premium */}
        {dataUser?.data.premium && user ? (
          <div className="">
            {isLoadingPublicCodes && <Loader />}
            {dataPublicCodes && (
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
                      return b.favoris.length - a.favoris.length
                    })
                    .slice(0, 20)
                    .map((code) => (
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
                        currentUser={dataUser?.data}
                        comments={code.comments}
                      />
                    ))}
                </Masonry>
              </ResponsiveMasonry>
            )}
            {isErrorPublicCodes && <Error />}
          </div>
        ) : (
          <div className="">
            <Link
              href="/join-sharucoplus"
              className="group relative mb-2 mr-2 mt-4 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5 text-sm font-bold text-white group-hover:from-cyan-500 group-hover:to-blue-500"
            >
              <span className="relative rounded-md bg-gray-900 px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0">
                Join Sharuco Plus
              </span>
            </Link>
          </div>
        )}
      </section>
    </Layout>
  )
}
