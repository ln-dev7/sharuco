import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
  type DocumentData,
} from "firebase/firestore"
import { useQuery, type UseQueryResult } from "react-query"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

export type DocumentWithId<T = DocumentData> = T & { id: string }

const getDocumentFromUser = async <T = DocumentData>(
  userId: string,
  document: string
): Promise<DocumentWithId<T>[]> => {
  const querySnapshot = await getDocs(
    query(
      collection(db, document),
      where("idAuthor", "==", userId),
      orderBy("createdAt", "desc")
    )
  )
  const collections = querySnapshot.docs.map((doc) => {
    const data = doc.data() as T
    return { ...data, id: doc.id }
  })
  return collections
}

const useGetDocumentFromUser = <T = DocumentData>(
  userId: string,
  document: string
): UseQueryResult<DocumentWithId<T>[]> => {
  return useQuery<DocumentWithId<T>[]>(
    [`${document}-from-user`, document],
    () => getDocumentFromUser<T>(userId, document)
  )
}

export { useGetDocumentFromUser }
