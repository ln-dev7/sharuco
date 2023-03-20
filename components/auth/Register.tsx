"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import register from "@/firebase/auth/register"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleForm = async (event) => {
    event.preventDefault()

    const { result, error } = await register(email, password)

    if (error) {
      return console.log(error)
    }

    // else successful
    console.log(result)
    return router.push("/dashboard")
  }
  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <h2 className="mt-10 scroll-m-20 border-b border-b-slate-200 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700">
          Register
        </h2>
        <form onSubmit={handleForm} className="form">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit">Sign Up</Button>
        </form>
      </div>
    </div>
  )
}

export default Register
