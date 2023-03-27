import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore"
import { useQuery } from "react-query"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

const getCodesWithLanguage = async (language) => {
  const querySnapshot = await getDocs(
    query(collection(db, "codes"), where("language", "==", language))
  )
  const codes = querySnapshot.docs.map((doc) => {
    const data = doc.data()
    data.id = doc.id
    return data
  })
  return codes
}

const useGetCodesWithLanguage = (searchTerm) => {
  return useQuery([`code-description`, "codes"], () =>
    getCodesWithLanguage(searchTerm)
  )
}

export { useGetCodesWithLanguage }
