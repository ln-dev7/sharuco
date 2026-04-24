import { useState } from "react"
import { auth } from "@/firebase/config"
import {
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth"
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore"
import moment from "moment"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

interface UseGitHubLoginReturn {
  login: () => Promise<void>
  error: string | null
  isPending: boolean
}

type GithubUser = User & {
  reloadUserInfo: {
    screenName: string
  }
}

export const useGitHubLogin = (): UseGitHubLoginReturn => {
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const provider = new GithubAuthProvider()

  const login = async () => {
    setError(null)
    setIsPending(true)

    try {
      const res = await signInWithPopup(auth, provider)
      if (!res) {
        return
      }

      const user = res.user as GithubUser

      const documentRef = doc(
        collection(db, "users"),
        user.reloadUserInfo.screenName.toLowerCase()
      )

      const docSnap = await getDoc(documentRef)

      if (docSnap.exists()) {
        await setDoc(
          documentRef,
          {
            uid: user.uid,
            pseudo: user.reloadUserInfo.screenName.toLowerCase(),
            displayName:
              user.displayName !== null
                ? user.displayName
                : user.reloadUserInfo.screenName.toLowerCase(),
            email: user.email,
            photoURL: user.photoURL,
            createdAt: moment(user.metadata.creationTime).valueOf(),
            lastLoginAt: moment(user.metadata.lastSignInTime).valueOf(),
            userToken:
              user.reloadUserInfo.screenName.toLowerCase() +
              moment(user.metadata.creationTime).valueOf(),
          },
          { merge: true }
        )
      } else {
        await setDoc(
          documentRef,
          {
            uid: user.uid,
            pseudo: user.reloadUserInfo.screenName.toLowerCase(),
            displayName:
              user.displayName !== null
                ? user.displayName
                : user.reloadUserInfo.screenName.toLowerCase(),
            email: user.email,
            photoURL: user.photoURL,
            createdAt: moment(user.metadata.creationTime).valueOf(),
            lastLoginAt: moment(user.metadata.lastSignInTime).valueOf(),
            userToken:
              user.reloadUserInfo.screenName.toLowerCase() +
              moment(user.metadata.creationTime).valueOf(),
            following: [],
            followers: [],
            publicLinkPage: false,
          },
          { merge: true }
        )
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
      await signOut(auth)
    } finally {
      setIsPending(false)
    }
  }

  return { login, error, isPending }
}
