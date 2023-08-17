import algoliasearch from "algoliasearch"
import { addDoc, collection, getFirestore } from "firebase/firestore"
import moment from "moment"
import { useMutation, useQueryClient } from "react-query"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

const createDocument = async (newData, collectionName) => {
  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_KEY
  )
  const index = client.initIndex(collectionName)

  const docRef = await addDoc(collection(db, collectionName), newData)
  const newCollection = {
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
      })
      break
    default:
      break
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
        queryClient.invalidateQueries("codes-from-user")
        queryClient.invalidateQueries("links-from-user")
        queryClient.invalidateQueries("forms-from-user")
        queryClient.invalidateQueries("favorites-codes")
        queryClient.invalidateQueries("isprivate-codes-true")
        queryClient.invalidateQueries("isprivate-codes-false")
        queryClient.invalidateQueries("document-users")
        queryClient.invalidateQueries("document-codes")
        queryClient.invalidateQueries("document-links")
        queryClient.invalidateQueries("document-forms")
        queryClient.invalidateQueries("users")
        queryClient.invalidateQueries("codes")
        queryClient.invalidateQueries("links")
        queryClient.invalidateQueries("forms")
        queryClient.invalidateQueries("documents-codes")
        queryClient.invalidateQueries("documents-users")
        queryClient.invalidateQueries("documents-links")
        queryClient.invalidateQueries("documents-forms")
        queryClient.invalidateQueries("popular-codes")
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
