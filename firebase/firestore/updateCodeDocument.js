import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { useMutation, useQueryClient } from 'react-query';

import firebase_app from '../config';

const db = getFirestore(firebase_app);

const updateCodeDocument = async (params, collectionName) => {
  const { id, updatedCodeData } = params;
  const docRef = await updateDoc(doc(db, collectionName, id), updatedCodeData);
  return docRef;
};

const useUpdateCodeDocument = (collectionName) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (params) => {
      return updateCodeDocument(params, collectionName);
    },
    {
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries('isprivate-code-from-user-false');
        queryClient.invalidateQueries('isprivate-code-from-user-true');
        queryClient.invalidateQueries('codes-from-user');
        queryClient.invalidateQueries('links-from-user');
        queryClient.invalidateQueries('forms-from-user');
        queryClient.invalidateQueries('favorites-codes');
        queryClient.invalidateQueries('isprivate-codes-true');
        queryClient.invalidateQueries('isprivate-codes-false');
        queryClient.invalidateQueries('document-users');
        queryClient.invalidateQueries('document-codes');
        queryClient.invalidateQueries('document-links');
        queryClient.invalidateQueries('document-forms');
        queryClient.invalidateQueries('users');
        queryClient.invalidateQueries('codes');
        queryClient.invalidateQueries('links');
        queryClient.invalidateQueries('forms');
        queryClient.invalidateQueries('documents-codes');
        queryClient.invalidateQueries('documents-users');
        queryClient.invalidateQueries('documents-links');
        queryClient.invalidateQueries('documents-forms');
        queryClient.invalidateQueries('popular-codes');
      },
    }
  );

  return {
    updateCodeDocument: mutation.mutate,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
};

export { useUpdateCodeDocument };
