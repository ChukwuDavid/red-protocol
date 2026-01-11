import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useCycleStore } from "../store/cycleStore";
import { format } from "date-fns";

export default function InventoryScreen({ navigation, route }: any) {
  // We try to read the date passed from the Calendar.
  // If no date passed, use today.
  const dateParam = route.params?.date
    ? new Date(route.params.date)
    : new Date();

  const { getLogForDate, toggleLogForDate } = useCycleStore();

  // Get the specific history for this date
  const inventory = getLogForDate(dateParam);

  const progress = inventory.filter((i) => i.checked).length / inventory.length;
  const progressPercent = Math.round(progress * 100);

  return (
    <SafeAreaView style={styles.container}>
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
              { color: progressPercent === 100 ? "#32D74B" : "#FFD60A" },
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
  container: { flex: 1, backgroundColor: "#0D0D0D" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#1C1C1E",
  },
  backText: { color: "#8E8E93", fontWeight: "bold", fontSize: 12 },
  title: { color: "#FFF", fontSize: 16, letterSpacing: 2, fontWeight: "bold" },
  content: { padding: 20, flex: 1 },
  dateBadge: {
    alignSelf: "center",
    backgroundColor: "#333",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 20,
  },
  dateText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  statusBox: {
    backgroundColor: "#1C1C1E",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
  },
  statusLabel: {
    color: "#8E8E93",
    letterSpacing: 2,
    fontSize: 12,
    marginBottom: 5,
  },
  statusValue: { fontSize: 48, fontWeight: "bold" },
  subHeader: {
    color: "#8E8E93",
    fontSize: 12,
    marginBottom: 15,
    letterSpacing: 1,
  },
  list: { flex: 1 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  itemRowChecked: { borderColor: "#32D74B", opacity: 0.6 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#555",
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: { backgroundColor: "#32D74B", borderColor: "#32D74B" },
  checkMark: { color: "#000", fontWeight: "bold" },
  itemText: { color: "#FFF", fontSize: 16 },
  itemTextChecked: { color: "#8E8E93", textDecorationLine: "line-through" },
});
