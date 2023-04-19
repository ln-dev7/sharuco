import algoliasearch from "algoliasearch"
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where
} from "firebase/firestore"
import { useQuery } from "react-query"

import firebase_app from "../firebase/config.js"

const db = getFirestore(firebase_app)
const ALGOLIA_INDEX_NAME = "codes"

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_KEY
)
const index = client.initIndex(ALGOLIA_INDEX_NAME)

const addCodesOnAlgolia = async () => {
  const querySnapshot = await getDocs(
    query(
      collection(db, "codes"),
      where("isPrivate", "==", false),
      orderBy("createdAt", "desc")
    )
  )
  const documents = querySnapshot.docs.map((doc) => {
    const data = doc.data()
    data.id = doc.id
    return data
  })

  const algoliaObjects = documents.map((code) => {
    return {
      objectID: code.id,
      description: code.description,
      isPrivate: code.isPrivate,
      createdAt: code.createdAt,
      tags: code.tags,
      language: code.language,
      idAuthor: code.idAuthor,
    }
  })

  index.saveObjects(algoliaObjects, { autoGenerateObjectIDIfNotExist: true })
}

export { addCodesOnAlgolia }
