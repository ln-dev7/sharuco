import { doc, getFirestore, updateDoc } from "firebase/firestore"
import { useMutation, useQueryClient } from "react-query"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

const updateCodeDocument = async (params, collectionName) => {
  const { id, updatedCodeData } = params
  const docRef = await updateDoc(doc(db, collectionName, id), updatedCodeData)
  return docRef
}

const useUpdateCodeDocument = (collectionName) => {
  const queryClient = useQueryClient()
  const mutation = useMutation(
    (params) => {
      updateCodeDocument(params, collectionName)
    },
    {
      onSuccess: async (data) => {
        queryClient.setQueryData("documents", (oldData) => {
          return {
            ...oldData,
            ...data,
          }
        })
        queryClient.setQueryData("isprivate-codes-false", (oldData) => {
          return {
            ...oldData,
            ...data,
          }
        })
        queryClient.setQueryData("isprivate-codes-true", (oldData) => {
          return {
            ...oldData,
            ...data,
          }
        })
        queryClient.setQueryData("favorites-codes", (oldData) => {
          return {
            ...oldData,
            ...data,
          }
        })
        queryClient.setQueryData("document-codes", (oldData) => {
          return {
            ...oldData,
            ...data,
          }
        })
        queryClient.setQueryData("document-users", (oldData) => {
          return {
            ...oldData,
            ...data,
          }
        })
        queryClient.setQueryData("users", (oldData) => {
          return {
            ...oldData,
            ...data,
          }
        })
        queryClient.setQueryData("codes", (oldData) => {
          return {
            ...oldData,
            ...data,
          }
        })
        queryClient.setQueryData("isprivate-code-from-user-true", (oldData) => {
          return {
            ...oldData,
            ...data,
          }
        })
        queryClient.setQueryData(
          "isprivate-code-from-user-false",
          (oldData) => {
            return {
              ...oldData,
              ...data,
            }
          }
        )
      },
    }
  )

  return {
    updateCodeDocument: mutation.mutate,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  }
}

export { useUpdateCodeDocument }
