import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

// Firebase Instance
import { auth, db } from "./src/lib/firebase";

import { COLORS } from "./src/constants/Theme";
import { useCycleStore } from "./src/store/cycleStore";

// Screens
import DashboardScreen from "./src/screens/DashboardScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import InventoryScreen from "./src/screens/InventoryScreen";
import CalendarScreen from "./src/screens/CalendarScreen";
import IntelScreen from "./src/screens/IntelScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import AuthScreen from "./src/screens/AuthScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";

const Stack = createNativeStackNavigator();
const APP_ID = "red-protocol";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const {
    isOnboarded,
    isLoading,
    setProfile,
    setSyncData,
    setLoading,
    history,
    symptoms,
    partnerName,
    cycleLength,
    periodDuration,
    lastPeriodDate,
  } = useCycleStore();

  // 1. Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (isInitializing) setIsInitializing(false);

      // If no user, stop loading store state
      if (!u) {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [isInitializing]);

  // 2. Sync Cloud Data to Local Store
  useEffect(() => {
    if (!user) return;

    // Start loading while we fetch data
    setLoading(true);

    const profileRef = doc(
      db,
      "artifacts",
      APP_ID,
      "users",
      user.uid,
      "profile"
    );
    const dataRef = doc(db, "artifacts", APP_ID, "users", user.uid, "data");

    const unsubProfile = onSnapshot(
      profileRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setProfile(data as any);
        } else {
          // User exists but no profile yet -> Onboarding required
          setProfile({ isOnboarded: false });
        }
        setLoading(false);
      },
      (err) => {
        console.error("Profile Sync Error:", err);
        setLoading(false);
      }
    );

    const unsubData = onSnapshot(
      dataRef,
      (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          setSyncData(d.history || {}, d.symptoms || {});
        }
      },
      (err) => console.error("Data Sync Error:", err)
    );

    return () => {
      unsubProfile();
      unsubData();
    };
  }, [user]);

  // 3. Auto-Save Local Changes to Cloud
  useEffect(() => {
    if (!user || isLoading || !isOnboarded) return;

    const saveToCloud = async () => {
      const profileRef = doc(
        db,
        "artifacts",
        APP_ID,
        "users",
        user.uid,
        "profile"
      );
      const dataRef = doc(db, "artifacts", APP_ID, "users", user.uid, "data");

      try {
        await setDoc(
          profileRef,
          {
            partnerName,
            cycleLength,
            periodDuration,
            lastPeriodDate,
            isOnboarded: true,
          },
          { merge: true }
        );

        await setDoc(dataRef, { history, symptoms }, { merge: true });
      } catch (e) {
        console.error("Cloud Save Failed:", e);
      }
    };

    const timeout = setTimeout(saveToCloud, 2000); // Debounce 2s
    return () => clearTimeout(timeout);
  }, [
    history,
    symptoms,
    partnerName,
    cycleLength,
    lastPeriodDate,
    isOnboarded,
  ]);

  if (isInitializing) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background },
            animation: "fade",
          }}
        >
          {!user ? (
            <Stack.Screen name="Auth" component={AuthScreen} />
          ) : !isOnboarded ? (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          ) : (
            <>
              <Stack.Screen name="Dashboard" component={DashboardScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name="Inventory" component={InventoryScreen} />
              <Stack.Screen name="Calendar" component={CalendarScreen} />
              <Stack.Screen name="Intel" component={IntelScreen} />
              <Stack.Screen name="History" component={HistoryScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
