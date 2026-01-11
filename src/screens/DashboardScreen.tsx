import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCycleStore } from "../store/cycleStore";
import { getTacticalIntel } from "../utils/translator";

// Import our new components
import CalendarWidget from "../components/CalendarWidget";
import TacticalCard from "../components/TacticalCard";
import SupplyDropButton from "../components/SupplyDropButton"; // <--- Import

export default function DashboardScreen({ navigation }: any) {
  const {
    lastPeriodDate,
    cycleLength,
    periodDuration,
    logPeriodStart,
    partnerName,
  } = useCycleStore();

  const intel = getTacticalIntel(lastPeriodDate, cycleLength, periodDuration);

  // Helper to open Logistics for a specific date
  const openLogistics = (date: Date = new Date()) => {
    navigation.navigate("Inventory", { date: date.toISOString() });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
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

      <ScrollView contentContainerStyle={styles.mainContent}>
        {/* COMPONENT 1: The Tactical Calendar */}
        <CalendarWidget
          lastPeriodDate={lastPeriodDate}
          cycleLength={cycleLength}
          periodDuration={periodDuration}
          onDateSelect={logPeriodStart}
          onViewLog={openLogistics}
          accentColor={intel.color}
        />

        {/* COMPONENT 2: The Intel Card */}
        <TacticalCard intel={intel} />

        {/* ACTION GRID */}
        <View style={styles.grid}>
          {/* LOGISTICS BUTTON (Defaults to Today) */}
          <TouchableOpacity
            onPress={() => openLogistics(new Date())}
            style={[styles.btn, styles.inventoryBtn]}
          >
            <Text style={styles.btnText}>OPEN TODAY'S CHECKLIST</Text>
          </TouchableOpacity>
        </View>

        {/* COMPONENT 3: THE PANIC BUTTON */}
        <View style={{ marginTop: 20 }}>
          <SupplyDropButton appName="chowdeck" />
        </View>
      </ScrollView>
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
  mainContent: { padding: 20, paddingBottom: 50 }, // Added paddingBottom for scrolling space
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
  inventoryBtn: { backgroundColor: "#1C1C1E", borderColor: "#333" },
  btnText: { color: "#FFF", fontWeight: "bold", letterSpacing: 1 },
});
