import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage"
import { uid } from "uid"

import firebase_app from "../config"

const storage = getStorage(firebase_app)

/**
 * Upload a File (from a file input) to Firebase Storage and return its
 * public download URL.
 */
export async function uploadFormFile(
  formId: string,
  file: File
): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")
  const path = `forms/${formId}/uploads/${uid()}-${safeName}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

/**
 * Upload a base64 data URL (e.g. a signature drawn on a canvas) to Firebase
 * Storage and return its public download URL.
 */
export async function uploadSignature(
  formId: string,
  dataUrl: string
): Promise<string> {
  const path = `forms/${formId}/signatures/${uid()}.png`
  const storageRef = ref(storage, path)
  await uploadString(storageRef, dataUrl, "data_url")
  return getDownloadURL(storageRef)
}
