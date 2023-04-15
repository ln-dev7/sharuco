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

const getIsPrivateCodes = async (isPrivate) => {
  const querySnapshot = await getDocs(
    query(
      collection(db, "codes"),
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
}

const useGetIsPrivateCodes = (isPrivate) => {
  return useQuery([`isprivate-codes-${isPrivate}`, "codes"], () =>
    getIsPrivateCodes(isPrivate)
  )
}

export { useGetIsPrivateCodes }
