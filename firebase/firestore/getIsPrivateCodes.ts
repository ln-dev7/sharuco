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

const getIsPrivateCodes = async <T = DocumentData>(
  isPrivate: boolean
): Promise<DocumentWithId<T>[]> => {
  const querySnapshot = await getDocs(
    query(
      collection(db, "codes"),
      where("isPrivate", "==", isPrivate),
      orderBy("createdAt", "desc")
    )
  )
  const collections = querySnapshot.docs.map((doc) => {
    const data = doc.data() as T
    return { ...data, id: doc.id }
  })
  return collections
}

const useGetIsPrivateCodes = <T = DocumentData>(
  isPrivate: boolean
): UseQueryResult<DocumentWithId<T>[]> => {
  return useQuery<DocumentWithId<T>[]>(
    [`isprivate-codes-${isPrivate}`, "codes"],
    () => getIsPrivateCodes<T>(isPrivate)
  )
}

export { useGetIsPrivateCodes }
