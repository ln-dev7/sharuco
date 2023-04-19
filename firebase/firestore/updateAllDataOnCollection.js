import {
  collection,
  deleteField,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

export const uupdateAllDatataOnCollection = async () => {
  const querySnapshot = await getDocs(collection(db, "codes"))
  const promises = []
  querySnapshot.docs.forEach((doc) => {
    const data = doc.data()
    const favorisCount = data.favoris ? data.favoris.length : 0
    const updatePromise = updateDoc(doc.ref, { favorisCount })
    promises.push(updatePromise)
  })
  await Promise.all(promises)
  console.log(
    "La propriété a été ajoutée à tous les documents de la collection"
  )
}

export const removeAllDataOnCollection = async () => {
  const querySnapshot = await getDocs(collection(db, "codes"))
  const promises = []
  querySnapshot.docs.forEach((doc) => {
    const updatePromise = updateDoc(doc.ref, {
      descriptionInArray: deleteField(),
    })
    promises.push(updatePromise)
  })
  await Promise.all(promises)
  console.log("La propriété a été supprimée de tous les documents")
}
