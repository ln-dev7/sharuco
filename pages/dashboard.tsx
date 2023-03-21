"use client"

import React, { useEffect, useState } from "react"
import Head from "next/head"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLogout } from "@/firebase/auth/githubLogout"
import addData from "@/firebase/firestore/addData"
import getDocuments from "@/firebase/firestore/getDocuments"

import { Layout } from "@/components/layout"
import { Button, buttonVariants } from "@/components/ui/button"

export default function Dashboard() {
  const { logout } = useGitHubLogout()

  const { user } = useAuthContext()
  const router = useRouter()
  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  })

  return (
    <Layout>
      <Head>
        <title>Sharuco | Dashboard</title>
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
            Dashboard
          </h1>
          <button onClick={logout} className={buttonVariants({ size: "lg" })}>
            Logout
          </button>
        </div>
      </section>
    </Layout>
  )
}
