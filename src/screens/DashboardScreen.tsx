import React, { useState } from "react";
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
import { getRadarPredictions } from "../utils/radar";

// Components
import CalendarWidget from "../components/CalendarWidget";
import TacticalCard from "../components/TacticalCard";
import SupplyDropButton from "../components/SupplyDropButton";
import TacticalCommsModal from "../components/TacticalCommsModal";
import SupplyDropModal from "../components/SupplyDropModal";
import SymptomModal from "../components/SymptomModal";
import RadarWidget from "../components/RadarWidget";

export default function DashboardScreen({ navigation }: any) {
  const {
    lastPeriodDate,
    cycleLength,
    periodDuration,
    logPeriodStart,
    partnerName,
    symptoms, // <--- Get symptoms from store
  } = useCycleStore();

  const intel = getTacticalIntel(lastPeriodDate, cycleLength, periodDuration);
  const radarPredictions = getRadarPredictions(
    lastPeriodDate,
    cycleLength,
    symptoms
  );

  // State for Modals
  const [commsVisible, setCommsVisible] = useState(false);
  const [supplyVisible, setSupplyVisible] = useState(false);
  const [symptomVisible, setSymptomVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Helper to open Logistics
  const openLogistics = (date: Date = new Date()) => {
    navigation.navigate("Inventory", { date: date.toISOString() });
  };

  // Helper to open Symptom Logger
  const openSymptomLogger = (date: Date) => {
    setSelectedDate(date);
    setSymptomVisible(true);
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
        {/* COMPONENT 0: Radar Widget (Shows only if threats detected) */}
        <RadarWidget predictions={radarPredictions} />

        {/* COMPONENT 1: The Tactical Calendar */}
        <CalendarWidget
          lastPeriodDate={lastPeriodDate}
          cycleLength={cycleLength}
          periodDuration={periodDuration}
          symptoms={symptoms} // <--- Pass symptoms to calendar
          onDateSelect={logPeriodStart}
          onViewLog={openLogistics}
          onLogIncident={openSymptomLogger}
          accentColor={intel.color}
        />

        {/* COMPONENT 2: The Intel Card */}
        <TacticalCard intel={intel} />

        {/* COMPONENT 3: TACTICAL COMMS */}
        <TouchableOpacity
          style={styles.commsBtn}
          onPress={() => setCommsVisible(true)}
        >
          <Text style={styles.commsIcon}>💬</Text>
          <Text style={styles.commsText}>GENERATE INTEL (DRAFTS)</Text>
        </TouchableOpacity>

        {/* ACTION GRID */}
        <View style={styles.grid}>
          <TouchableOpacity
            onPress={() => openLogistics(new Date())}
            style={[styles.btn, styles.inventoryBtn]}
          >
            <Text style={styles.btnText}>OPEN TODAY'S CHECKLIST</Text>
          </TouchableOpacity>
        </View>

        {/* COMPONENT 4: THE PANIC BUTTON */}
        <View style={{ marginTop: 20 }}>
          <SupplyDropButton onPress={() => setSupplyVisible(true)} />
        </View>
      </ScrollView>

      {/* MODALS */}
      <TacticalCommsModal
        visible={commsVisible}
        onClose={() => setCommsVisible(false)}
        phase={intel.phase}
      />

      <SupplyDropModal
        visible={supplyVisible}
        onClose={() => setSupplyVisible(false)}
      />

      <SymptomModal
        visible={symptomVisible}
        onClose={() => setSymptomVisible(false)}
        date={selectedDate}
      />
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
  mainContent: { padding: 20, paddingBottom: 50 },

  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 15,
    marginTop: 15,
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

  commsBtn: {
    flexDirection: "row",
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#555",
  },
  commsIcon: { fontSize: 18, marginRight: 10 },
  commsText: { color: "#FFF", fontWeight: "bold", letterSpacing: 1 },
});
