"use client"

import Head from "next/head"
import { NBR_OF_POPULAR_CODES } from "@/constants/nbr-codes.js"
import { useAuthContext } from "@/context/AuthContext"
import { useDocument } from "@/firebase/firestore/getDocument"
import { useGetPopularCodes } from "@/firebase/firestore/getPopularCodes.js"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import CardCode from "@/components/cards/card-code"
import Error from "@/components/error"
import { Layout } from "@/components/layout"
import LoaderCodes from "@/components/loaders/loader-codes"

export default function Popular() {
  const { user, userPseudo } = useAuthContext()

  const {
    data: dataUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useDocument(userPseudo, "users")

  const {
    isLoading: isLoadingPopularCodes,
    isError: isErrorPopularCodes,
    data: dataPopularCodes,
  } = useGetPopularCodes()

  return (
    <Layout>
      <Head>
        <title>Sharuco | Popular code</title>
        <meta
          name="description"
          content="Sharuco allows you to share code codes that you have found
          useful."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-adsense-account" content="ca-pub-2222017759396595" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-8 pb-8 pt-6 md:py-10">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-2xl font-extrabold leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-4xl">
            Discover the {NBR_OF_POPULAR_CODES} most popular codes.
          </h1>
          {/* <SearchCode
            dataCodes={dataPopularCodes}
            isLoadingCodes={isLoadingPopularCodes}
            isErrorCodes={isErrorPopularCodes}
          /> */}
        </div>
        <div className="">
          {isLoadingPopularCodes && <LoaderCodes />}
          {dataPopularCodes && (
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
                {dataPopularCodes.map((code) => (
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
          {isErrorPopularCodes && <Error />}
        </div>
      </section>
    </Layout>
  )
}
