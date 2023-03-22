import { doc, getDoc, getFirestore } from "firebase/firestore"
import { useQuery } from "react-query"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

export const getCollection = async (collectionId, collectionName) => {
  const userDocRef = doc(db, collectionName, collectionId)
  const result = await getDoc(userDocRef)
  const exists = result.exists()
  return { data: result.data(), exists: exists }
}

export const useCollection = (collectionId, collectionName) => {
  return useQuery([`collection-${collectionName}`, collectionId], () =>
    getCollection(collectionId, collectionName)
  )
}
