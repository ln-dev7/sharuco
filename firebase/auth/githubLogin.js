import { useState } from "react"
import { auth } from "@/firebase/config"
import { useUpdateDocument } from "@/firebase/firestore/updateDocument"
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

      useUpdateDocument("users", user.reloadUserInfo.screenName, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: parseInt(user.metadata.createdAt),
        lastLoginAt: parseInt(user.metadata.lastLoginAt),
      })

      //console.log(user)
    } catch (error) {
      console.log(error)
      setError(error.message)
    } finally {
      setIsPending(false)
    }
  }

  return { login, error, isPending }
}
