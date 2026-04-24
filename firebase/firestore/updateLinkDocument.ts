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

interface UpdateLinkParams {
  id: string
  updatedLinkData: UpdateData<Record<string, unknown>>
}

const updateLinkDocument = async (
  params: UpdateLinkParams,
  collectionName: string
): Promise<void> => {
  const { id, updatedLinkData } = params
  await updateDoc(doc(db, collectionName, id), updatedLinkData)
}

interface UseUpdateLinkDocumentReturn {
  updateLinkDocument: (params: UpdateLinkParams) => void
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
}

const useUpdateLinkDocument = (
  collectionName: string
): UseUpdateLinkDocumentReturn => {
  const queryClient = useQueryClient()
  const mutation = useMutation(
    (params: UpdateLinkParams) => updateLinkDocument(params, collectionName),
    {
      onSuccess: () => {
        INVALIDATION_KEYS.forEach((key) => queryClient.invalidateQueries(key))
      },
    }
  )

  return {
    updateLinkDocument: mutation.mutate,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  }
}

export { useUpdateLinkDocument }
