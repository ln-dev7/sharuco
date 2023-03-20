import { useState } from "react"
import { auth } from "@/firebase/config"
import { GithubAuthProvider, signInWithPopup } from "firebase/auth"

export const useGitHubLoign = () => {
  const [error, setError] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const provider = new GithubAuthProvider()

  const login = async () => {
    setError(null)
    setIsPending(true)

    try {
      const res = await signInWithPopup(auth, provider)
      if (!res) {
        throw new Error("Could not complete signup")
      }

      const user = res.user
      console.log(user)
      setIsPending(false)
    } catch (error) {
      console.log(error)
      setError(error.message)
      setIsPending(false)
    }
  }

  return { login, error, isPending }
}
