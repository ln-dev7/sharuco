"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import addData from "@/firebase/firestore/addData"
import getDocuments from "@/firebase/firestore/getDocuments"
import { Github, Loader2 } from "lucide-react"
import Highlight, { defaultProps } from "prism-react-renderer"
import { render } from "react-dom"

import { siteConfig } from "@/config/site"
import { Layout } from "@/components/layout"
import { Button, buttonVariants } from "@/components/ui/button"

export default function Popular() {
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
    const fetchAllCodes = async () => {
      const { result, error } = await getDocuments("codes")
      if (error) {
        return console.log(error)
      }
      setAllCodes(result.docs.map((doc) => doc.data()))
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
            Discover the most loved
            <br className="hidden sm:inline" />
            code snippets
          </h1>
        </div>
        <div className="flex flex-col gap-4 p-8">
          {allCodes.map((code) => (
            <div key={code.id}>
              <p>{code.language}</p>
              <p>{code.idAuthor}</p>
              <Highlight
                {...defaultProps}
                code={code.code}
                language="javascript"
              >
                {({
                  className,
                  style,
                  tokens,
                  getLineProps,
                  getTokenProps,
                }) => (
                  <pre className={className} style={style}>
                    {tokens.map((line, i) => (
                      <div {...getLineProps({ line, key: i })}>
                        {line.map((token, key) => (
                          <span {...getTokenProps({ token, key })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>
          ))}
          {/* <Button className="w-max" onClick={handleAddCode}>
            Add code
          </Button> */}
        </div>
      </section>
    </Layout>
  )
}
