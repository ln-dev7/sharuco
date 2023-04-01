"use client"

import Head from "next/head"
import Link from "next/link"

import { Layout } from "@/components/layout"
import { buttonVariants } from "@/components/ui/button"

export default function Custom404() {
  return (
    <Layout>
      <Head>
        <title>Sharuco | Page Not Fount</title>
        <meta
          name="description"
          content="Sharuco allows you to share code codes that you have found
      useful."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sharuco" />
        <meta
          name="twitter:description"
          content="This page does not exist."
        />
        <meta
          name="twitter:image"
          content="https://sharuco.lndev.me/sharuco.png"
        />

<meta property="og:title" content="Sharuco" />
        <meta
          property="og:description"
          content="This page does not exist."
        />
        <meta
          property="og:image"
          content="https://sharuco.lndev.me/sharuco.png"
        />
        <meta property="og:url" content="https://sharuco.lndev.me/404/404" />
        <meta property="og:type" content="website" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-8 pt-6 pb-8 md:py-10">
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
