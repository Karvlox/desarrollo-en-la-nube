// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyARRfJv2uvdTAMtGednuMY8woqM_o4pXqU",
  authDomain: "spotifyclone-31e07.firebaseapp.com",
  projectId: "spotifyclone-31e07",
  storageBucket: "spotifyclone-31e07.firebasestorage.app",
  messagingSenderId: "946069086322",
  appId: "1:946069086322:web:1172b9a5ec5fd5684aa2eb",
  measurementId: "G-H14P7BBN5K"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);