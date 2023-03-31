import { collection, getDocs, getFirestore, query, where } from "firebase/firestore"
import { useQuery } from "react-query"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

const searchDocumentsByDescription = async (description) => {
  const q = query(
    collection(db, "codes"),
    where("description", "==", description)
  )
  const querySnapshot = await getDocs(q)
  const codes = []
  querySnapshot.forEach((doc) => {
    codes.push({ ...doc.data() })
  })
  return codes
}

const useGetCodesByDescription = (description) => {
  const { data, isLoading, isError } = useQuery(
    ["search-codes-by-description", description],
    () => searchDocumentsByDescription(description)
  )

  return {
    codes: data,
    isLoading,
    isError,
  }
}

export { useGetCodesByDescription }
