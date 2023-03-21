"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import getCollections from "@/firebase/firestore/getCollections"
import { useToast } from "@/hooks/use-toast"
import copyToClipboard from "@/utils/copyToClipboard"
import delinearizeCode from "@/utils/delinearizeCode"
import highlight from "@/utils/highlight"
import indentCode from "@/utils/indentCode"
import { Copy, Github, Loader2, Share, Star } from "lucide-react"
import Prism from "prismjs"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ToastAction } from "@/components/ui/toast"
import "prism-themes/themes/prism-one-dark.min.css"
import { useQuery } from "react-query"

import { siteConfig } from "@/config/site"
import { Layout } from "@/components/layout"
import Loader from "@/components/loader"
import { Button, buttonVariants } from "@/components/ui/button"

export default function Explore() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const [allCodes, setAllCodes]: [any, (value: any) => void] = useState([])

  useEffect(() => {
    setLoading(true)
    const fetchAllCodes = async () => {
      const { result, error } = await getCollections("codes")
      if (error) {
        setLoading(false)
      }
      setAllCodes(result.docs.map((doc) => doc.data()))
      setLoading(false)
    }
    fetchAllCodes()
  }, [])
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
          {loading ? (
            <Loader />
          ) : (
            <ResponsiveMasonry
              columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
            >
              <Masonry gutter="1rem">
                {allCodes.map(
                  (code: {
                    id: string
                    idAuthor: string
                    language: string
                    code: string
                    description: string
                    tags: string[]
                  }) => (
                    <div key={code.id} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <Button
                          variant="subtle"
                          onClick={() => {
                            copyToClipboard(code.code)
                            toast({
                              title: "Copied to clipboard",
                              description:
                                "The code has been copied to your clipboard",
                              action: (
                                <ToastAction altText="Goto schedule to undo">
                                  Undo
                                </ToastAction>
                              ),
                            })
                          }}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy code
                        </Button>
                        <div className="flex items-center justify-start gap-2">
                          <Button>
                            <Star className="mr-2 h-4 w-4" />0
                          </Button>
                          <Button>
                            <Share className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <pre className="w-auto overflow-x-auto rounded-lg border border-slate-600 bg-slate-900 p-4 dark:bg-black">
                        <code
                          className="text-white"
                          dangerouslySetInnerHTML={{
                            __html: highlight(code.code, code.language),
                          }}
                        />
                      </pre>
                      <Link
                        href={`/${code.idAuthor}`}
                        className="flex items-center justify-start gap-2"
                      >
                        <Avatar className="h-8 w-8 cursor-pointer">
                          <AvatarImage
                            src="https://github.com/shadcn.png"
                            alt="@ln_dev7"
                          />
                          <AvatarFallback>LN</AvatarFallback>
                        </Avatar>
                        <span className="text-md font-bold text-slate-700 hover:underline dark:text-slate-400 ">
                          {code.idAuthor}
                        </span>
                      </Link>
                      <p className="text-sm text-slate-700 dark:text-slate-400">
                        {code.description}
                      </p>
                      <div className="flex items-center justify-start gap-2">
                        {code.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-slate-700 px-2 py-1 text-xs font-medium text-slate-100 dark:bg-slate-600 dark:text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </Masonry>
            </ResponsiveMasonry>
          )}
        </div>
      </section>
    </Layout>
  )
}
