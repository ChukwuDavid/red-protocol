import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useCycleStore } from "../store/cycleStore";
import { format } from "date-fns";
import { COLORS, LAYOUT, SPACING } from "../constants/Theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InventoryScreen({ navigation, route }: any) {
  const dateParam = route.params?.date
    ? new Date(route.params.date)
    : new Date();

  const { getLogForDate, toggleLogForDate } = useCycleStore();
  const inventory = getLogForDate(dateParam);

  const progress = inventory.filter((i) => i.checked).length / inventory.length;
  const progressPercent = Math.round(progress * 100);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{"< BACK"}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>LOGISTICS</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>
            LOG FOR: {format(dateParam, "MMM dd, yyyy").toUpperCase()}
          </Text>
        </View>

        {/* STATUS BAR */}
        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>READINESS LEVEL</Text>
          <Text
            style={[
              styles.statusValue,
              {
                color:
                  progressPercent === 100 ? COLORS.success : COLORS.warning,
              },
            ]}
          >
            {progressPercent}%
          </Text>
        </View>

        <Text style={styles.subHeader}>DAILY CHECKLIST</Text>

        <ScrollView style={styles.list}>
          {inventory.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.itemRow, item.checked && styles.itemRowChecked]}
              onPress={() => toggleLogForDate(dateParam, item.id)}
            >
              <View
                style={[
                  styles.checkbox,
                  item.checked && styles.checkboxChecked,
                ]}
              >
                {item.checked && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text
                style={[
                  styles.itemText,
                  item.checked && styles.itemTextChecked,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
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
  backText: { color: COLORS.subtext, fontWeight: "bold", fontSize: 12 },
  title: {
    color: COLORS.text,
    fontSize: 16,
    letterSpacing: 2,
    fontWeight: "bold",
  },
  content: { padding: SPACING.m, flex: 1 },
  dateBadge: {
    alignSelf: "center",
    backgroundColor: COLORS.surfaceHighlight,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 20,
  },
  dateText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  statusBox: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: LAYOUT.borderRadius,
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusLabel: {
    color: COLORS.subtext,
    letterSpacing: 2,
    fontSize: 12,
    marginBottom: 5,
  },
  statusValue: { fontSize: 48, fontWeight: "bold" },
  subHeader: {
    color: COLORS.subtext,
    fontSize: 12,
    marginBottom: 15,
    letterSpacing: 1,
  },
  list: { flex: 1 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemRowChecked: { borderColor: COLORS.success, opacity: 0.6 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.subtext,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  checkMark: { color: "#000", fontWeight: "bold" },
  itemText: { color: COLORS.text, fontSize: 16 },
  itemTextChecked: {
    color: COLORS.subtext,
    textDecorationLine: "line-through",
  },
});
