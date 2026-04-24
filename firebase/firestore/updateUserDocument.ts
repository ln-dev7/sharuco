import {
  doc,
  getFirestore,
  updateDoc,
  type UpdateData,
} from "firebase/firestore"
import { useMutation, useQueryClient } from "react-query"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

const INVALIDATION_KEYS = [
  "isprivate-code-from-user-false",
  "isprivate-code-from-user-true",
  "codes-from-user",
  "links-from-user",
  "forms-from-user",
  "favorites-codes",
  "isprivate-codes-true",
  "isprivate-codes-false",
  "document-users",
  "document-codes",
  "document-links",
  "document-forms",
  "users",
  "codes",
  "links",
  "forms",
  "documents-codes",
  "documents-users",
  "documents-links",
  "documents-forms",
  "popular-codes",
] as const

interface UpdateUserParams {
  pseudo: string
  updatedUserData: UpdateData<Record<string, unknown>>
}

const updateUserDocument = async (
  params: UpdateUserParams,
  collectionName: string
): Promise<void> => {
  const { pseudo, updatedUserData } = params
  await updateDoc(doc(db, collectionName, pseudo), updatedUserData)
}

interface UseUpdateUserDocumentReturn {
  updateUserDocument: (params: UpdateUserParams) => void
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
}

const useUpdateUserDocument = (
  collectionName: string
): UseUpdateUserDocumentReturn => {
  const queryClient = useQueryClient()
  const mutation = useMutation(
    async (params: UpdateUserParams) => {
      await updateUserDocument(params, collectionName)
    },
    {
      onSuccess: () => {
        INVALIDATION_KEYS.forEach((key) => queryClient.invalidateQueries(key))
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
