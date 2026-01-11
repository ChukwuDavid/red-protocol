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
import { COLORS, LAYOUT, SPACING } from "../constants/Theme";

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
            placeholderTextColor={COLORS.placeholder}
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
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: SPACING.l,
    alignItems: "center",
  },
  backText: { color: COLORS.subtext, fontWeight: "bold" },
  title: {
    color: COLORS.text,
    fontSize: 16,
    letterSpacing: 2,
    fontWeight: "bold",
  },
  content: { padding: SPACING.l },
  section: { marginBottom: SPACING.xl },
  label: {
    color: COLORS.subtext,
    fontSize: 12,
    marginBottom: 10,
    letterSpacing: 1,
  },
  subLabel: { color: "#666", fontSize: 12, marginBottom: 15 },
  input: {
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    padding: 15,
    borderRadius: LAYOUT.borderRadius,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surface,
    borderRadius: LAYOUT.borderRadius,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  adjustBtn: {
    backgroundColor: COLORS.surfaceHighlight,
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: { color: COLORS.text, fontSize: 24 },
  valueText: { color: COLORS.text, fontSize: 24, fontWeight: "bold" },
  resetBtn: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    padding: 15,
    borderRadius: LAYOUT.borderRadius,
    alignItems: "center",
    backgroundColor: COLORS.danger,
  },
  resetText: { color: COLORS.primary, fontWeight: "bold", letterSpacing: 1 },
});
