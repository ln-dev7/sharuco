import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore"
import { useQuery } from "react-query"

import { NBR_OF_POPULAR_CODES } from "../../constants/nbr-codes"
import firebase_app from "../config"

const db = getFirestore(firebase_app)

const getPopularCodes = async () => {
  const querySnapshot = await getDocs(
    query(
      collection(db, "codes"),
      where("isPrivate", "==", false),
      orderBy("favorisCount", "desc"),
      limit(NBR_OF_POPULAR_CODES)
    )
  )
  const collections = querySnapshot.docs.map((doc) => {
    const data = doc.data()
    data.id = doc.id
    return data
  })
  return collections
}

const useGetPopularCodes = () => {
  return useQuery([`popular-codes`, "codes"], () => getPopularCodes())
}

export { useGetPopularCodes }
