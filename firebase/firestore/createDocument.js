import { addDoc, collection, getFirestore } from "firebase/firestore"
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
  const queryClient = useQueryClient()
  const mutation = useMutation(
    [`create-document-${moment().valueOf()}`],
    (newData) => createDocument(newData, collectionName),
    {
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries("isprivate-code-from-user-false")
        queryClient.invalidateQueries("isprivate-code-from-user-true")
        queryClient.invalidateQueries("code-from-user")
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
    createDocument: mutation.mutate,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  }
}

export { useCreateDocument }
