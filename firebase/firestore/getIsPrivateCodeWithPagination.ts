import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore"
import { useQuery, type UseQueryResult } from "react-query"

import { NBR_OF_CODES_PER_PAGE } from "@/constants/nbr-codes"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

export type DocumentWithId<T = DocumentData> = T & { id: string }

export interface PaginatedResult<T = DocumentData> {
  collections: DocumentWithId<T>[]
  lastDoc: QueryDocumentSnapshot<DocumentData> | undefined
}

const getIsPrivateCodeWithPagination = async <T = DocumentData>(
  isPrivate: boolean,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<PaginatedResult<T>> => {
  let codesQuery = query(
    collection(db, "codes"),
    where("isPrivate", "==", isPrivate),
    orderBy("createdAt", "desc"),
    limit(NBR_OF_CODES_PER_PAGE)
  )

  if (lastDoc) {
    codesQuery = query(
      collection(db, "codes"),
      where("isPrivate", "==", isPrivate),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(NBR_OF_CODES_PER_PAGE)
    )
  }

  const querySnapshot = await getDocs(codesQuery)

  const collections = querySnapshot.docs.map((doc) => {
    const data = doc.data() as T
    return { ...data, id: doc.id }
  })

  return {
    collections,
    lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
  }
}

const useGetIsPrivateCodeWithPagination = <T = DocumentData>(
  isPrivate: boolean
): UseQueryResult<PaginatedResult<T>> => {
  return useQuery<PaginatedResult<T>>(
    [`isprivate-codes-${isPrivate}`],
    async () => {
      const { collections, lastDoc } =
        await getIsPrivateCodeWithPagination<T>(isPrivate)
      return { collections, lastDoc }
    }
  )
}

export { useGetIsPrivateCodeWithPagination, getIsPrivateCodeWithPagination }
