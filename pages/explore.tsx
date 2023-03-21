"use client"

import Head from "next/head"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Github, Loader2 } from "lucide-react"

import { siteConfig } from "@/config/site"
import { Layout } from "@/components/layout"
import { Button, buttonVariants } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"

export default function Explore() {
  const { toast } = useToast()
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
          <h1 className="text-2xl font-extrabold leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-4xl">
            Discover little bits of code that can help you.
          </h1>
          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Scheduled: Catch up ",
                description: "Friday, February 10, 2023 at 5:57 PM",
                action: (
                  <ToastAction altText="Goto schedule to undo">
                    Undo
                  </ToastAction>
                ),
              })
            }}
          >
            Add to calendar
          </Button>
        </div>
      </section>
    </Layout>
  )
}
