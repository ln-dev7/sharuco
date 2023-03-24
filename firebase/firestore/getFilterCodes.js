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

const useGetCodesByDescriptionAndLanguage = (searchTerm, language) => {
  return Promise.all([
    useQuery([`code-description-${searchTerm}`, "codes"], () =>
      getCodesByDescription(searchTerm)
    ),
    useQuery([`code-language-${language}`, "codes"], () =>
      getCodesWithLanguage(language)
    ),
  ]).then(([codesByDescription, codesWithLanguage]) => {
    // Merge the results and remove duplicates
    const codes = [
      ...new Map(
        [...codesByDescription, ...codesWithLanguage].map((item) => [
          item.id,
          item,
        ])
      ).values(),
    ]
    return codes
  })
}

export { useGetCodesByDescriptionAndLanguage }

// import { useState } from "react";
// import { useGetCodesByDescriptionAndLanguage } from "./useGetCodesByDescriptionAndLanguage";

// function MyComponent() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [language, setLanguage] = useState("");

//   const handleSearchTermChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const handleLanguageChange = (event) => {
//     setLanguage(event.target.value);
//   };

//   const codes = useGetCodesByDescriptionAndLanguage(searchTerm, language);

//   return (
//     <div>
//       <input type="text" value={searchTerm} onChange={handleSearchTermChange} />
//       <input type="text" value={language} onChange={handleLanguageChange} />
//       <ul>
//         {codes.map((code) => (
//           <li key={code.id}>
//             {code.id}: {code.description}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
