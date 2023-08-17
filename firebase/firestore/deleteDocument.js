import { deleteDoc, doc, getFirestore } from "firebase/firestore"
import moment from "moment"
import { useMutation, useQueryClient } from "react-query"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

const deleteDocument = async (documentId, collectionName) => {
  await deleteDoc(doc(db, collectionName, documentId))
}

const useDeleteDocument = (collectionName) => {
  const queryClient = useQueryClient()
  const mutation = useMutation(
    [`delete-document-${moment().valueOf()}`],
    (documentId) => deleteDocument(documentId, collectionName),
    {
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries("isprivate-code-from-user-false")
        queryClient.invalidateQueries("isprivate-code-from-user-true")
        queryClient.invalidateQueries("codes-from-user")
        queryClient.invalidateQueries("links-from-user")
        queryClient.invalidateQueries("forms-from-user")
        queryClient.invalidateQueries("favorites-codes")
        queryClient.invalidateQueries("isprivate-codes-true")
        queryClient.invalidateQueries("isprivate-codes-false")
        queryClient.invalidateQueries("document-users")
        queryClient.invalidateQueries("document-codes")
        queryClient.invalidateQueries("users")
        queryClient.invalidateQueries("codes")
        queryClient.invalidateQueries("documents-codes")
        queryClient.invalidateQueries("documents-users")
        queryClient.invalidateQueries("popular-codes")
      },
    }
  )

  return {
    deleteDocument: mutation.mutate,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  }
}

export { useDeleteDocument }
