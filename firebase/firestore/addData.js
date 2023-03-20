import { addDoc, doc, getFirestore } from "firebase/firestore"

import firebase_app from "../config"

const db = getFirestore(firebase_app)
export default async function addData(colllection, id, data) {
  let result = null
  let error = null

  try {
    result = await addDoc(doc(db, colllection, id), data, {
      merge: true,
    })
  } catch (e) {
    error = e
  }

  return { result, error }
}
