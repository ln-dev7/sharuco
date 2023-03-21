import { collection, getDocs, getFirestore, query } from "firebase/firestore"

import firebase_app from "../config"

const db = getFirestore(firebase_app)
export default async function getCollections(collectionName) {
  let result = null
  let error = null

  try {
    result = await getDocs(query(collection(db, collectionName)))
  } catch (e) {
    error = e
  }

  return { result, error }
}
