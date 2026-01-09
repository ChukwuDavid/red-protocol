import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from "react-native";
import { useCycleStore } from "../store/cycleStore";
import { getTacticalIntel } from "../utils/translator";

export default function DashboardScreen({ navigation }: any) {
  const {
    lastPeriodDate,
    cycleLength,
    logPeriodStart,
    getDaysUntilNext,
    partnerName,
  } = useCycleStore();

  const intel = getTacticalIntel(lastPeriodDate, cycleLength);
  const daysUntil = getDaysUntilNext();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.subHeader}>MONITORING</Text>
          <Text style={styles.headerTitle}>{partnerName.toUpperCase()}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        {/* THE RING */}
        <View style={[styles.ring, { borderColor: intel.color }]}>
          <Text style={[styles.ringNumber, { color: intel.color }]}>
            {lastPeriodDate ? daysUntil : "--"}
          </Text>
          <Text style={styles.ringLabel}>DAYS T-MINUS</Text>
        </View>

        {/* STATUS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={[styles.statusTitle, { color: intel.color }]}>
              {intel.weather.toUpperCase()}
            </Text>
            <Text style={styles.phaseLabel}>{intel.phase}</Text>
          </View>
          <Text style={styles.message}>{intel.message}</Text>

          <View style={styles.divider} />

          <Text style={styles.actionLabel}>RECOMMENDED ACTION:</Text>
          <Text style={styles.actionItem}>{intel.actionItem}</Text>
        </View>

        {/* ACTION GRID */}
        <View style={styles.grid}>
          {/* LOG BUTTON */}
          <TouchableOpacity
            onPress={() => logPeriodStart(new Date())}
            style={[styles.btn, styles.logBtn]}
          >
            <Text style={styles.btnText}>LOG START</Text>
          </TouchableOpacity>

          {/* LOGISTICS BUTTON */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Inventory")}
            style={[styles.btn, styles.inventoryBtn]}
          >
            <Text style={styles.btnText}>LOGISTICS</Text>
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
  subHeader: { color: "#8E8E93", fontSize: 10, letterSpacing: 2 },
  headerTitle: { color: "#FFF", fontSize: 20, fontWeight: "bold" },
  settingsIcon: { fontSize: 24 },
  mainContent: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  ringNumber: { fontSize: 60, fontWeight: "bold" },
  ringLabel: { color: "#8E8E93", fontSize: 12, letterSpacing: 2, marginTop: 5 },
  card: {
    backgroundColor: "#1C1C1E",
    width: "100%",
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statusTitle: { fontSize: 18, fontWeight: "bold" },
  phaseLabel: { color: "#555", fontSize: 12, fontWeight: "bold" },
  message: { color: "#DDD", fontSize: 16, lineHeight: 24 },
  divider: { height: 1, backgroundColor: "#333", marginVertical: 15 },
  actionLabel: {
    color: "#8E8E93",
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 5,
  },
  actionItem: { color: "#FFF", fontSize: 14, fontWeight: "600" },

  /* New Grid for Buttons */
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 15,
  },
  btn: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  logBtn: { backgroundColor: "#333", borderColor: "#444" },
  inventoryBtn: { backgroundColor: "#1C1C1E", borderColor: "#333" },
  btnText: { color: "#FFF", fontWeight: "bold", letterSpacing: 1 },
});
