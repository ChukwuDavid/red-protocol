import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from "react-native";
import { COLORS, LAYOUT, SPACING } from "../constants/Theme";
import { useCycleStore } from "../store/cycleStore";
import CalendarWidget from "../components/CalendarWidget";
import { getTacticalIntel } from "../utils/translator";
import SymptomModal from "../components/SymptomModal";

export default function CalendarScreen({ navigation }: any) {
  const {
    lastPeriodDate,
    cycleLength,
    periodDuration,
    logPeriodStart,
    symptoms,
  } = useCycleStore();

  const intel = getTacticalIntel(lastPeriodDate, cycleLength, periodDuration);
  const [symptomVisible, setSymptomVisible] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleViewLog = (date: Date) =>
    navigation.navigate("Inventory", { date: date.toISOString() });

  const handleLogIncident = (date: Date) => {
    setSelectedDate(date);
    setSymptomVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>{"< HQ"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TACTICAL MAP</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>CYCLE TIMELINE & PROJECTIONS</Text>

        <View style={styles.calendarContainer}>
          <CalendarWidget
            lastPeriodDate={lastPeriodDate}
            cycleLength={cycleLength}
            periodDuration={periodDuration}
            symptoms={symptoms}
            onDateSelect={logPeriodStart}
            onViewLog={handleViewLog}
            onLogIncident={handleLogIncident}
            accentColor={intel.color}
          />
        </View>

        <View style={styles.legendContainer}>
          <LegendItem color={COLORS.primary} label="MAINTENANCE (PERIOD)" />
          <LegendItem color={COLORS.success} label="HIGH ENERGY (FOLLICULAR)" />
          <LegendItem color={COLORS.purple} label="PEAK (OVULATION)" />
          <LegendItem color={COLORS.warning} label="CAUTION (LUTEAL)" />
        </View>
      </View>

      <SymptomModal
        visible={symptomVisible}
        onClose={() => setSymptomVisible(false)}
        date={selectedDate}
      />
    </SafeAreaView>
  );
}

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <View style={styles.legendItem}>
    <View style={[styles.dot, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: SPACING.m,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: { padding: SPACING.s },
  backText: { color: COLORS.subtext, fontWeight: "bold" },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  content: { flex: 1, padding: SPACING.m },
  subtitle: {
    color: COLORS.subtext,
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: SPACING.l,
    textAlign: "center",
  },
  calendarContainer: {
    flex: 1,
  },
  legendContainer: {
    padding: SPACING.m,
    backgroundColor: COLORS.surface,
    borderRadius: LAYOUT.borderRadius,
    marginTop: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  legendItem: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  legendText: { color: COLORS.subtext, fontSize: 10, fontWeight: "bold" },
});
