import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
  type DocumentData,
} from "firebase/firestore"
import { useQuery, type UseQueryResult } from "react-query"

import { NBR_OF_POPULAR_CODES } from "../../constants/nbr-codes"
import firebase_app from "../config"

const db = getFirestore(firebase_app)

export type DocumentWithId<T = DocumentData> = T & { id: string }

const getPopularCodes = async <T = DocumentData>(): Promise<
  DocumentWithId<T>[]
> => {
  const querySnapshot = await getDocs(
    query(
      collection(db, "codes"),
      where("isPrivate", "==", false),
      orderBy("favorisCount", "desc"),
      limit(NBR_OF_POPULAR_CODES)
    )
  )
  const collections = querySnapshot.docs.map((doc) => {
    const data = doc.data() as T
    return { ...data, id: doc.id }
  })
  return collections
}

const useGetPopularCodes = <T = DocumentData>(): UseQueryResult<
  DocumentWithId<T>[]
> => {
  return useQuery<DocumentWithId<T>[]>(["popular-codes", "codes"], () =>
    getPopularCodes<T>()
  )
}

export { useGetPopularCodes }
