// config/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAg5nVh3B6JcctPuACop3v0M6BwU4W2xGc",
  authDomain: "trendrush-ccd25.firebaseapp.com",
  projectId: "trendrush-ccd25",
  storageBucket: "trendrush-ccd25.appspot.com", // corrected
  messagingSenderId: "181766599904",
  appId: "1:181766599904:web:2a8107e189ddbc653d0c85",
  measurementId: "G-JZGNX9CXTC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
