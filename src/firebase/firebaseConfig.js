// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestore
import { getAuth } from "firebase/auth"; // Authentication

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAs_F1X0fCXsBhoxZnSAEONm7copOYVo8A",
  authDomain: "shopnest-ecommerce-d23b6.firebaseapp.com",
  projectId: "shopnest-ecommerce-d23b6",
  storageBucket: "shopnest-ecommerce-d23b6.appspot.com",
  messagingSenderId: "6939404102",
  appId: "1:6939404102:web:3374acc27b6e7b1aec6747"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Authentication
const auth = getAuth(app);

// Export db and auth
export { db, auth };
