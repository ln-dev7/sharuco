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

const getCodeFromUser = async (userId) => {
  const querySnapshot = await getDocs(
    query(
      collection(db, "codes"),
      where("idAuthor", "==", userId),
      orderBy("createdAt", "desc")
    )
  )
  const collections = querySnapshot.docs.map((doc) => {
    const data = doc.data()
    data.id = doc.id
    return data
  })
  return collections
}

const useGetCodeFromUser = (userId) => {
  return useQuery(["code-from-user", "codes"], () => getCodeFromUser(userId))
}

export { useGetCodeFromUser }
