"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import login from "@/firebase/auth/login"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const handleForm = async (event) => {
    try {
      event.preventDefault()
      setLoading(true)
      const { result, error } = await login(email, password)
      return router.push("/dashboard")
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="mb-16 p-16">
      <div>
        <h2 className="mt-10 scroll-m-20 border-b border-b-slate-200 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700">
          Login
        </h2>
        <form onSubmit={handleForm} className="flex flex-col gap-4 p-8">
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
          <Button disabled={loading} className="w-max" type="submit">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Connexion
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Login
