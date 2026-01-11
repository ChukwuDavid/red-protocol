import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { format, differenceInDays } from "date-fns";
import { COLORS, LAYOUT, SPACING } from "../constants/Theme";
import { useCycleStore } from "../store/cycleStore";

interface HistoryDetailModalProps {
  visible: boolean;
  onClose: () => void;
  dateStr: string | null;
}

export default function HistoryDetailModal({
  visible,
  onClose,
  dateStr,
}: HistoryDetailModalProps) {
  const { history, symptoms, lastPeriodDate, cycleLength, periodDuration } =
    useCycleStore();

  if (!dateStr) return null;

  const date = new Date(dateStr);
  const dateKey = format(date, "yyyy-MM-dd");

  // 1. Get Data for this date
  const daySymptoms = symptoms[dateKey] || [];
  const dayInventory = history[dateKey] || [];
  const checkedItems = dayInventory.filter((i) => i.checked);

  // 2. Calculate Phase for this specific date
  const getPhase = () => {
    if (!lastPeriodDate) return { name: "UNKNOWN", color: COLORS.subtext };
    const lastStart = new Date(lastPeriodDate);
    const daysDiff = differenceInDays(date, lastStart);
    const cycleDay =
      daysDiff >= 0
        ? daysDiff % cycleLength
        : (cycleLength + (daysDiff % cycleLength)) % cycleLength;

    if (cycleDay < periodDuration)
      return { name: "MENSTRUATION", color: COLORS.primary };
    if (cycleDay < 12) return { name: "FOLLICULAR", color: COLORS.success };
    if (cycleDay < 16) return { name: "OVULATION", color: COLORS.purple };
    return { name: "LUTEAL", color: COLORS.warning };
  };

  const phase = getPhase();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* HEADER */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>MISSION LOG</Text>
              <Text style={styles.dateText}>
                {format(date, "MMMM dd, yyyy").toUpperCase()}
              </Text>
            </View>
            <View style={[styles.badge, { borderColor: phase.color }]}>
              <Text style={[styles.badgeText, { color: phase.color }]}>
                {phase.name}
              </Text>
            </View>
          </View>

          <ScrollView style={styles.content}>
            {/* SECTION 1: INTEL (SYMPTOMS) */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>INTEL REPORTS (SYMPTOMS)</Text>
              {daySymptoms.length > 0 ? (
                <View style={styles.tagRow}>
                  {daySymptoms.map((s, i) => (
                    <View key={i} style={styles.tag}>
                      <Text style={styles.tagText}>{s}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyText}>No intel recorded.</Text>
              )}
            </View>

            {/* SECTION 2: LOGISTICS (CHECKLIST) */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SUPPLY MANIFEST</Text>
              {checkedItems.length > 0 ? (
                <View style={styles.list}>
                  {checkedItems.map((item, i) => (
                    <View key={i} style={styles.listItem}>
                      <Text style={styles.check}>✓</Text>
                      <Text style={styles.listText}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyText}>No supplies checked.</Text>
              )}
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>CLOSE FILE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  modalView: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: COLORS.surface,
    borderRadius: LAYOUT.borderRadius,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 15,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1,
  },
  dateText: {
    color: COLORS.subtext,
    fontSize: 12,
    marginTop: 4,
    letterSpacing: 1,
  },
  badge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: { fontSize: 10, fontWeight: "bold" },
  content: { marginBottom: 10 },
  section: { marginBottom: 20 },
  sectionTitle: {
    color: COLORS.subtext,
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 10,
    fontWeight: "bold",
  },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    backgroundColor: COLORS.surfaceHighlight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: { color: COLORS.text, fontSize: 12 },
  list: { gap: 8 },
  listItem: { flexDirection: "row", alignItems: "center" },
  check: { color: COLORS.success, fontWeight: "bold", marginRight: 8 },
  listText: { color: COLORS.text, fontSize: 14 },
  emptyText: { color: COLORS.subtext, fontStyle: "italic", fontSize: 12 },
  closeBtn: {
    backgroundColor: COLORS.text,
    padding: 16,
    borderRadius: LAYOUT.borderRadius,
    alignItems: "center",
    marginTop: 10,
  },
  closeText: { color: "#000", fontWeight: "bold", letterSpacing: 1 },
});
