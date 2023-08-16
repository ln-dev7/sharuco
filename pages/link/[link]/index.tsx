"use client"

import Head from "next/head"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLogin } from "@/firebase/auth/githubLogin"
import { useDocument } from "@/firebase/firestore/getDocument"
import { useGetDocumentFromUser } from "@/firebase/firestore/getDocumentFromUser"
import { useGetFavoriteCode } from "@/firebase/firestore/getFavoriteCode"
import { useGetIsPrivateCodeFromUser } from "@/firebase/firestore/getIsPrivateCodeFromUser"
import { useUpdateUserDocument } from "@/firebase/firestore/updateUserDocument"
import formatDateTime from "@/utils/formatDateTime.js"
import {
  Eye,
  FileCog,
  Github,
  Loader2,
  Star,
  UserIcon,
  Verified,
} from "lucide-react"
import moment from "moment"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import { cn } from "@/lib/utils"
import CardCode from "@/components/cards/card-code"
import CardLink from "@/components/cards/card-link"
import EmptyCard from "@/components/empty-card"
import Error from "@/components/error"
import { Layout } from "@/components/layout"
import LoaderLinks from "@/components/loaders/loader-links"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"

export default function User() {
  const searchParams = useSearchParams()
  const idCurrent = searchParams?.get("link")?.toLowerCase()

  const { data, isLoading, isError } = useDocument(idCurrent, "users")

  const {
    isLoading: isLoadingLinks,
    isError: isErrorLinks,
    data: dataLinks,
  } = useGetDocumentFromUser(idCurrent, "links")

  return (
    <Layout>
      <Head>
        <title>Sharuco - Link - {idCurrent}</title>
        <meta
          name="description"
          content="Sharuco allows you to share code codes that you have found
          useful."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>{" "}
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        {isLoading && <LoaderLinks />}
        {data && data.exists && data.data.publicLinkPage && (
          <div className="flex flex-col items-center gap-8">
            <div className="flex w-full items-center justify-start gap-3">
              <div className="relative flex items-center justify-center">
                <Avatar className="h-16 w-16 cursor-pointer">
                  <AvatarImage
                    src={data.data.photoURL}
                    alt={
                      data.data.displayName !== null
                        ? data.data.displayName
                        : idCurrent
                    }
                  />
                  <AvatarFallback>
                    {data.data.displayName !== null
                      ? data.data.displayName
                      : idCurrent}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col items-start gap-0">
                <div className="flex items-center gap-0">
                  <h1 className="text-center text-xl font-bold">
                    {data.data.displayName !== null ? (
                      <>
                        {data.data.displayName.split(" ")[0]}{" "}
                        {data.data.displayName.split(" ")[1] &&
                          data.data.displayName.split(" ")[1]}
                      </>
                    ) : (
                      idCurrent
                    )}
                  </h1>
                  <span className="ml-2">
                    {data.data.premium && (
                      <Verified className="h-4 w-4 text-green-500" />
                    )}
                  </span>
                </div>
                <p className="fonr-medium">
                  All the links of{" "}
                  <Link
                    href={`/user/${idCurrent}`}
                    className="font-bold hover:underline hover:underline-offset-4"
                  >
                    {idCurrent}
                  </Link>
                </p>
              </div>
            </div>
            <div className="w-full">
              {isLoadingLinks && <LoaderLinks />}
              {dataLinks && (
                <>
                  {dataLinks.length > 0 && (
                    <ResponsiveMasonry
                      columnsCountBreakPoints={{
                        659: 1,
                        660: 2,
                        720: 2,
                        990: 3,
                      }}
                      className="w-full"
                    >
                      <Masonry gutter="2rem">
                        {dataLinks.map(
                          (link: {
                            id: string
                            idAuthor: string
                            link: string
                            description: string
                            tags: string[]
                            createdAt: any
                          }) => (
                            <CardLink
                              key={link.id}
                              id={link.id}
                              idAuthor={link.idAuthor}
                              link={link.link}
                              description={link.description}
                              tags={link.tags}
                              createdAt={link.createdAt}
                            />
                          )
                        )}
                      </Masonry>
                    </ResponsiveMasonry>
                  )}
                  {dataLinks.length == 0 && (
                    <EmptyCard
                      icon={<FileCog className="h-12 w-12" />}
                      title="No link found"
                      description="You have not added any link yet."
                    />
                  )}
                </>
              )}
              {isErrorLinks && (
                <EmptyCard
                  icon={<FileCog className="h-12 w-12" />}
                  title="An error has occurred"
                  description="An error has occurred, please try again later or refresh the page."
                />
              )}
            </div>
          </div>
        )}
        {data && (!data.exists || !data.data.publicLinkPage) && (
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold">
              This user has not enabled their public links
            </h1>
            <Link
              href="/"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Go to home
            </Link>
          </div>
        )}
        {isError && <Error />}
      </section>
    </Layout>
  )
}
