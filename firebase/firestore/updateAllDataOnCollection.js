import {
  collection,
  deleteField,
  getDocs,
  getDoc,
  getFirestore,
  updateDoc,
  doc,
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

// export const addUserPseudosToLnDev7Followers = async () => {
//   const lnDev7Ref = doc(db, "users", "ln-dev7");
//   const lnDev7Data = (await getDoc(lnDev7Ref)).data();
//   const usersQuerySnapshot = await getDocs(collection(db, "users"));
//   const usersPseudos = usersQuerySnapshot.docs.map((doc) => doc.data().pseudo);
//   await updateDoc(lnDev7Ref, { followers: [...lnDev7Data.followers, ...usersPseudos] });
// };
