import { useState } from "react"
import { auth } from "@/firebase/config"
import { GithubAuthProvider, signInWithPopup, signOut } from "firebase/auth"
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

export const useGitHubLogin = () => {
  const [error, setError] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const provider = new GithubAuthProvider()

  const login = async () => {
    setError(null)
    setIsPending(true)

    try {
      const res = await signInWithPopup(auth, provider)
      if (!res) {
        //throw new Error("Could not complete signup")
        return
      }

      const user = res.user

      const documentRef = doc(
        collection(db, "users"),
        user.reloadUserInfo.screenName.toLowerCase()
      )

      // Vérifier si les données ont été mises à jour avec succès
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

    } catch (error) {
      //console.log(error)
      setError(error.message)
      // Déconnecter l'utilisateur en cas d'erreur
      await signOut(auth)
    } finally {
      setIsPending(false)
    }
  }

  return { login, error, isPending }
}
