"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import addData from "@/firebase/firestore/addData"
import getDocuments from "@/firebase/firestore/getDocuments"
import { Github, Loader2 } from "lucide-react"
import Prism from "prismjs"

import "prism-themes/themes/prism-night-owl.css"
import { siteConfig } from "@/config/site"
import { Layout } from "@/components/layout"
import Loader from "@/components/loader"
import { Button, buttonVariants } from "@/components/ui/button"

function formaterCodeJS(chaine: string) {
  let indentation = 0
  let nouvelleChaine = ""

  for (let i = 0; i < chaine.length; i++) {
    let caractereCourant = chaine[i]
    let caractereSuivant = chaine[i + 1]

    if (caractereCourant === "{") {
      nouvelleChaine += "{\n" + "  ".repeat(indentation + 1)
      indentation++
    } else if (caractereCourant === "}") {
      indentation--
      nouvelleChaine +=
        "\n" + "  ".repeat(indentation) + "}\n" + "  ".repeat(indentation)
    } else {
      nouvelleChaine += caractereCourant

      if (
        caractereCourant === "}" ||
        (caractereCourant === ")" &&
          caractereSuivant !== "{" &&
          caractereSuivant !== "}")
      ) {
        nouvelleChaine += "\n" + "  ".repeat(indentation)
      }
    }
  }

  return nouvelleChaine
}

function highlight(code: string, language: string) {
  const grammar = Prism.languages[language]
  if (!grammar) {
    console.warn(`Prism does not support ${language} syntax highlighting.`)
    return code
  }
  return Prism.highlight(formaterCodeJS(code), grammar, language)
}

export default function Popular() {
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
            Discover the most loved code snippets
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
                <pre className="w-1/2 rounded-lg bg-slate-200 p-4 dark:bg-slate-800">
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
