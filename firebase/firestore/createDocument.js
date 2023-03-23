// import { Document, doc, getFirestore, setDoc } from "firebase/firestore"

// import firebase_app from "../config"

// const db = getFirestore(firebase_app)

// export default async function createDocument(DocumentName, data) {
//   let result = null
//   let error = null

//   try {
//     const DocumentRef = Document(db, DocumentName)
//     await setDoc(doc(DocumentRef), data, { merge: true })
//     result = "Document updated successfully"
//   } catch (e) {
//     if (e.code === "not-found") {
//       try {
//         await setDoc(doc(db, DocumentName), data)
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

import { collection, addDoc, getFirestore, setDoc } from "firebase/firestore"
import { useMutation, useQueryClient } from "react-query"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

const useCreateDocument = (collectionName, newData) => {
  const createDocument = async (newData) => {
    const docRef = await addDoc(collection(db, collectionName), newData)
    const newCollection = {
      ...newData,
      id: docRef.id,
    }
    return newCollection
  }

  return useMutation(() => createDocument(newData), {
    onSuccess: () => {
      queryCache.invalidateQueries(["collections", collectionName])
    },
  })
}

export { useCreateDocument }
