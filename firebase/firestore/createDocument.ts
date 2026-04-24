import algoliasearch from "algoliasearch"
import {
  addDoc,
  collection,
  getFirestore,
  type DocumentData,
} from "firebase/firestore"
import moment from "moment"
import { useMutation, useQueryClient } from "react-query"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

type NewDocumentData = DocumentData & { [key: string]: unknown }

export type CreatedDocument<T = NewDocumentData> = T & { id: string }

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

const createDocument = async (
  newData: NewDocumentData,
  collectionName: string
): Promise<CreatedDocument> => {
  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
    process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_KEY as string
  )
  const index = client.initIndex(collectionName)

  const docRef = await addDoc(collection(db, collectionName), newData)
  const newCollection: CreatedDocument = {
    ...newData,
    id: docRef.id,
  }

  switch (collectionName) {
    case "codes":
      await index.saveObject({
        objectID: newCollection.id,
        description: newCollection.description,
        isPrivate: newCollection.isPrivate,
        createdAt: newCollection.createdAt,
        tags: newCollection.tags,
        language: newCollection.language,
        idAuthor: newCollection.idAuthor,
      })
      break
    case "links":
      index.saveObject({
        objectID: newCollection.id,
        link: newCollection.link,
        description: newCollection.description,
        createdAt: newCollection.createdAt,
        tags: newCollection.tags,
        idAuthor: newCollection.idAuthor,
      })
      break
    case "forms":
      index.saveObject({
        objectID: newCollection.id,
        name: newCollection.name,
        description: newCollection.description,
        color: newCollection.color,
        createdAt: newCollection.createdAt,
        questions: newCollection.questions,
        responses: newCollection.responses,
        published: newCollection.published,
        idAuthor: newCollection.idAuthor,
        collaborators: newCollection.collaborators,
      })
      window.location.href = `/form/${newCollection.id}`
      break
    default:
      break
  }

  return newCollection
}

interface UseCreateDocumentReturn {
  createDocument: (newData: NewDocumentData) => void
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
}

const useCreateDocument = (collectionName: string): UseCreateDocumentReturn => {
  const queryClient = useQueryClient()
  const mutation = useMutation(
    [`create-document-${moment().valueOf()}`],
    (newData: NewDocumentData) => createDocument(newData, collectionName),
    {
      onSuccess: () => {
        INVALIDATION_KEYS.forEach((key) => queryClient.invalidateQueries(key))
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
