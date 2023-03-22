import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLoign } from "@/firebase/auth/githubLogin"
import getCollections from "@/firebase/firestore/getCollections"
import { Code2, Github, Loader2 } from "lucide-react"

import { siteConfig } from "@/config/site"
import { Layout } from "@/components/layout"
import { buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  const { login, isPending } = useGitHubLoign()
  const { user } = useAuthContext()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const [allUsers, setAllUsers]: [any, (value: any) => void] = useState([])

  useEffect(() => {
    setLoading(true)
    const fetchAllCodes = async () => {
      const { result, error } = await getCollections("users")
      if (error) {
        setLoading(false)
      }
      setAllUsers(result.docs.map((doc) => doc.data()))
      setLoading(false)
    }
    fetchAllCodes()
  }, [])

  return (
    <Layout>
      <Head>
        <title>Sharuco</title>
        <meta
          name="description"
          content="Sharuco allows you to share code snippets that you have found
          useful."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            Share your code
            <br className="hidden sm:inline" />
            with everyone.
          </h1>
          <p className="max-w-[700px] text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
            Sharuco allows you to share code snippets that you have found
            useful.
          </p>
        </div>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 md:flex-row">
          <Link
            href={siteConfig.links.donation}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ size: "lg" })}
          >
            Donnation
          </Link>
          {user ? (
            <Link
              href="/dashboard"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              <Code2 className="mr-2 h-4 w-4" />
              Your dashboard
            </Link>
          ) : (
            <button
              className={buttonVariants({ variant: "outline", size: "lg" })}
              disabled={isPending}
              onClick={login}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Github className="mr-2 h-4 w-4" />
              )}
              Sigin with Github
            </button>
          )}
        </div>
        {!loading ? (
          <p className="text-sm text-slate-700 dark:text-slate-400">
            <span className="font-bold">{allUsers.length}</span> users
            registered on sharuco.
          </p>
        ) : (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
      </section>
    </Layout>
  )
}
