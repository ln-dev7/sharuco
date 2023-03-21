import { doc, getDoc, getFirestore } from "firebase/firestore"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

export default async function getUser(userId) {
  let result = null
  let error = null
  let exists = false

  try {
    const userDocRef = doc(db, "users", userId)
    result = await getDoc(userDocRef)
    exists = result.exists()
  } catch (e) {
    error = e
  }

  return { result, error, exists }
}
