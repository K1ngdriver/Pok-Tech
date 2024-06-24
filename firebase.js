// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2iWJ7-lqp88j6N9thSMXqIGJLht_vjws",
  authDomain: "poketech-848d9.firebaseapp.com",
  projectId: "poketech-848d9",
  storageBucket: "poketech-848d9.appspot.com",
  messagingSenderId: "391423837828",
  appId: "1:391423837828:web:4cae97e0ecaf8c3a6764d1",
  measurementId: "G-GT1YEZWV7C",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

export { db };
