import Head from "next/head"
import Link from "next/link"
import { Github, Loader2 } from "lucide-react"

import { siteConfig } from "@/config/site"
import { Layout } from "@/components/layout"
import { buttonVariants } from "@/components/ui/button"

export default function Explore() {
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
      <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            Discover little bits of code
            <br className="hidden sm:inline" />
            that can help you.
          </h1>
        </div>
      </section>
    </Layout>
  )
}
