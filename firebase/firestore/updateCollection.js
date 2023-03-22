import { collection, doc, getFirestore, setDoc } from "firebase/firestore"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

export default async function updateCollection(collectionName, documentId, data) {
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
