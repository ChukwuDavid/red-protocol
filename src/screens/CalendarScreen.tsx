import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ScrollView,
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

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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

          <Text style={styles.legendHeader}>FIELD INTELLIGENCE</Text>

          <View style={styles.legendContainer}>
            <LegendItem
              color={COLORS.primary}
              label="MAINTENANCE (PERIOD)"
              intel="Biological system flush. Oestrogen and Progesterone are at baseline. Physical energy is low, and inflammation may cause discomfort."
              move="Minimize external stress. Provide high-value comfort assets (heat, hydration, chocolate) without being asked. Be the silent support."
            />
            <LegendItem
              color={COLORS.success}
              label="HIGH ENERGY (FOLLICULAR)"
              intel="The reboot phase. Oestrogen begins its climb, boosting brain function, mood, and physical stamina. Brain fog usually clears here."
              move="Optimal window for 'New' experiences. Plan challenging dates, hiking, or social outings. She's feeling more capable and adventurous."
            />
            <LegendItem
              color={COLORS.purple}
              label="PEAK PERFORMANCE (OVULATION)"
              intel="The biological peak. Oestrogen and Testosterone surge. Social confidence, verbal fluency, and energy are at maximum levels."
              move="Social butterfly window. High-energy social events and ambitious dates are winning plays here. This is her most confident phase."
            />
            <LegendItem
              color={COLORS.warning}
              label="CAUTION (LUTEAL)"
              intel="The Storm Watch. Progesterone takes over. Cravings, mood sensitivity, and fatigue often rise as the body prepares for the next reset."
              move="Maximum buffer required. Practice extreme active listening. Stock the pantry with her favorites before the cravings hit. Patience is your primary weapon."
            />
          </View>
        </View>
      </ScrollView>

      <SymptomModal
        visible={symptomVisible}
        onClose={() => setSymptomVisible(false)}
        date={selectedDate}
      />
    </SafeAreaView>
  );
}

const LegendItem = ({
  color,
  label,
  intel,
  move,
}: {
  color: string;
  label: string;
  intel: string;
  move: string;
}) => (
  <View style={styles.legendItem}>
    <View style={styles.legendRow}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.legendLabel, { color: color }]}>{label}</Text>
    </View>
    <View style={styles.legendDetailBox}>
      <Text style={styles.intelText}>
        <Text style={styles.boldLabel}>INTEL: </Text>
        {intel}
      </Text>
      <Text style={styles.moveText}>
        <Text style={[styles.boldLabel, { color: "#FFF" }]}>
          TACTICAL MOVE:{" "}
        </Text>
        {move}
      </Text>
    </View>
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
  scrollContent: { flex: 1 },
  content: { padding: SPACING.m },
  subtitle: {
    color: COLORS.subtext,
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: SPACING.l,
    textAlign: "center",
  },
  calendarContainer: {
    marginBottom: SPACING.xl,
  },
  legendHeader: {
    color: COLORS.subtext,
    fontSize: 10,
    letterSpacing: 3,
    fontWeight: "bold",
    marginBottom: SPACING.m,
    paddingLeft: SPACING.s,
  },
  legendContainer: {
    gap: SPACING.m,
    paddingBottom: SPACING.xl,
  },
  legendItem: {
    backgroundColor: COLORS.surface,
    borderRadius: LAYOUT.borderRadius,
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.s,
  },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  legendLabel: { fontSize: 12, fontWeight: "900", letterSpacing: 1 },
  legendDetailBox: {
    marginTop: 4,
  },
  intelText: {
    color: "#CCC",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  moveText: {
    color: COLORS.subtext,
    fontSize: 13,
    lineHeight: 18,
    fontStyle: "italic",
  },
  boldLabel: {
    fontWeight: "bold",
    fontSize: 11,
    letterSpacing: 0.5,
  },
});
