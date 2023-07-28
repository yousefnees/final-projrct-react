import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBlDjnZn1og6DuSwRlXzTSQloGCx0RfpAQ",
  authDomain: "movieapp-white.firebaseapp.com",
  projectId: "movieapp-white",
  storageBucket: "movieapp-white.appspot.com",
  messagingSenderId: "294704242871",
  appId: "1:294704242871:web:9050148809b3bf64856d32",
  measurementId: "G-9HMBPGV0FV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const firestore = getFirestore(app)
export {auth,firestore}