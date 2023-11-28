import { getFirestore, collection, doc, getDoc } from 'firebase/firestore';

import firebase_app from "../config"

const db = getFirestore(firebase_app)

export async function checkIdAvailability(collectionName, id) {
    try {
      const docRef = doc(collection(db, collectionName), id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (error) {
      console.error('Error : ', error);
      return false;
    }
  }

