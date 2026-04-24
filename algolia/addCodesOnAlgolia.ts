import algoliasearch from "algoliasearch"
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore"

import firebase_app from "../firebase/config"

const db = getFirestore(firebase_app)
const ALGOLIA_INDEX_NAME = "codes"

interface AlgoliaCodeObject {
  objectID: string
  description?: string
  isPrivate?: boolean
  createdAt?: number
  tags?: string[]
  language?: string
  idAuthor?: string
}

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_KEY as string
)
const index = client.initIndex(ALGOLIA_INDEX_NAME)

const addCodesOnAlgolia = async (): Promise<void> => {
  const querySnapshot = await getDocs(
    query(
      collection(db, "codes"),
      where("isPrivate", "==", false),
      orderBy("createdAt", "desc")
    )
  )
  const documents = querySnapshot.docs.map((docSnap) => {
    const data = docSnap.data() as Omit<AlgoliaCodeObject, "objectID">
    return { ...data, id: docSnap.id }
  })

  const algoliaObjects: AlgoliaCodeObject[] = documents.map((code) => ({
    objectID: code.id,
    description: code.description,
    isPrivate: code.isPrivate,
    createdAt: code.createdAt,
    tags: code.tags,
    language: code.language,
    idAuthor: code.idAuthor,
  }))

  await index.saveObjects(algoliaObjects, {
    autoGenerateObjectIDIfNotExist: true,
  })
}

export { addCodesOnAlgolia }
