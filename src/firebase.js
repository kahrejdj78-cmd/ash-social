import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCOnbAHgfn3zO4C7MylHUfRkWjqV3KA4D4",
  authDomain: "ash-social.firebaseapp.com",
  databaseURL: "https://ash-social-default-rtdb.firebaseio.com",
  projectId: "ash-social",
  storageBucket: "ash-social.firebasestorage.app",
  messagingSenderId: "379309356643",
  appId: "1:379309356643:web:b11382a1c148f8f0216a56",
  measurementId: "G-9KSZB6MZNB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

export default app;
