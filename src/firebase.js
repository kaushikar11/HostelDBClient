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
  apiKey: "AIzaSyCjyxWjqmsWAOfXeKF8sG751vXBkQnc33I",
  authDomain: "ladieshosteltce.firebaseapp.com",
  projectId: "ladieshosteltce",
  storageBucket: "ladieshosteltce.appspot.com",
  messagingSenderId: "1073771171115",
  appId: "1:1073771171115:web:e29a9b2dc4efb37fa9096e",
  measurementId: "G-MG6PN8JE3Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db,storage,auth };
export default app;