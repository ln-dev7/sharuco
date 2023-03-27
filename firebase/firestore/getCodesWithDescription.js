import { collection, getDocs, getFirestore } from "firebase/firestore"
import { useQuery } from "react-query"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

const getCodesByDescription = async (searchTerm) => {
  const querySnapshot = await getDocs(collection(db, "codes"))
  const codes = querySnapshot.docs
    .filter((doc) => doc.data().description.includes(searchTerm))
    .map((doc) => {
      const data = doc.data()
      data.id = doc.id
      return data
    })
  return codes
}

const useGetCodesByDescription = (searchTerm) => {
  return useQuery([`code-description`, "codes"], () =>
    getCodesByDescription(searchTerm)
  )
}

export { useGetCodesByDescription }