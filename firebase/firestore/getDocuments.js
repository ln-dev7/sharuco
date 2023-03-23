import { collection, getDocs, getFirestore, query } from "firebase/firestore"
import { useQuery } from "react-query"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

const getDocuments = async (collectionName) => {
  const querySnapshot = await getDocs(query(collection(db, collectionName)))
  const documents = querySnapshot.docs.map((doc) => {
    const data = doc.data()
    data.id = doc.id
    return data
  })
  return documents
}

const useDocuments = (collectionName) => {
  return useQuery(["documents", collectionName], () =>
    getDocuments(collectionName)
  )
}

export { useDocuments }
