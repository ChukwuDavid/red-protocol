import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { COLORS, SPACING, LAYOUT } from "../constants/Theme";

export default function OnboardingScreen() {
  const [name, setName] = useState("");
  const [cycle, setCycle] = useState("28");
  const [loading, setLoading] = useState(false);
  const APP_ID = "red-protocol";

  const handleFinish = async () => {
    if (!name) return;
    setLoading(true);
    const user = auth.currentUser;
    if (!user) return;

    try {
      // Save profile and set isOnboarded to true
      await setDoc(
        doc(db, "artifacts", APP_ID, "users", user.uid, "profile"),
        {
          partnerName: name,
          cycleLength: parseInt(cycle) || 28,
          periodDuration: 5,
          isOnboarded: true,
          lastPeriodDate: null,
        },
        { merge: true }
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>INITIAL CALIBRATION</Text>
      <Text style={styles.description}>
        Configure protocol settings for your primary target.
      </Text>

      <View style={styles.section}>
        <Text style={styles.label}>PARTNER NAME (TARGET ID)</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Sarah"
          placeholderTextColor="#444"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>CYCLE DURATION (DAYS)</Text>
        <Text style={styles.hint}>
          Standard is 28. Adjust based on historical data.
        </Text>
        <TextInput
          style={styles.input}
          value={cycle}
          onChangeText={setCycle}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={handleFinish}
        disabled={loading || !name}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.btnText}>INITIALIZE PROTOCOL</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
    justifyContent: "center",
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 10,
  },
  description: { color: COLORS.subtext, fontSize: 14, marginBottom: 40 },
  section: { marginBottom: 30 },
  label: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    letterSpacing: 1,
  },
  hint: { color: COLORS.subtext, fontSize: 11, marginBottom: 10 },
  input: {
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btn: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  btnText: { color: "#FFF", fontWeight: "bold", letterSpacing: 1 },
});
