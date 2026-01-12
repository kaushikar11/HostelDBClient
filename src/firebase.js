// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoukmk4wkEkFmWapZ4PoEV3FklcoeikDI",
  authDomain: "tcehostel-d4b51.firebaseapp.com",
  projectId: "tcehostel-d4b51",
  storageBucket: "tcehostel-d4b51.firebasestorage.app",
  messagingSenderId: "246298317872",
  appId: "1:246298317872:web:e521d0cdca5f726db2c9f5",
  measurementId: "G-VVLLTFNH1N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db,storage,auth };
export default app;