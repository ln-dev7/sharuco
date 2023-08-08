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

const getDocumentFromUser = async (userId, document) => {
  const querySnapshot = await getDocs(
    query(
      collection(db, document),
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

const useGetDocumentFromUser = (userId, document) => {
  return useQuery([`${document}-from-user`, document], () =>
    getDocumentFromUser(userId, document)
  )
}

export { useGetDocumentFromUser }
