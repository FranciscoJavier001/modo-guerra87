// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCPOnHyzdRFlkRzI7SSmsuSy6_NiMNYFAw",
  authDomain: "modo-guerra87.firebaseapp.com",
  projectId: "modo-guerra87",
  storageBucket: "modo-guerra87.firebasestorage.app",
  messagingSenderId: "512556279663",
  appId: "1:512556279663:web:33e2d2762990d5aa98ea9a",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);