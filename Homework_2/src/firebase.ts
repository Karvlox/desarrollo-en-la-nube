import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import * as firebaseui from "firebaseui";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMxw1JnYsuyUwAqpjx271_hZGWnjzoCHM",
  authDomain: "desarrolloenlanube-a0d01.firebaseapp.com",
  projectId: "desarrolloenlanube-a0d01",
  storageBucket: "desarrolloenlanube-a0d01.firebasestorage.app",
  messagingSenderId: "1078968510007",
  appId: "1:1078968510007:web:2a1be1b3667f81378581b2",
  measurementId: "G-CGE17E4XRN"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAnalytics = getAnalytics(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);
export const firebaseUi = new firebaseui.auth.AuthUI(firebaseAuth);
export const firebaseDb = getFirestore(firebaseApp);

firebaseAuth.useDeviceLanguage();
export { firebaseAuth };