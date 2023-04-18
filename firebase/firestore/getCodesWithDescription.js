import { useState } from "react"
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

const db = getFirestore(firebase_app)

export const useGetCodesWithDescription = () => {
  const [isLoading, setIsLoading] = useState(false)

  const getCodesWithDescription = async (description, isPrivate) => {
    setIsLoading(true)
    try {
      const words = description.toLowerCase().split(" ")
      const querySnapshot = await getDocs(
        query(
          collection(db, "codes"),
          where("descriptionInArray", "array-contains-any", words),
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

  return { getCodesWithDescription, isLoading }
}
