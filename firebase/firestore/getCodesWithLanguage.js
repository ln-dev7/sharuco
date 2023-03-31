import { collection, getFirestore, query, where } from "firebase/firestore"
import { useQuery } from "react-query"
import firebase_app from "../config"

const db = getFirestore(firebase_app)

const useGetCodesWithLanguage = (language) => {
  const searchKey = language ? language.trim().toLowerCase() : ""

  const { isLoading, isError, data: documents = [] } = useQuery(
    ["search-documents-by-language", searchKey],
    async () => {
      if (!searchKey) return []

      const q = query(collection(db, "documents"), where("language", "==", searchKey))
      const snapshot = await q.get()

      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    }
  )

  return {
    documents,
    isLoading,
    isError,
  }
}

export { useGetCodesWithLanguage }

