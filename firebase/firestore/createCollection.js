import { collection, doc, getFirestore, setDoc } from "firebase/firestore"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

export default async function createCollection(collectionName, data) {
  let result = null
  let error = null

  try {
    const collectionRef = collection(db, collectionName)
    await setDoc(doc(collectionRef), data, { merge: true })
    result = "Collection updated successfully"
  } catch (e) {
    if (e.code === "not-found") {
      try {
        await setDoc(doc(db, collectionName), data)
        result = "Collection created and updated successfully"
      } catch (e) {
        error = e
      }
    } else {
      error = e
    }
  }

  return { result, error }
}
