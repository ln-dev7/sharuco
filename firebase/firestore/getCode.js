import { doc, getDoc, getFirestore } from "firebase/firestore"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

export default async function getCode(userId) {
  let result = null
  let error = null
  let exists = false

  try {
    const userDocRef = doc(db, "codes", userId)
    result = await getDoc(userDocRef)
    exists = result.exists()
  } catch (e) {
    error = e
  }

  return { result, error, exists }
}
