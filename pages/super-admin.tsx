"use client"

import { useEffect } from "react"
import Head from "next/head"
import { useRouter } from "next/navigation"
import { SUPER_ADMIN } from "@/constants/super-admin"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLogout } from "@/firebase/auth/githubLogout"
import { useDocuments } from "@/firebase/firestore/getDocuments"
import { Code, UserIcon } from "lucide-react"
import { Toaster } from "react-hot-toast"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import CardCodeAdmin from "@/components/card-code-admin"
import CardUserAdmin from "@/components/card-user-admin"
import Error from "@/components/error"
import { Layout } from "@/components/layout"
import Loader from "@/components/loader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoaderCodes from "@/components/loader-codes"

export default function Dashboard() {
  const { logout } = useGitHubLogout()

  const { user } = useAuthContext()
  const router = useRouter()
  useEffect(() => {
    if (!user || !SUPER_ADMIN.includes(user.reloadUserInfo.screenName.toLowerCase())) {
      router.push("/")
    }
  })

  const {
    data: dataUsers,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = useDocuments("users")

  const {
    data: dataCodes,
    isLoading: isLoadingCodes,
    isError: isErrorCodes,
  } = useDocuments("codes")

  return (
    <Layout>
      <Head>
        <title>Sharuco | Super Admin</title>
        <meta
          name="description"
          content="Sharuco allows you to share code codes that you have found
         useful."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sharuco" />
        <meta name="twitter:description" content="Super dashboard on Sharuco" />
        <meta
          name="twitter:image"
          content="https://sharuco.lndev.me/sharuco-dashboard.png"
        />

        <meta property="og:title" content="Sharuco Dashboard" />
        <meta property="og:description" content="Super dashboard on Sharuco" />
        <meta
          property="og:image"
          content="https://sharuco.lndev.me/sharuco-dashboard.png"
        />
        <meta property="og:url" content="https://sharuco.lndev.me/dasboard" />
        <meta property="og:type" content="website" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
        <Toaster position="top-right" reverseOrder={false} />
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-2xl font-extrabold leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-4xl">
            Hello Admin
          </h1>
          {dataUsers && dataCodes && (
            <p className="text-lg text-slate-700 dark:text-slate-400">
              <span className="font-bold">{dataUsers.length} users </span>
              registered and{" "}
              <span className="font-bold">{dataCodes.length} codes</span> shared
              on Sharuco
            </p>
          )}
        </div>
        <Tabs defaultValue="all-codes" className="w-full">
          <TabsList>
            <div>
              <TabsTrigger value="all-codes">
                <Code className="mr-2 h-4 w-4" />
                All codes
              </TabsTrigger>
              <TabsTrigger value="all-users">
                <UserIcon className="mr-2 h-4 w-4" />
                All users
              </TabsTrigger>
            </div>
          </TabsList>
          <TabsContent className="border-none p-0 pt-4" value="all-codes">
            {isLoadingCodes && <LoaderCodes />}
            {dataCodes && (
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
                  <Masonry gutter="2rem">
                    {dataCodes
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
                          comments: any
                        }) => (
                          <CardCodeAdmin
                            key={code.id}
                            id={code.id}
                            idAuthor={code.idAuthor}
                            language={code.language}
                            code={code.code}
                            description={code.description}
                            tags={code.tags}
                            favoris={code.favoris}
                            isPrivate={code.isPrivate}
                            comments={code.comments}
                          />
                        )
                      )}
                  </Masonry>
                </ResponsiveMasonry>
                {dataCodes.length == 0 && (
                  <div className="flex flex-col items-center gap-4">
                    <h1 className="text-2xl font-bold">
                      You don&apos;t have any public code yet
                    </h1>
                  </div>
                )}
              </>
            )}
            {isErrorCodes && <Error />}
          </TabsContent>
          <TabsContent className="border-none p-0 pt-4" value="all-users">
            {isLoadingUsers && <Loader />}
            {dataUsers && (
              <ResponsiveMasonry
                columnsCountBreakPoints={{
                  659: 1,
                  660: 2,
                  899: 3,
                  900: 3,
                  1200: 4,
                }}
                className="w-full"
              >
                <Masonry gutter="2rem">
                  {dataUsers
                    .map(
                      (dataUser: {
                        pseudo: string
                        displayName: string
                        photoURL: string
                      }) => (
                        <CardUserAdmin
                          key={dataUser.pseudo}
                          pseudo={dataUser.pseudo}
                          displayName={
                            dataUser.displayName
                              ? dataUser.displayName.split(" ")[0]
                              : dataUser.pseudo
                          }
                          photoURL={dataUser.photoURL}
                        />
                      )
                    )}
                </Masonry>
              </ResponsiveMasonry>
            )}
            {isErrorUsers && <Error />}
          </TabsContent>
        </Tabs>
      </section>
    </Layout>
  )
}
