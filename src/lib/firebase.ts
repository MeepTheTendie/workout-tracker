import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  enableIndexedDbPersistence,
} from 'firebase/firestore'

// Use environment variables for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig)

// Initialize Services
export const db = getFirestore(app)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// Helper functions for Auth
export const login = () => signInWithPopup(auth, googleProvider)
export const logout = () => signOut(auth)

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  console.warn('Persistence error:', err?.code || err)
})

// Helper functions for DB
export const entriesCollection = () => collection(db, 'entries')
export const templatesCollection = () => collection(db, 'templates')

export const addEntry = (entry: any) => addDoc(entriesCollection(), entry)
export const addTemplate = (template: any) => addDoc(templatesCollection(), template)
export const deleteEntry = (id: string) => deleteDoc(doc(db, 'entries', id))
export const deleteTemplate = (id: string) => deleteDoc(doc(db, 'templates', id))