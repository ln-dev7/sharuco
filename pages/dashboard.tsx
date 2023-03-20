"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"

function Dashboard() {
  const { user } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (user == null) router.push("/")
  }, [user])

  return <h1>Only logged in users can view this page</h1>
}

export default Dashboard
