import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useCycleStore } from "../store/cycleStore";

export default function SettingsScreen({ navigation }: any) {
  const {
    partnerName,
    setPartnerName,
    cycleLength,
    setCycleLength,
    resetData,
  } = useCycleStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{"< BACK"}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>CONFIGURATION</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* PARTNER NAME CONFIG */}
        <View style={styles.section}>
          <Text style={styles.label}>TARGET ID (PARTNER NAME)</Text>
          <TextInput
            style={styles.input}
            value={partnerName}
            onChangeText={setPartnerName}
            placeholderTextColor="#555"
          />
        </View>

        {/* CYCLE LENGTH CONFIG */}
        <View style={styles.section}>
          <Text style={styles.label}>CYCLE CALIBRATION (DAYS)</Text>
          <Text style={styles.subLabel}>
            Standard is 28. Adjust based on history.
          </Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.adjustBtn}
              onPress={() => setCycleLength(Math.max(21, cycleLength - 1))}
            >
              <Text style={styles.btnText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.valueText}>{cycleLength}</Text>

            <TouchableOpacity
              style={styles.adjustBtn}
              onPress={() => setCycleLength(Math.min(35, cycleLength + 1))}
            >
              <Text style={styles.btnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DANGER ZONE */}
        <View style={[styles.section, { marginTop: 40 }]}>
          <TouchableOpacity style={styles.resetBtn} onPress={resetData}>
            <Text style={styles.resetText}>FACTORY RESET DATA</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D0D" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
  },
  backText: { color: "#8E8E93", fontWeight: "bold" },
  title: { color: "#FFF", fontSize: 16, letterSpacing: 2, fontWeight: "bold" },
  content: { padding: 20 },
  section: { marginBottom: 30 },
  label: { color: "#8E8E93", fontSize: 12, marginBottom: 10, letterSpacing: 1 },
  subLabel: { color: "#555", fontSize: 12, marginBottom: 15 },
  input: {
    backgroundColor: "#1C1C1E",
    color: "#FFF",
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1C1C1E",
    borderRadius: 8,
    padding: 10,
  },
  adjustBtn: {
    backgroundColor: "#333",
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: { color: "#FFF", fontSize: 24 },
  valueText: { color: "#FFF", fontSize: 24, fontWeight: "bold" },
  resetBtn: {
    borderColor: "#FF453A",
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  resetText: { color: "#FF453A", fontWeight: "bold", letterSpacing: 1 },
});
