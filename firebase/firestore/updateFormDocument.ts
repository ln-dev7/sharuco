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

interface UpdateFormParams {
  id: string
  updatedFormData: UpdateData<Record<string, unknown>>
}

const updateFormDocument = async (
  params: UpdateFormParams,
  collectionName: string
): Promise<void> => {
  const { id, updatedFormData } = params
  await updateDoc(doc(db, collectionName, id), updatedFormData)
}

interface UseUpdateFormDocumentReturn {
  updateFormDocument: (params: UpdateFormParams) => void
  isLoading: boolean
  isError: boolean
  error: unknown
  isSuccess: boolean
  reset: () => void
}

const useUpdateFormDocument = (
  collectionName: string
): UseUpdateFormDocumentReturn => {
  const queryClient = useQueryClient()
  const mutation = useMutation(
    (params: UpdateFormParams) => updateFormDocument(params, collectionName),
    {
      onSuccess: () => {
        INVALIDATION_KEYS.forEach((key) => queryClient.invalidateQueries(key))
      },
    }
  )

  return {
    updateFormDocument: mutation.mutate,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  }
}

export { useUpdateFormDocument }
