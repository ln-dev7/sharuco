import { doc, getFirestore, updateDoc } from "firebase/firestore"
import { useMutation, useQueryClient } from "react-query"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

const updateFormDocument = async (params, collectionName) => {
  const { id, updatedFormData } = params
  const docRef = await updateDoc(doc(db, collectionName, id), updatedFormData)
  return docRef
}

const useUpdateFormDocument = (collectionName) => {
  const queryClient = useQueryClient()
  const mutation = useMutation(
    (params) => {
      return updateFormDocument(params, collectionName)
    },
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
    updateFormDocument: mutation.mutate,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  }
}

export { useUpdateFormDocument }
