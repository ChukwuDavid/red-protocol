import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth"; // <--- Import from main package
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your provided configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeGio4Tfx0fouZaIwxgwCaOsyLj5ZWhHQ",
  authDomain: "red-protocol-b3ada.firebaseapp.com",
  projectId: "red-protocol-b3ada",
  storageBucket: "red-protocol-b3ada.firebasestorage.app",
  messagingSenderId: "1005964837168",
  appId: "1:1005964837168:web:0fa08fb92d2545912f88f5",
  measurementId: "G-CX0BN87W60",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with Persistence for Expo/React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { auth, db };
