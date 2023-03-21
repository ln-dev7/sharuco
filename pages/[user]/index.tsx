"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import getCollections from "@/firebase/firestore/getCollections"
import getUser from "@/firebase/firestore/getUser"
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
import { Layout } from "@/components/layout"
import Loader from "@/components/loader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"

export default function User() {
  const searchParams = useSearchParams()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [userExist, setUserExist] = useState(true)

  const [usersInfos, setUsersInfos]: [any, (value: any) => void] = useState([])

  useEffect(() => {
    setLoading(true)
    const fetchUserInfos = async () => {
      const { result, error, exists } = await getUser(searchParams.get("user"))
      if (error) {
        setLoading(false)
      }
      if (!exists) {
        setUserExist(false)
        setLoading(false)
        return
      }
      setUsersInfos(result.data())
      setLoading(false)
    }
    fetchUserInfos()
  }, [searchParams])

  return (
    <>
      {userExist ? (
        <Layout>
          <Head>
            <title>Sharuco | {usersInfos.name}</title>
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
              <Avatar className="h-40 w-40 cursor-pointer">
                <AvatarImage
                  src={usersInfos.photoURL}
                  alt={usersInfos.displayName}
                />
                <AvatarFallback>{usersInfos.displayName}</AvatarFallback>
              </Avatar>
              <h1 className="text-4xl font-bold">{usersInfos.displayName}</h1>
            </div>
          </section>
        </Layout>
      ) : (
        <Layout>
          <Head>
            <title>Sharuco | User not found</title>
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
              <h1 className="tesxt-4xl font-bold">User not found</h1>
              <Link
                href="/"
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                Go back to home
              </Link>
            </div>
          </section>
        </Layout>
      )}
    </>
  )
}
