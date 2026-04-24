import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  type DocumentData,
} from "firebase/firestore"
import { useQuery, type UseQueryResult } from "react-query"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

export type DocumentWithId<T = DocumentData> = T & { id: string }

const getDocuments = async <T = DocumentData>(
  collectionName: string
): Promise<DocumentWithId<T>[]> => {
  const querySnapshot = await getDocs(
    query(collection(db, collectionName), orderBy("createdAt", "desc"))
  )
  const documents = querySnapshot.docs.map((doc) => {
    const data = doc.data() as T
    return { ...data, id: doc.id }
  })
  return documents
}

const useDocuments = <T = DocumentData>(
  collectionName: string
): UseQueryResult<DocumentWithId<T>[]> => {
  return useQuery<DocumentWithId<T>[]>(
    [`documents-${collectionName}`, collectionName],
    () => getDocuments<T>(collectionName)
  )
}

export { useDocuments }
