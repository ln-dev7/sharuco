import { deleteDoc, doc, getFirestore } from "firebase/firestore"
import moment from "moment"
import { useMutation } from "react-query"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

const deleteDocument = async (documentId, collectionName) => {
  await deleteDoc(doc(db, collectionName, documentId))
}

const useDeleteDocument = (collectionName) => {
  const mutation = useMutation(
    [`delete-document-${moment().valueOf()}`],
    (documentId) => deleteDocument(documentId, collectionName)
  )

  return {
    deleteDocument: mutation.mutate,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  }
}

export { useDeleteDocument }
