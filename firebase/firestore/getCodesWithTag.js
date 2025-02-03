import { useState } from 'react';
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

export const useGetCodesWithTag = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getCodesWithTag = async (tag, isPrivate) => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, 'codes'),
          where('isPrivate', '==', isPrivate),
          where('tags', 'array-contains', tag),
          orderBy('createdAt', 'desc')
        )
      );
      const collections = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;
        return data;
      });
      return collections;
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  return { getCodesWithTag, isLoading };
};
