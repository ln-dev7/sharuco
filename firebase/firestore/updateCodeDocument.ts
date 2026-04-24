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

interface UpdateCodeParams {
  id: string
  updatedCodeData: UpdateData<Record<string, unknown>>
}

const updateCodeDocument = async (
  params: UpdateCodeParams,
  collectionName: string
): Promise<void> => {
  const { id, updatedCodeData } = params
  await updateDoc(doc(db, collectionName, id), updatedCodeData)
}

interface UseUpdateCodeDocumentReturn {
  updateCodeDocument: (params: UpdateCodeParams) => void
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
}

const useUpdateCodeDocument = (
  collectionName: string
): UseUpdateCodeDocumentReturn => {
  const queryClient = useQueryClient()
  const mutation = useMutation(
    (params: UpdateCodeParams) => updateCodeDocument(params, collectionName),
    {
      onSuccess: () => {
        INVALIDATION_KEYS.forEach((key) => queryClient.invalidateQueries(key))
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
