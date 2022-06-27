import firebase from "firebase/compat/app";
import firestore from "firebase/compat/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const fb = firebase.initializeApp({
  apiKey: "AIzaSyCS7dlm0sBnBPI22QaI3j_fAhw28mFJpSw",
  authDomain: "mirats-fulcrum.firebaseapp.com",
  databaseURL: "https://mirats-fulcrum.firebaseio.com",
  projectId: "mirats-fulcrum",
  storageBucket: "mirats-fulcrum.appspot.com",
  messagingSenderId: "759155739902",
  appId: "1:759155739902:web:a3b07292126dd4e6c429af",
  measurementId: "G-ZRXJL491DX",
});
export const db = fb.firestore();
export const storage = getStorage();
export const auth = getAuth();

// Mirats Fulcrum
// apiKey: "AIzaSyCS7dlm0sBnBPI22QaI3j_fAhw28mFJpSw",
// authDomain: "mirats-fulcrum.firebaseapp.com",
// databaseURL: "https://mirats-fulcrum.firebaseio.com",
// projectId: "mirats-fulcrum",
// storageBucket: "mirats-fulcrum.appspot.com",
// messagingSenderId: "759155739902",
// appId: "1:759155739902:web:a3b07292126dd4e6c429af",
// measurementId: "G-ZRXJL491DX",

// PORTALS
// apiKey: "AIzaSyDZFy3EfjfgAc-yZflb7nY_xPWohp4YAeU",
// authDomain: "lucid2.firebaseapp.com",
// projectId: "lucid2",
// storageBucket: "lucid2.appspot.com",
// messagingSenderId: "923703763850",
// appId: "1:923703763850:web:6c32bfbf971262299a5e73",
// measurementId: "G-YL0776R1ES",
