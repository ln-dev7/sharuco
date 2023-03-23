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

const getFavoriteCode = async (userId) => {
  const querySnapshot = await getDocs(
    query(collection(db, "codes"), where("favoris", "array-contains", userId))
  )
  const collections = querySnapshot.docs.map((doc) => {
    const data = doc.data()
    data.id = doc.id
    return data
  })
  return collections
}

const useGetFavoriteCode = (userId) => {
  return useQuery(["favorites-codes", "codes"], () => getFavoriteCode(userId))
}

export { useGetFavoriteCode }
