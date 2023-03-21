"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import addData from "@/firebase/firestore/addData"
import getDocuments from "@/firebase/firestore/getDocuments"
import { useToast } from "@/hooks/use-toast"
import delinearizeCode from "@/utils/delinearizeCode"
import indentCode from "@/utils/indentCode"
import { Copy, Github, Loader2 } from "lucide-react"
import Prism from "prismjs"

import { ToastAction } from "@/components/ui/toast"
import "prism-themes/themes/prism-night-owl.css"
import { siteConfig } from "@/config/site"
import { Layout } from "@/components/layout"
import Loader from "@/components/loader"
import { Button, buttonVariants } from "@/components/ui/button"

function copyToClipboard(code: string) {
  const text = indentCode(code)
  navigator.clipboard.writeText(text)
}

function highlight(code: string, language: string) {
  const grammar = Prism.languages[language]
  if (!grammar) {
    console.warn(`Prism does not support ${language} syntax highlighting.`)
    return code
  }
  return Prism.highlight(indentCode(code), grammar, language)
}

export default function Popular() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleAddCode = async () => {
    const data = {
      idAuthor: "ln-de7",
      language: "JavaScript",
    }
    const { result, error } = await addData("codes", "user-id", data)

    if (error) {
      return console.log(error)
    }
  }

  const [allCodes, setAllCodes]: [any, (value: any) => void] = useState([])

  useEffect(() => {
    setLoading(true)
    const fetchAllCodes = async () => {
      const { result, error } = await getDocuments("codes")
      if (error) {
        return console.log("popular 1", error)
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
        <title>Sharuco | Popular</title>
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
          <h1 className="text-2xl font-extrabold leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-4xl">
            Discover the most loved code snippets.
          </h1>
        </div>
        <div className="flex flex-col gap-4 p-8">
          {loading ? (
            <Loader />
          ) : (
            allCodes.map((code) => (
              <div key={code.id}>
                <p>{code.language}</p>
                <p>{code.idAuthor}</p>

                <Button
                  variant="outline"
                  onClick={() => {
                    copyToClipboard(code.code)
                    toast({
                      title: "Copied to clipboard",
                      description: "The code has been copied to your clipboard",
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
                <pre className="w-max rounded-lg bg-slate-200 p-4 dark:bg-slate-800">
                  <code
                    dangerouslySetInnerHTML={{
                      __html: highlight(code.code, code.language),
                    }}
                  />
                </pre>
              </div>
            ))
          )}
          {/* <Button className="w-max" onClick={handleAddCode}>
            Add code
          </Button> */}
        </div>
      </section>
    </Layout>
  )
}
