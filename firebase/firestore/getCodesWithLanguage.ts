import { useState } from "react"
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
  type DocumentData,
} from "firebase/firestore"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

export type DocumentWithId<T = DocumentData> = T & { id: string }

interface UseGetCodesWithLanguageReturn<T> {
  getCodesWithLanguage: (
    language: string,
    isPrivate: boolean
  ) => Promise<DocumentWithId<T>[] | undefined>
  isLoading: boolean
}

export const useGetCodesWithLanguage = <
  T = DocumentData,
>(): UseGetCodesWithLanguageReturn<T> => {
  const [isLoading, setIsLoading] = useState(false)

  const getCodesWithLanguage = async (
    language: string,
    isPrivate: boolean
  ): Promise<DocumentWithId<T>[] | undefined> => {
    setIsLoading(true)
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, "codes"),
          where("language", "==", language),
          where("isPrivate", "==", isPrivate),
          orderBy("createdAt", "desc")
        )
      )
      const collections = querySnapshot.docs.map((doc) => {
        const data = doc.data() as T
        return { ...data, id: doc.id }
      })
      return collections
    } catch {
      return undefined
    } finally {
      setIsLoading(false)
    }
  }

  return { getCodesWithLanguage, isLoading }
}
