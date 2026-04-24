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

const getFavoriteCode = async <T = DocumentData>(
  userId: string
): Promise<DocumentWithId<T>[]> => {
  const querySnapshot = await getDocs(
    query(
      collection(db, "codes"),
      where("favoris", "array-contains", userId),
      orderBy("createdAt", "desc")
    )
  )
  const collections = querySnapshot.docs.map((doc) => {
    const data = doc.data() as T
    return { ...data, id: doc.id }
  })
  return collections
}

const useGetFavoriteCode = <T = DocumentData>(
  userId: string | null | undefined
): UseQueryResult<DocumentWithId<T>[]> => {
  return useQuery<DocumentWithId<T>[]>(
    ["favorites-codes", "codes", userId],
    () => getFavoriteCode<T>(userId as string),
    { enabled: Boolean(userId) }
  )
}

export { useGetFavoriteCode }
