import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { intiliazeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmKAZ1k95ysyVjjE9XXo0VYC29CSH3y_0",
  authDomain: "gymtracker-94bf7.firebaseapp.com",
  projectId: "gymtracker-94bf7",
  storageBucket: "gymtracker-94bf7.firebasestorage.app",
  messagingSenderId: "1037263671983",
  appId: "1:1037263671983:web:4537693d911aed727ffa5a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);