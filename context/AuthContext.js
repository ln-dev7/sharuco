import { createContext, useContext, useEffect, useState } from 'react';
import firebase_app from '@/firebase/config';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from 'firebase/firestore';
import { Loader, Terminal } from 'lucide-react';

const db = getFirestore(firebase_app);

const auth = getAuth(firebase_app);

export const AuthContext = createContext({
  user: null,
  userPseudo: '',
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userPseudo, setUserPseudo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setUserPseudo(user.reloadUserInfo.screenName.toLowerCase());
        async function addUID() {
          const documentRef = doc(
            collection(db, 'users'),
            user.reloadUserInfo.screenName.toLowerCase()
          );
          const docSnap = await getDoc(documentRef);

          if (docSnap.exists()) {
            await setDoc(
              documentRef,
              {
                uid: user.uid,
              },
              { merge: true }
            );
          }
        }
        addUID();
      } else {
        setUser(null);
        setUserPseudo(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userPseudo }}>
      {loading ? (
        <div className="fixed inset-0 flex flex-col gap-2 items-center justify-center">
          <Loader className="animate-spin" />
          <div className="flex items-center gap-1">
            <Terminal />
            <span className="font-semibold text-lg">Sharuco</span>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
