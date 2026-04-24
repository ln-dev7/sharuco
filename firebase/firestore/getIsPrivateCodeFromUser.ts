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

const getIsPrivateCodeFromUser = async <T = DocumentData>(
  isPrivate: boolean,
  userId: string
): Promise<DocumentWithId<T>[]> => {
  const querySnapshot = await getDocs(
    query(
      collection(db, "codes"),
      where("isPrivate", "==", isPrivate),
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

const useGetIsPrivateCodeFromUser = <T = DocumentData>(
  isPrivate: boolean,
  userId: string
): UseQueryResult<DocumentWithId<T>[]> => {
  return useQuery<DocumentWithId<T>[]>(
    [`isprivate-code-from-user-${isPrivate}`, "codes"],
    () => getIsPrivateCodeFromUser<T>(isPrivate, userId)
  )
}

export { useGetIsPrivateCodeFromUser }
