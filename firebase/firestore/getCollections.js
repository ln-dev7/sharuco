import { collection, getDocs, getFirestore, query } from "firebase/firestore"
import { useQuery } from "react-query"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

const getCollections = async (collectionName) => {
  const querySnapshot = await getDocs(query(collection(db, collectionName)))
  const collections = querySnapshot.docs.map((doc) => doc.data())
  return collections
}

const useCollections = (collectionName) => {
  return useQuery(
    ["collections", collectionName],
    () => getCollections(collectionName)
  )
}

export { useCollections }
