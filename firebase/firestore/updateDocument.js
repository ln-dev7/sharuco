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
      onSuccess: (code) => {
        queryClient.setQueriesData("isprivate-code-from-user-false", (old) => {
          return old.filter((c) => c.id !== code.id)
        })
        queryClient.setQueriesData("isprivate-code-from-user-true", (old) => {
          return old.filter((c) => c.id !== code.id)
        })
        queryClient.setQueriesData("favorites-codes", (old) => {
          return old.filter((c) => c.id !== code.id)
        })
        queryClient.setQueriesData("isprivate-codes-true", (old) => {
          return old.filter((c) => c.id !== code.id)
        })
        queryClient.setQueriesData("isprivate-codes-false", (old) => {
          return old.filter((c) => c.id !== code.id)
        })
        queryClient.setQueriesData("document-users", (old) => {
          return old.filter((c) => c.id !== code.id)
        })
        queryClient.setQueriesData("document-codes", (old) => {
          return old.filter((c) => c.id !== code.id)
        })
        queryClient.setQueriesData("codes", (old) => {
          return old.filter((c) => c.id !== code.id)
        })
        queryClient.setQueriesData("documents", (old) => {
          return old.filter((c) => c.id !== code.id)
        })
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
