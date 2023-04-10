"use client"

import Head from "next/head"
import { useAuthContext } from "@/context/AuthContext"
import { useDocument } from "@/firebase/firestore/getDocument"
import { useGetIsPrivateCodes } from "@/firebase/firestore/getIsPrivateCodes"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import CardCode from "@/components/card-code"
import Error from "@/components/error"
import { Layout } from "@/components/layout"
import Loader from "@/components/loader"

export default function Popular() {
  const { user } = useAuthContext()
  const pseudo = user?.reloadUserInfo.screenName

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
          {/* <SearchCode
            dataCodes={dataPublicCodes}
            isLoadingCodes={isLoadingPublicCodes}
            isErrorCodes={isErrorPublicCodes}
          /> */}
        </div>
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
      </section>
    </Layout>
  )
}
