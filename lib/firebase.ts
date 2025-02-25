// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API,
  authDomain: "job-cv-manager-8b3b1.firebaseapp.com",
  projectId: "job-cv-manager-8b3b1",
  storageBucket: "job-cv-manager-8b3b1.firebasestorage.app",
  messagingSenderId: "896772162972",
  appId: "1:896772162972:web:5178304384a31ba1d67459",
  measurementId: "G-VY0V4TVT67"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);