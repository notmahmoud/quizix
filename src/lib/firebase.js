import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAqJeCu04fFIcnqj55OOVFzEaa-Ot5iEFE",
  authDomain: "quizix-app.firebaseapp.com",
  databaseURL: "https://quizix-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "quizix-app",
  storageBucket: "quizix-app.firebasestorage.app",
  messagingSenderId: "881038916544",
  appId: "1:881038916544:web:f1924ae76d647d692e2625"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db };
