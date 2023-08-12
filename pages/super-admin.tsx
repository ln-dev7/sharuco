"use client"

import { useEffect } from "react"
import Head from "next/head"
import { useRouter } from "next/navigation"
import { SUPER_ADMIN } from "@/constants/super-admin"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLogout } from "@/firebase/auth/githubLogout"
import { useDocuments } from "@/firebase/firestore/getDocuments"
import { Code, FileCog, UserIcon } from "lucide-react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import CardCodeAdmin from "@/components/cards/card-code-admin"
import CardUserAdmin from "@/components/cards/card-user-admin"
import EmptyCard from "@/components/empty-card"
import Error from "@/components/error"
import { Layout } from "@/components/layout"
import Loader from "@/components/loaders/loader"
import LoaderCodes from "@/components/loaders/loader-codes"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Dashboard() {
  const { logout } = useGitHubLogout()

  const { user } = useAuthContext()
  const router = useRouter()
  useEffect(() => {
    if (
      !user ||
      !SUPER_ADMIN.includes(user.reloadUserInfo.screenName.toLowerCase())
    ) {
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
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
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
                {dataCodes.length > 0 && (
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
                      {dataCodes.map(
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
                )}
                {dataCodes.length == 0 && (
                  <EmptyCard
                    icon={<FileCog className="h-12 w-12" />}
                    title="No code found"
                    description="You don't have any public code any yet."
                  />
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
                  {dataUsers.map(
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
