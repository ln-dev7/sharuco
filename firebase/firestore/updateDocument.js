// import { collection, doc, getFirestore, setDoc } from "firebase/firestore"

// import firebase_app from "../config"

// const db = getFirestore(firebase_app)

// export default async function updateCollection(collectionName, documentId, data) {
//   let result = null
//   let error = null

//   try {
//     const documentRef = doc(collection(db, collectionName), documentId)
//     await setDoc(documentRef, data, { merge: true })
//     result = "Document updated successfully"
//   } catch (e) {
//     if (e.code === "not-found") {
//       try {
//         const documentRef = doc(db, `${collectionName}/${documentId}`)
//         await setDoc(documentRef, data)
//         result = "Document created and updated successfully"
//       } catch (e) {
//         error = e
//       }
//     } else {
//       error = e
//     }
//   }

//   return { result, error }
// }

import {
  collection,
  doc,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore"
import { useMutation } from "react-query"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

const updateDocumentWithQuery = async ({
  collectionName,
  documentId,
  data,
}) => {
  try {
    const documentRef = doc(collection(db, collectionName), documentId)
    await setDoc(documentRef, data, { merge: true })
    return "Document updated successfully"
  } catch (error) {
    try {
      const documentQuery = query(
        collection(db, collectionName),
        where("id", "==", documentId)
      )
      const querySnapshot = await getDocs(documentQuery)
      if (querySnapshot.empty) {
        const documentRef = doc(db, `${collectionName}/${documentId}`)
        await setDoc(documentRef, data)
        return "Document created and updated successfully"
      } else {
        const documentRef = doc(collection(db, collectionName), documentId)
        await setDoc(documentRef, data, { merge: true })
        return "Document updated successfully"
      }
    } catch (error) {
      throw error
    }
  }
}

const useUpdateDoocument = () => {
  return useMutation(updateDocumentWithQuery)
}

export { useUpdateDoocument }
