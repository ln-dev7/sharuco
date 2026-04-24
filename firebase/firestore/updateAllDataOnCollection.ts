import {
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore"

import firebase_app from "../config"

const db = getFirestore(firebase_app)

export const updateAllDatataOnCollection = async (): Promise<void> => {
  const querySnapshot = await getDocs(collection(db, "codes"))
  const promises: Promise<void>[] = []
  querySnapshot.docs.forEach((docSnap) => {
    const data = docSnap.data() as { favoris?: string[] }
    if (!data.favoris) return
    const favoris = data.favoris.map((favori) => favori.toLowerCase())
    promises.push(updateDoc(docSnap.ref, { favoris }))
  })

  await Promise.all(promises)
  console.log(
    "La propriété a été ajoutée à tous les documents de la collection"
  )
}

export const removeAllDataOnCollection = async (): Promise<void> => {
  const querySnapshot = await getDocs(collection(db, "codes"))
  const promises: Promise<void>[] = []
  querySnapshot.docs.forEach((docSnap) => {
    promises.push(
      updateDoc(docSnap.ref, {
        descriptionInArray: deleteField(),
      })
    )
  })
  await Promise.all(promises)
  console.log("La propriété a été supprimée de tous les documents")
}

export const addUserPseudosToLnDev7Followers = async (): Promise<void> => {
  const lnDev7Ref = doc(db, "users", "ln-dev7")
  const lnDev7Snap = await getDoc(lnDev7Ref)
  const lnDev7Data = lnDev7Snap.data() as { followers?: string[] } | undefined
  const usersQuerySnapshot = await getDocs(collection(db, "users"))
  const usersPseudos = usersQuerySnapshot.docs.map(
    (docSnap) => (docSnap.data() as { pseudo: string }).pseudo
  )
  await updateDoc(lnDev7Ref, {
    followers: [...(lnDev7Data?.followers ?? []), ...usersPseudos],
  })
}
