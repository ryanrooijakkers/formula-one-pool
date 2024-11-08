import { initializeApp } from 'firebase/app'
import { getFirestore, collection } from 'firebase/firestore'

export const firebaseApp = initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_SECRET,
    projectId: 'formulaonepool-c6156'
})


const db = getFirestore(firebaseApp);
export const t = collection(db, 't')