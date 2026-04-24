import { auth } from "@/firebase/config"
import { signOut } from "firebase/auth"

interface UseGitHubLogoutReturn {
  logout: () => Promise<void>
}

export const useGitHubLogout = (): UseGitHubLogoutReturn => {
  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(message)
    }
  }

  return { logout }
}
