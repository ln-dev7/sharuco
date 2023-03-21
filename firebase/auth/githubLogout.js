import { auth } from "@/firebase/config"
import { signOut } from "firebase/auth"

export const useGitHubLogout = () => {
  const logout = async () => {
    try {
      await signOut(auth)
      alert("user logged out")
    } catch (error) {
      console.log(error.message)
    }
  }

  return { logout }
}
