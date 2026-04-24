import { deleteDoc, doc, getFirestore } from "firebase/firestore"
import moment from "moment"
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

const deleteDocument = async (
  documentId: string,
  collectionName: string
): Promise<void> => {
  await deleteDoc(doc(db, collectionName, documentId))
}

interface UseDeleteDocumentReturn {
  deleteDocument: (documentId: string) => void
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
}

const useDeleteDocument = (collectionName: string): UseDeleteDocumentReturn => {
  const queryClient = useQueryClient()
  const mutation = useMutation(
    [`delete-document-${moment().valueOf()}`],
    (documentId: string) => deleteDocument(documentId, collectionName),
    {
      onSuccess: () => {
        INVALIDATION_KEYS.forEach((key) => queryClient.invalidateQueries(key))
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
