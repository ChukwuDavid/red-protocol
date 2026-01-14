import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { COLORS, LAYOUT, SPACING } from "../constants/Theme";
import { useCycleStore } from "../store/cycleStore";
import { format } from "date-fns";
import HistoryDetailModal from "../components/HistoryDetailModal";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen({ navigation }: any) {
  const { history, symptoms } = useCycleStore();
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  // Combine and Sort Data
  const logEntries = useMemo(() => {
    // 1. Get all unique dates from both sources
    const allDates = new Set([
      ...Object.keys(history).filter((d) => history[d].some((i) => i.checked)), // Only days with checked items
      ...Object.keys(symptoms).filter((d) => symptoms[d].length > 0), // Only days with symptoms
    ]);

    // 2. Sort descending (Newest first)
    return Array.from(allDates).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
  }, [history, symptoms]);

  const renderItem = ({ item }: { item: string }) => {
    const symptomCount = (symptoms[item] || []).length;
    const checkedCount = (history[item] || []).filter((i) => i.checked).length;
    const dateObj = new Date(item);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => setSelectedDateStr(item)}
      >
        <View style={styles.dateBox}>
          <Text style={styles.dayText}>{format(dateObj, "dd")}</Text>
          <Text style={styles.monthText}>{format(dateObj, "MMM")}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.yearText}>{format(dateObj, "yyyy")}</Text>
          <View style={styles.statsRow}>
            {symptomCount > 0 && (
              <View style={styles.statBadge}>
                <Text style={styles.statText}>⚠️ {symptomCount} INTEL</Text>
              </View>
            )}
            {checkedCount > 0 && (
              <View style={styles.statBadge}>
                <Text style={styles.statText}>📋 {checkedCount} LOGS</Text>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>{"< BACK"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>HISTORY ARCHIVE</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {logEntries.length > 0 ? (
          <FlatList
            data={logEntries}
            keyExtractor={(item) => item}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>NO ARCHIVES FOUND</Text>
            <Text style={styles.emptySub}>
              Logs will appear here once you track activity.
            </Text>
          </View>
        )}
      </View>

      <HistoryDetailModal
        visible={!!selectedDateStr}
        dateStr={selectedDateStr}
        onClose={() => setSelectedDateStr(null)}
      />
    </SafeAreaView>
  );
}

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
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  content: { flex: 1, padding: SPACING.m },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    borderRadius: LAYOUT.borderRadius,
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: SPACING.m,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    minWidth: 60,
  },
  dayText: { color: COLORS.text, fontSize: 20, fontWeight: "bold" },
  monthText: {
    color: COLORS.subtext,
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  infoBox: { flex: 1, paddingLeft: SPACING.m },
  yearText: { color: COLORS.subtext, fontSize: 12, marginBottom: 5 },
  statsRow: { flexDirection: "row", gap: 8 },
  statBadge: {
    backgroundColor: COLORS.surfaceHighlight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statText: { color: COLORS.text, fontSize: 10, fontWeight: "bold" },

  arrow: { color: COLORS.subtext, fontSize: 20 },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.5,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 10,
  },
  emptySub: { color: COLORS.subtext, fontSize: 12 },
});
