import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, deleteDoc, doc, enableIndexedDbPersistence } from 'firebase/firestore'

// PASTE YOUR FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "AIzaSyDhitLQiUqcdSERKIFhieXjpqYGiP5yakw",
  authDomain: "workouttracker-b501e.firebaseapp.com",
  projectId: "workouttracker-b501e",
  storageBucket: "workouttracker-b501e.firebasestorage.app",
  messagingSenderId: "513881379744",
  appId: "1:513881379744:web:6b0cb7b419e36c834d4ac5"
};
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// Try to enable offline persistence (might fail in some browsers/modes, so we catch error)
enableIndexedDbPersistence(db).catch((err) => console.log('Persistence:', err.code))

export const entriesCollection = () => collection(db, 'entries')
export const templatesCollection = () => collection(db, 'templates')
export const addEntry = (entry: any) => addDoc(entriesCollection(), entry)
export const addTemplate = (template: any) => addDoc(templatesCollection(), template)
export const deleteEntry = (id: string) => deleteDoc(doc(db, 'entries', id))
export const deleteTemplate = (id: string) => deleteDoc(doc(db, 'templates', id))
