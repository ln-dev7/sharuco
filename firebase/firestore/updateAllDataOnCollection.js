import {
  collection,
  getDocs,
  getFirestore,
  updateDoc
} from "firebase/firestore"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

// Example of a query with a where clause
export const addFavorisCountToCodes = async () => {
  const querySnapshot = await getDocs(collection(db, "codes"))
  const promises = []
  querySnapshot.docs.forEach((doc) => {
    const data = doc.data()
    const favorisCount = data.favoris ? data.favoris.length : 0
    //const descriptionInArray = data.description.toLowerCase().split(" ")
    const updatePromise = updateDoc(doc.ref, { favorisCount })
    promises.push(updatePromise)
  })
  await Promise.all(promises)
  console.log(
    "Tous les documents ont été mis à jour avec la propriété favorisCount"
  )
}
