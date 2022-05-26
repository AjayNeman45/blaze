import firebase from "firebase/compat/app";
import firestore from "firebase/compat/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const fb = firebase.initializeApp({
  apiKey: "AIzaSyDZFy3EfjfgAc-yZflb7nY_xPWohp4YAeU",
  authDomain: "lucid2.firebaseapp.com",
  projectId: "lucid2",
  storageBucket: "lucid2.appspot.com",
  messagingSenderId: "923703763850",
  appId: "1:923703763850:web:6c32bfbf971262299a5e73",
  measurementId: "G-YL0776R1ES",
});
export const db = fb.firestore();
export const storage = getStorage();
export const auth = getAuth();
