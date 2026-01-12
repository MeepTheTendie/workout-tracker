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
// Primary login: try central auth domain popup (serverless endpoint) which
// runs the Firebase client and posts back the result. Fallback to direct
// `signInWithPopup` when running server-side or if the popup flow fails.
export const login = async () => {
  if (typeof window === 'undefined') return signInWithPopup(auth, googleProvider)

  return new Promise<any>((resolve, reject) => {
    let settled = false
    const cleanup = () => {
      window.removeEventListener('message', listener)
      clearTimeout(timeout)
    }

    const listener = (e: MessageEvent) => {
      if (!e.data || e.data.type !== 'auth-result') return
      if (settled) return
      settled = true
      cleanup()
      if (e.data.error) {
        reject(new Error(e.data.error.message || e.data.error.code || 'Auth error'))
      } else {
        resolve(e.data.user)
      }
    }

    window.addEventListener('message', listener)

    const popup = window.open('/api/auth', 'auth', 'width=600,height=700')
    if (!popup) {
      cleanup()
      // fallback
      signInWithPopup(auth, googleProvider).then(resolve).catch(reject)
      return
    }

    const timeout = setTimeout(() => {
      if (settled) return
      settled = true
      cleanup()
      reject(new Error('Auth timed out'))
    }, 60_000)
  })
}

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