"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import getCode from "@/firebase/firestore/getCode"
import getCollections from "@/firebase/firestore/getCollections"
import { useToast } from "@/hooks/use-toast"
import delinearizeCode from "@/utils/delinearizeCode"
import indentCode from "@/utils/indentCode"
import { Copy, Github, Loader2, Star } from "lucide-react"
import Prism from "prismjs"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import { ToastAction } from "@/components/ui/toast"
import "prism-themes/themes/prism-one-dark.min.css"
import { useSearchParams } from "next/navigation"

import { siteConfig } from "@/config/site"
import CardCode from "@/components/card-code"
import { Layout } from "@/components/layout"
import Loader from "@/components/loader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"

export default function CodePreview() {
  const searchParams = useSearchParams()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [codeExist, setCodeExist] = useState(true)

  const [codeInfos, setCodeInfos]: [any, (value: any) => void] = useState([])

  useEffect(() => {
    setLoading(true)
    const fetchUserInfos = async () => {
      const { result, error, exists } = await getCode(
        searchParams.get("code-preview")
      )
      if (error) {
        setLoading(false)
      }
      if (!exists) {
        setCodeInfos(false)
        setLoading(false)
        return
      }
      setCodeInfos(result.data())
      setLoading(false)
    }
    fetchUserInfos()
  }, [searchParams])

  return (
    <>
      {codeExist ? (
        <Layout>
          <Head>
            <title>Sharuco</title>
            <meta
              name="description"
              content="Sharuco allows you to share code snippets that you have found
                 useful."
            />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
            {loading ? (
              <Loader />
            ) : (
              <ResponsiveMasonry columnsCountBreakPoints={1}>
                <Masonry>
                  <CardCode
                    key={codeInfos.id}
                    id={codeInfos.id}
                    idAuthor={codeInfos.idAuthor}
                    language={codeInfos.language}
                    code={codeInfos.code}
                    description={codeInfos.description}
                    tags={codeInfos.tags}
                  />
                </Masonry>
              </ResponsiveMasonry>
            )}
          </section>
        </Layout>
      ) : (
        <Layout>
          <Head>
            <title>Sharuco | Code don&apos;t exist</title>
            <meta
              name="description"
              content="Sharuco allows you to share code snippets that you have found
                    useful."
            />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
            <div className="flex flex-col items-center gap-4">
              <h1 className="tesxt-4xl font-bold">
                This code don&apos;t exist
              </h1>
              <Link
                href="/explore"
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                Explore code
              </Link>
            </div>
          </section>
        </Layout>
      )}
    </>
  )
}
