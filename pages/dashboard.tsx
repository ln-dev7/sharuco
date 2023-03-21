"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLogout } from "@/firebase/auth/githubLogout"
import addData from "@/firebase/firestore/addData"
import getDocuments from "@/firebase/firestore/getDocuments"

import { Button } from "@/components/ui/button"

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
    <div className="mb-16 p-16">
      <div>
        <h2 className="mt-10 scroll-m-20 border-b border-b-slate-200 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700">
          Dashboard
        </h2>
        <Button variant="destructive" onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  )
}
