import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAMxw1JnYsuyUwAqpjx271_hZGWnjzoCHM",
  authDomain: "desarrolloenlanube-a0d01.firebaseapp.com",
  projectId: "desarrolloenlanube-a0d01",
  storageBucket: "desarrolloenlanube-a0d01.firebasestorage.app",
  messagingSenderId: "1078968510007",
  appId: "1:1078968510007:web:2a1be1b3667f81378581b2",
  measurementId: "G-CGE17E4XRN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const analytics = getAnalytics(app);

export { auth, googleProvider, facebookProvider, analytics };