"use client"

import Head from "next/head"
import Link from "next/link"

import { Layout } from "@/components/layout"
import { buttonVariants } from "@/components/ui/button"

export default function Custom404() {
  return (
    <Layout>
      <Head>
        <title>Sharuco | Page Not Found</title>
        <meta
          name="description"
          content="Sharuco allows you to share code codes that you have found
          useful."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-8 pb-8 pt-6 md:py-10">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-bold">This page does not exist.</h1>
          <Link
            href="/"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            Go back to home
          </Link>
        </div>
      </section>
    </Layout>
  )
}
