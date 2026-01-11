import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
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

    if (cycleDay < periodDuration) return "#FF453A";
    if (cycleDay < 12) return "#32D74B";
    if (cycleDay < 16) return "#BF5AF2";
    return "#FFD60A";
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
        <Text style={[styles.monthText, { color: accentColor }]}>
          {format(today, "MMMM yyyy").toUpperCase()}
        </Text>
        <Text style={styles.legendText}>TAP DATE FOR OPTIONS</Text>
      </View>

      <View style={styles.row}>
        {weekDays.map((day, index) => (
          <Text key={index} style={styles.weekDayText}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {calendarDays.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, today);
          const statusColor = getDayStatusColor(day);
          const focusOpacity = isToday ? 1 : isCurrentMonth ? 0.4 : 0.15;

          const dateKey = format(day, "yyyy-MM-dd");
          const hasSymptoms = symptoms[dateKey] && symptoms[dateKey].length > 0;

          const dayStyle = [
            styles.dayCell,
            {
              backgroundColor: isCurrentMonth
                ? statusColor + "33"
                : "transparent",
              opacity: focusOpacity,
            },
          ];

          return (
            <TouchableOpacity
              key={day.toString()}
              style={dayStyle}
              onPress={() => handleDayPress(day)}
            >
              <Text
                style={[
                  styles.dayText,
                  { color: isCurrentMonth ? "#FFF" : "#555" },
                  isToday && {
                    fontWeight: "bold",
                    color: "#FFF",
                    fontSize: 16,
                  },
                ]}
              >
                {format(day, "d")}
              </Text>

              <View style={styles.dotsContainer}>
                {isCurrentMonth && (
                  <View
                    style={[styles.dot, { backgroundColor: statusColor }]}
                  />
                )}

                {isCurrentMonth && hasSymptoms && (
                  <View
                    style={[styles.symptomDot, { backgroundColor: "#BF5AF2" }]}
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
                  <Text style={styles.optionText}>LOG INCIDENT</Text>
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
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  monthText: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  legendText: {
    color: "#555",
    fontSize: 10,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  weekDayText: {
    color: "#8E8E93",
    fontSize: 12,
    fontWeight: "bold",
    width: 30,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  dayCell: {
    width: "13%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 2,
    marginTop: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  symptomDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: "#FFF",
  },
  // Modal Styles
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.85)",
  },
  modalView: {
    width: "85%",
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingBottom: 15,
  },
  modalTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  modalBadge: {
    backgroundColor: "#333",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  modalBadgeText: {
    color: "#FFF",
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
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 10,
  },
  optionIcon: {
    fontSize: 18,
    marginRight: 15,
  },
  optionText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 1,
  },
  dangerBtn: {
    backgroundColor: "rgba(50, 20, 20, 0.3)",
    borderColor: "#FF453A",
  },
  dangerText: {
    color: "#FF453A",
  },
  closeBtn: {
    paddingVertical: 10,
    marginTop: 5,
  },
  closeText: {
    color: "#555",
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 1,
  },
});
