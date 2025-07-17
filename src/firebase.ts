// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, createUserWithEmailAndPassword, 
    updateProfile, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut} from 'firebase/auth'
    
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVQLdYYgfwyNF3x7NlreYklJXRi_LQ4-k",
  authDomain: "kottage-v2.firebaseapp.com",
  projectId: "kottage-v2",
  storageBucket: "kottage-v2.appspot.com",
  messagingSenderId: "850162149337",
  appId: "1:850162149337:web:dce63fdd43cfd3cfea5bc8",
  measurementId: "G-WKMD3DHDLX"
};

// Initialize Firebase
const app =initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
const database = getDatabase(app);
const functions = getFunctions(app);
//const firestore = getFirestore(app);

// Connect to functions emulator in development
if (process.env.NODE_ENV === 'development') {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

export {getAuth,  createUserWithEmailAndPassword, 
    updateProfile, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut, auth,database,storage,functions}