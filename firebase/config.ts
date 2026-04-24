import { FirebaseApp, getApps, initializeApp } from "firebase/app"
import { Auth, getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

const isConfigured = Boolean(firebaseConfig.apiKey)

let firebase_app: FirebaseApp | null = null
let _auth: Auth | null = null

if (isConfigured) {
  firebase_app =
    getApps().length === 0
      ? initializeApp(firebaseConfig as Required<typeof firebaseConfig>)
      : getApps()[0]
  _auth = getAuth(firebase_app)
}

export default firebase_app as FirebaseApp
export const auth = _auth as Auth
export { isConfigured as isFirebaseConfigured }
