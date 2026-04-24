import {
  doc,
  getDoc,
  getFirestore,
  type DocumentData,
} from "firebase/firestore"
import { useQuery, type UseQueryResult } from "react-query"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

export interface DocumentResult<T = DocumentData> {
  data: T | undefined
  exists: boolean
}

export const getDocument = async <T = DocumentData>(
  documentId: string,
  collectionName: string
): Promise<DocumentResult<T>> => {
  const docRef = doc(db, collectionName, documentId)
  const result = await getDoc(docRef)
  const exists = result.exists()
  return { data: result.data() as T | undefined, exists }
}

export const useDocument = <T = DocumentData>(
  documentId: string | null | undefined,
  collectionName: string
): UseQueryResult<DocumentResult<T>> => {
  return useQuery<DocumentResult<T>>(
    [`document-${collectionName}`, documentId],
    () => getDocument<T>(documentId as string, collectionName),
    { enabled: Boolean(documentId) }
  )
}
