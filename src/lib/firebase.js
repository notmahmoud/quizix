// Firebase SDK imports — each service (Auth, Realtime DB) is imported separately
// so we only bundle what we actually use (tree-shakeable SDK).
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// All sensitive values come from environment variables (.env.local).
// Vite exposes them at build-time via import.meta.env — they are NEVER committed to source control.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,  // points to the Firebase Realtime Database URL
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase with the config above — must happen before any other Firebase call
const app = initializeApp(firebaseConfig);

// auth  → used for sign-up, login, Google auth, and listening to session changes
// db    → the Realtime Database instance used by db.js for all data operations
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db };
