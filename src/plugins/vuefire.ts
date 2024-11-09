import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_SECRET,
  projectId: 'formulaonepool-c6156'
});

export const db = getFirestore(firebaseApp);
