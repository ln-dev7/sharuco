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

const getIsPrivateCodes = async (isPrivate) => {
  const querySnapshot = await getDocs(
    query(collection(db, "codes"), where("isPrivate", "==", isPrivate))
  )
  const collections = querySnapshot.docs.map((doc) => doc.data())
  return collections
}

const useGetIsPrivateCodes = (isPrivate) => {
  return useQuery(["codes", "users"], () => getIsPrivateCodes(isPrivate))
}

export { useGetIsPrivateCodes }
