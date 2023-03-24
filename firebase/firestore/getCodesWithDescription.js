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

const getCodesByDescription = async (searchTerm) => {
  const querySnapshot = await getDocs(
    query(
      collection(db, "codes"),
      where("description", "array-contains", searchTerm)
    )
  )
  const codes = querySnapshot.docs.map((doc) => {
    const data = doc.data()
    data.id = doc.id
    return data
  })
  return codes
}

const useGetCodesByDescription = (searchTerm) => {
  return useQuery([`code-description-${searchTerm}`, "codes"], () =>
    getCodesByDescription(searchTerm)
  )
}

export { useGetCodesByDescription }

// import React, { useState } from "react"
// import { useGetCodesByDescription } from "./votreFichier"

// const CodeSearch = () => {
//   const [searchTerm, setSearchTerm] = useState("")
//   const { data: codes, isLoading } = useGetCodesByDescription(searchTerm)

//   const handleSearchTermChange = (event) => {
//     const newSearchTerm = event.target.value
//     setSearchTerm(newSearchTerm)
//   }

//   const delayedSearch = useCallback(
//     debounce((newSearchTerm) => {
//       setSearchTerm(newSearchTerm)
//     }, 1000),
//     []
//   )

//   const handleDelayedSearch = (event) => {
//     const newSearchTerm = event.target.value
//     delayedSearch(newSearchTerm)
//   }

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Search by description..."
//         onChange={handleDelayedSearch}
//       />
//       {isLoading ? (
//         <div>Loading...</div>
//       ) : (
//         <ul>
//           {codes.map((code) => (
//             <li key={code.id}>{code.description}</li>
//           ))}
//         </ul>
//       )}
//     </div>
//   )
// }

// export default CodeSearch
