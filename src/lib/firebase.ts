import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  type Auth,
  // @ts-ignore: Persistence is present in runtime for React Native
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your configuration using Expo's environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with Persistence - Use a function to ensure proper typing
const initializeFirebaseAuth = (): Auth => {
  try {
    // Use React Native persistence if available
    // @ts-ignore: Handle potential type mismatch
    if (getReactNativePersistence) {
      return initializeAuth(app, {
        // @ts-ignore
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } else {
      // Fallback if persistence module is missing or fails
      console.warn(
        "getReactNativePersistence not found, falling back to default auth"
      );
      return getAuth(app);
    }
  } catch (e: any) {
    // If Auth is already initialized, just retrieve the instance
    if (e.code === "auth/already-initialized") {
      return getAuth(app);
    } else {
      console.error("Firebase Auth Initialization Error:", e);
      // Last resort fallback to prevent crash
      return getAuth(app);
    }
  }
};

const auth = initializeFirebaseAuth();
const db = getFirestore(app);

export { auth, db };
