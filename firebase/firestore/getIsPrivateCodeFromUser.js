import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { useQuery } from 'react-query';

import firebase_app from '../config';

const db = getFirestore(firebase_app);

const getIsPrivateCodeFromUser = async (isPrivate, userId) => {
  const querySnapshot = await getDocs(
    query(
      collection(db, 'codes'),
      where('isPrivate', '==', isPrivate),
      where('idAuthor', '==', userId),
      orderBy('createdAt', 'desc')
    )
  );
  const collections = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    data.id = doc.id;
    return data;
  });
  return collections;
};

const useGetIsPrivateCodeFromUser = (isPrivate, userId) => {
  return useQuery([`isprivate-code-from-user-${isPrivate}`, 'codes'], () =>
    getIsPrivateCodeFromUser(isPrivate, userId)
  );
};

export { useGetIsPrivateCodeFromUser };
