import { doc, getFirestore, updateDoc } from "firebase/firestore"
import moment from "moment"
import { useMutation, useQueryClient } from "react-query"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

const updateDocument = async (docId, updatedData, collectionName) => {
  const docRef = doc(db, collectionName, docId)
  await updateDoc(docRef, updatedData)
}

const useUpdateDocument = (collectionName) => {
  const queryClient = useQueryClient()
  const mutation = useMutation(
    [`update-document-${moment().valueOf()}`],
    ({ docId, updatedData }) =>
      updateDocument(docId, updatedData, collectionName),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("isprivate-code-from-user-false")
        queryClient.invalidateQueries("isprivate-code-from-user-true")
        queryClient.invalidateQueries("favorites-codes")
        queryClient.invalidateQueries("isprivate-codes-true")
        queryClient.invalidateQueries("isprivate-codes-false")
        queryClient.invalidateQueries("document-users")
        queryClient.invalidateQueries("document-codes")
        queryClient.invalidateQueries("users")
        queryClient.invalidateQueries("codes")
        queryClient.invalidateQueries("documents")
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
