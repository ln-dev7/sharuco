"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore"
import { Loader, Terminal } from "lucide-react"

import firebase_app from "@/firebase/config"

const db = firebase_app ? getFirestore(firebase_app) : null
const auth = firebase_app ? getAuth(firebase_app) : null

type FirebaseUserWithScreenName = User & {
  reloadUserInfo?: { screenName?: string }
}

interface AuthContextValue {
  user: FirebaseUserWithScreenName | null
  userPseudo: string | null
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  userPseudo: null,
})

export const useAuthContext = () => useContext(AuthContext)

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<FirebaseUserWithScreenName | null>(null)
  const [userPseudo, setUserPseudo] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(() => Boolean(auth && db))

  useEffect(() => {
    if (!auth || !db) return
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const u = firebaseUser as FirebaseUserWithScreenName
        setUser(u)
        const screenName = u.reloadUserInfo?.screenName?.toLowerCase() ?? null
        setUserPseudo(screenName)

        if (screenName) {
          const documentRef = doc(collection(db, "users"), screenName)
          getDoc(documentRef).then((docSnap) => {
            if (docSnap.exists()) {
              setDoc(documentRef, { uid: u.uid }, { merge: true })
            }
          })
        }
      } else {
        setUser(null)
        setUserPseudo(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, userPseudo }}>
      {loading ? (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-2">
          <Loader className="animate-spin" />
          <div className="flex items-center gap-1">
            <Terminal />
            <span className="text-lg font-semibold">Sharuco</span>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}
