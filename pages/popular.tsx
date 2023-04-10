"use client"

import Head from "next/head"

import { Layout } from "@/components/layout"

export default function Popular() {
  return (
    <Layout>
      <Head>
        <title>Sharuco | Popular</title>
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
          content="Explore the most loved code codes."
        />
        <meta
          name="twitter:image"
          content="https://sharuco.lndev.me/sharuco-popular.png"
        />

        <meta property="og:title" content="Sharuco Popular" />
        <meta
          property="og:description"
          content="Explore the most loved code codes."
        />
        <meta
          property="og:image"
          content="https://sharuco.lndev.me/sharuco-popular.png"
        />
        <meta property="og:url" content="https://sharuco.lndev.me/popular" />
        <meta property="og:type" content="website" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-2xl font-extrabold leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-4xl">
            {/* Discover the most loved code codes. */}
            This page is avvailable soon ...
          </h1>
        </div>
      </section>
    </Layout>
  )
}
