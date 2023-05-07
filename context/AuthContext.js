import { createContext, useContext, useEffect, useState } from "react"
import firebase_app from "@/firebase/config"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore"
import { Loader } from "lucide-react"

const db = getFirestore(firebase_app)

const auth = getAuth(firebase_app)

export const AuthContext = createContext({
  user: null,
})

export const useAuthContext = () => useContext(AuthContext)

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)

        async function addUID() {
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
              },
              { merge: true }
            )
          }
        }
        addUID()
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center">
          <Loader className="animate-spin" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}
