import { doc, getDoc, getFirestore } from "firebase/firestore"
import { useQuery } from "react-query"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

export const getDocument = async (documentId, collectionName) => {
  const docRef = doc(db, collectionName, documentId)
  const result = await getDoc(docRef)
  const exists = result.exists()
  return { data: result.data(), exists: exists }
}

export const useDocument = (documentId, collectionName) => {
  return useQuery([`document-${collectionName}`, documentId], () =>
    getDocument(documentId, collectionName)
  )
}
