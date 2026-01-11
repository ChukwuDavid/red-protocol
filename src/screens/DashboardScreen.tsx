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
import { COLORS, LAYOUT, SPACING } from "../constants/Theme";

// Components
import CalendarWidget from "../components/CalendarWidget";
import TacticalCard from "../components/TacticalCard";
import SupplyDropButton from "../components/SupplyDropButton";
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
    symptoms,
  } = useCycleStore();

  const intel = getTacticalIntel(lastPeriodDate, cycleLength, periodDuration);
  const radarPredictions = getRadarPredictions(
    lastPeriodDate,
    cycleLength,
    symptoms
  );

  const [supplyVisible, setSupplyVisible] = useState(false);
  const [symptomVisible, setSymptomVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const openLogistics = (date: Date = new Date()) => {
    navigation.navigate("Inventory", { date: date.toISOString() });
  };

  const openSymptomLogger = (date: Date) => {
    setSelectedDate(date);
    setSymptomVisible(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.subHeader}>STATUS MONITOR</Text>
          <Text style={styles.headerTitle}>{partnerName.toUpperCase()}</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("Settings")}
          style={styles.settingsBtn}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.mainContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. RADAR WARNINGS */}
        {radarPredictions.length > 0 && (
          <View style={{ marginBottom: SPACING.l }}>
            <RadarWidget predictions={radarPredictions} />
          </View>
        )}

        {/* 2. CALENDAR MAP PREVIEW */}
        <View style={styles.section}>
          <CalendarWidget
            lastPeriodDate={lastPeriodDate}
            cycleLength={cycleLength}
            periodDuration={periodDuration}
            symptoms={symptoms}
            onDateSelect={logPeriodStart}
            onViewLog={openLogistics}
            onLogIncident={openSymptomLogger}
            accentColor={intel.color}
          />
        </View>

        {/* 3. INTEL CARD */}
        <View style={styles.section}>
          <TacticalCard intel={intel} />
        </View>

        {/* 4. MODULE NAVIGATION */}
        <Text style={styles.sectionLabel}>TACTICAL MODULES</Text>
        <View style={styles.moduleGrid}>
          {/* Calendar Module */}
          <TouchableOpacity
            style={styles.moduleCard}
            onPress={() => navigation.navigate("Calendar")}
          >
            <Text style={styles.moduleIcon}>🗺️</Text>
            <Text style={styles.moduleTitle}>TACTICAL MAP</Text>
            <Text style={styles.moduleSub}>Full Timeline</Text>
          </TouchableOpacity>

          {/* Intel Module */}
          <TouchableOpacity
            style={styles.moduleCard}
            onPress={() => navigation.navigate("Intel")}
          >
            <Text style={styles.moduleIcon}>🎒</Text>
            <Text style={styles.moduleTitle}>FIELD GUIDE</Text>
            <Text style={styles.moduleSub}>Logs & Comms</Text>
          </TouchableOpacity>
        </View>

        {/* 5. PANIC BUTTON */}
        <View style={{ marginTop: SPACING.l }}>
          <SupplyDropButton onPress={() => setSupplyVisible(true)} />
        </View>
      </ScrollView>

      {/* MODALS */}
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
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.l,
    paddingBottom: SPACING.m,
    alignItems: "center",
  },
  subHeader: {
    color: COLORS.subtext,
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 1,
  },
  settingsBtn: {
    padding: SPACING.s,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingsIcon: { fontSize: 20 },

  mainContent: { padding: SPACING.l, paddingBottom: 50 },

  section: { marginBottom: SPACING.l },
  sectionLabel: {
    color: COLORS.subtext,
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: SPACING.m,
  },

  moduleGrid: { flexDirection: "row", gap: SPACING.m, marginBottom: SPACING.l },
  moduleCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SPACING.l,
    borderRadius: LAYOUT.borderRadius,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...LAYOUT.cardShadow,
  },
  moduleIcon: { fontSize: 32, marginBottom: SPACING.m },
  moduleTitle: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    textAlign: "center",
  },
  moduleSub: { color: COLORS.subtext, fontSize: 10, marginTop: 4 },
});
