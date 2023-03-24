import { useState } from "react"
import { auth } from "@/firebase/config"
import { GithubAuthProvider, signInWithPopup } from "firebase/auth"
import { collection, doc, getFirestore, setDoc } from "firebase/firestore"
import moment from "moment"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

export default async function updateProfile(collectionName, documentId, data) {
  let result = null
  let error = null

  try {
    const documentRef = doc(collection(db, collectionName), documentId)
    await setDoc(documentRef, data, { merge: true })
    result = "Document updated successfully"
  } catch (e) {
    if (e.code === "not-found") {
      try {
        const documentRef = doc(db, `${collectionName}/${documentId}`)
        await setDoc(documentRef, data)
        result = "Document created and updated successfully"
      } catch (e) {
        error = e
      }
    } else {
      error = e
    }
  }

  return { result, error }
}

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

      updateProfile("users", user.reloadUserInfo.screenName, {
        pseudo: user.reloadUserInfo.screenName,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: moment(user.metadata.creationTime).valueOf(),
        lastLoginAt: moment(user.metadata.lastSignInTime).valueOf(),
        favoris: [],
        codes: [],
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
