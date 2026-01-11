import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from "react-native";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  differenceInDays,
} from "date-fns";
import { COLORS, LAYOUT, SPACING } from "../constants/Theme";

interface CalendarWidgetProps {
  lastPeriodDate: string | null;
  cycleLength: number;
  periodDuration: number;
  symptoms?: Record<string, string[]>;
  onDateSelect: (date: Date) => void;
  onViewLog?: (date: Date) => void;
  onLogIncident?: (date: Date) => void;
  accentColor: string;
}

// CALCULATION FIX:
// Screen Width
// - Dashboard Padding (SPACING.l * 2) -> 24 * 2 = 48
// - Widget Internal Padding (10 * 2) -> 20
// - Safety Buffer (2)
// Total Deduction = 70px
const SCREEN_WIDTH = Dimensions.get("window").width;
const WIDGET_PADDING = 10;
const DASHBOARD_PADDING = SPACING.l;
const AVAILABLE_WIDTH =
  SCREEN_WIDTH - DASHBOARD_PADDING * 2 - WIDGET_PADDING * 2;
const CELL_WIDTH = Math.floor(AVAILABLE_WIDTH / 7);

export default function CalendarWidget({
  lastPeriodDate,
  cycleLength,
  periodDuration,
  symptoms = {},
  onDateSelect,
  onViewLog,
  onLogIncident,
  accentColor,
}: CalendarWidgetProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getDayStatusColor = (date: Date) => {
    if (!lastPeriodDate) return "transparent";
    const lastStart = new Date(lastPeriodDate);
    const daysSinceStart = differenceInDays(date, lastStart);

    const cycleDay =
      daysSinceStart >= 0
        ? daysSinceStart % cycleLength
        : (cycleLength + (daysSinceStart % cycleLength)) % cycleLength;

    if (cycleDay < periodDuration) return COLORS.primary;
    if (cycleDay < 12) return COLORS.success;
    if (cycleDay < 16) return COLORS.purple;
    return COLORS.warning;
  };

  const handleDayPress = (day: Date) => {
    setSelectedDate(day);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDate(null);
  };

  const handleOptionSelect = (action: (date: Date) => void) => {
    if (selectedDate) {
      action(selectedDate);
      closeModal();
    }
  };

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.monthText}>{format(today, "MMMM yyyy")}</Text>
      </View>

      {/* DAYS OF WEEK */}
      <View style={styles.row}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekDayCell}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* CALENDAR GRID */}
      <View style={styles.grid}>
        {calendarDays.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, today);
          const statusColor = getDayStatusColor(day);

          const dateKey = format(day, "yyyy-MM-dd");
          const hasSymptoms = symptoms[dateKey] && symptoms[dateKey].length > 0;

          return (
            <TouchableOpacity
              key={day.toString()}
              style={[
                styles.dayCell,
                // Phase Highlight (Background Fill)
                isCurrentMonth && { backgroundColor: statusColor + "15" },
                // Today Circle
                isToday && styles.todayCell,
              ]}
              onPress={() => handleDayPress(day)}
            >
              <Text
                style={[
                  styles.dayText,
                  !isCurrentMonth && styles.dimText,
                  // Text color logic
                  isCurrentMonth && { color: isToday ? "#000" : "#FFF" },
                  isToday && { fontWeight: "bold" },
                ]}
              >
                {format(day, "d")}
              </Text>

              {/* Dots Container (Symptom Marker) */}
              <View style={styles.dotsContainer}>
                {isCurrentMonth && hasSymptoms && (
                  <View
                    style={[
                      styles.symptomDot,
                      { backgroundColor: isToday ? "#000" : COLORS.purple },
                    ]}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* TACTICAL ACTION MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>TACTICAL ACTIONS</Text>
              <View style={styles.modalBadge}>
                <Text style={styles.modalBadgeText}>
                  {selectedDate
                    ? format(selectedDate, "MMM dd").toUpperCase()
                    : ""}
                </Text>
              </View>
            </View>

            <View style={styles.optionsContainer}>
              {onViewLog && (
                <TouchableOpacity
                  style={styles.optionBtn}
                  onPress={() => handleOptionSelect(onViewLog)}
                >
                  <Text style={styles.optionIcon}>📋</Text>
                  <Text style={styles.optionText}>VIEW CHECKLIST</Text>
                </TouchableOpacity>
              )}

              {onLogIncident && (
                <TouchableOpacity
                  style={styles.optionBtn}
                  onPress={() => handleOptionSelect(onLogIncident)}
                >
                  <Text style={styles.optionIcon}>⚠️</Text>
                  <Text style={styles.optionText}>LOG SYMPTOMS</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.optionBtn, styles.dangerBtn]}
                onPress={() => handleOptionSelect(onDateSelect)}
              >
                <Text style={styles.optionIcon}>🩸</Text>
                <Text style={[styles.optionText, styles.dangerText]}>
                  LOG PERIOD START
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
              <Text style={styles.closeText}>CANCEL OPERATION</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: COLORS.surface,
    borderRadius: LAYOUT.borderRadius,
    paddingVertical: 20,
    paddingHorizontal: WIDGET_PADDING,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  monthText: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start", // Changed to flex-start for grid alignment
    marginBottom: 10,
    flexWrap: "wrap",
  },
  weekDayCell: {
    width: CELL_WIDTH,
    alignItems: "center",
  },
  weekDayText: {
    color: COLORS.subtext,
    fontSize: 12,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start", // Aligns perfectly with the week row
    // Remove rowGap if using fixed height cells, but keep for breathing room
    // rowGap: 2,
  },
  dayCell: {
    width: CELL_WIDTH,
    height: 50, // Increased height for containment
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2, // explicit margin instead of rowGap for consistency
    borderRadius: 25, // Perfectly round for Today selection
  },
  todayCell: {
    backgroundColor: COLORS.text,
    borderRadius: 50,
  },
  dayText: {
    fontSize: 16,
    color: COLORS.text,
  },
  dimText: {
    color: "#333",
  },
  dotsContainer: {
    position: "absolute", // Absolute position to not shift the number
    bottom: 8,
    flexDirection: "row",
    gap: 2,
  },
  symptomDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  // Modal Styles
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  modalView: {
    width: "85%",
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 15,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  modalBadge: {
    backgroundColor: COLORS.surfaceHighlight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  modalBadgeText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: "bold",
  },
  optionsContainer: {
    width: "100%",
    marginBottom: 15,
  },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  optionIcon: { fontSize: 18, marginRight: 15, color: COLORS.text },
  optionText: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 1,
  },
  dangerBtn: {
    backgroundColor: COLORS.danger,
    borderColor: COLORS.primary,
  },
  dangerText: { color: COLORS.primary },
  closeBtn: { paddingVertical: 10, marginTop: 5 },
  closeText: {
    color: COLORS.subtext,
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 1,
  },
});
