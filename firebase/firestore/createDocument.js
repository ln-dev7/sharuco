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

import { addDoc, collection, getFirestore, setDoc } from "firebase/firestore"
import moment from "moment"
import { useMutation, useQueryClient } from "react-query"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

const createDocument = async (newData, collectionName) => {
  const docRef = await addDoc(collection(db, collectionName), newData)
  const newCollection = {
    ...newData,
    id: docRef.id,
  }
  return newCollection
}

const useCreateDocument = (collectionName) => {
  const mutation = useMutation(
    [`create-document-${moment().valueOf()}`],
    (newData) => createDocument(newData, collectionName)
  )

  return {
    createDocument: mutation.mutate,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  }
}

export { useCreateDocument }
