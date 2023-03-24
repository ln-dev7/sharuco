import {
  collection,
  doc,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"
import moment from "moment"
import { useMutation, useQueryClient } from "react-query"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

const updateDocument = async (updatedData, documentId, collectionName) => {
  const docRef = doc(collection(db, collectionName), documentId)
  await updateDoc(docRef, updatedData)
  const updatedCollection = {
    ...updatedData,
    id: documentId,
  }
  return updatedCollection
}

const useUpdateDocument = (collectionName) => {
  const queryClient = useQueryClient()
  const mutation = useMutation(
    [`update-document-${moment().valueOf()}`],
    (updatedData, documentId) =>
      updateDocument(updatedData, documentId, collectionName),
    {
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries("isprivate-code-from-user-false")
        queryClient.invalidateQueries("isprivate-code-from-user-true")
        queryClient.invalidateQueries("favorites-codes")
        queryClient.invalidateQueries("users")
      },
    }
  )

  return {
    updateDocument: mutation.mutate,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  }
}

export { useUpdateDocument }
