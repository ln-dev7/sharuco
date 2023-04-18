import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore"
import { useQuery } from "react-query"

import firebase_app from "../config"
import { useState } from "react"

const db = getFirestore(firebase_app)

export const useGetCodesWithLanguage = () => {
  const [isLoading, setIsLoading] = useState(false)

  const getCodesWithLanguage = async (language, isPrivate) => {
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
        const data = doc.data()
        data.id = doc.id
        return data
      })
      return collections
    } catch (e) {
    } finally {
      setIsLoading(false)
    }
  }

  return { getCodesWithLanguage, isLoading }
}
