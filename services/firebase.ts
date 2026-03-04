import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig as sharedConfig } from '../scripts/config';

console.log("Initializing Firebase...");

let app: any;
let auth: any;
let db: any;

try {
  // Try environment variables first, fallback to shared config
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || sharedConfig.apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || sharedConfig.authDomain,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || sharedConfig.projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || sharedConfig.storageBucket,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || sharedConfig.messagingSenderId,
    appId: import.meta.env.VITE_FIREBASE_APP_ID || sharedConfig.appId
  };

  if (!config.apiKey) {
    throw new Error("Missing Firebase API Key in both env vars and shared config.");
  }

  app = initializeApp(config);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

export { auth, db };
