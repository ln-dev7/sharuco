"use client"

import Head from "next/head"
import { useAuthContext } from "@/context/AuthContext"
import { useDocument } from "@/firebase/firestore/getDocument"
import { useGetIsPrivateCodes } from "@/firebase/firestore/getIsPrivateCodes"
import moment from "moment"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import CardCode from "@/components/card-code"
import Error from "@/components/error"
import { Layout } from "@/components/layout"
import Loader from "@/components/loader"
import "prism-themes/themes/prism-one-dark.min.css"

export default function Explore() {
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
        <title>Sharuco | Explore</title>
        <meta
          name="description"
          content="Sharuco allows you to share code snippets that you have found
      useful."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-8 pt-6 pb-8 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-2xl font-extrabold leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-4xl">
            Discover little bits of code that can help you.
          </h1>
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
                      isPrivate: boolean
                      currentUser: any
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
                        currentUser={dataUser?.data}
                      />
                    )
                  )}
              </Masonry>
            </ResponsiveMasonry>
          )}
          {isErrorPublicCodes && <Error />}
        </div>
      </section>
    </Layout>
  )
}
