import { doc, getFirestore, updateDoc } from "firebase/firestore"
import { useMutation, useQueryClient } from "react-query"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

const updateUserDocument = async (params, collectionName) => {
  const { pseudo, updatedUserData } = params
  const docRef = await updateDoc(
    doc(db, collectionName, pseudo),
    updatedUserData
  )
  return docRef
}

const useUpdateUserDocument = (collectionName) => {
  const queryClient = useQueryClient()
  const mutation = useMutation(
    (params) => {
      updateUserDocument(params, collectionName)
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
    updateUserDocument: mutation.mutate,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  }
}

export { useUpdateUserDocument }
