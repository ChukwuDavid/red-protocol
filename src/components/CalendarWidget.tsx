import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  AlertButton,
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

interface CalendarWidgetProps {
  lastPeriodDate: string | null;
  cycleLength: number;
  periodDuration: number;
  onDateSelect: (date: Date) => void;
  onViewLog?: (date: Date) => void; // Optional prop
  accentColor: string;
}

export default function CalendarWidget({
  lastPeriodDate,
  cycleLength,
  periodDuration,
  onDateSelect,
  onViewLog,
  accentColor,
}: CalendarWidgetProps) {
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

    // Calculate cycle day allowing for past/future projection
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
    // Dynamically build the options based on what is available
    const options: AlertButton[] = [];

    // 1. Only add the "View Log" button if the parent component provided the function
    if (onViewLog) {
      options.push({
        text: "View Daily Checklist",
        onPress: () => onViewLog(day),
      });
    }

    // 2. Always add the standard options
    options.push(
      {
        text: "Set Period Start",
        onPress: () => onDateSelect(day),
        style: "destructive",
      },
      {
        text: "Cancel",
        style: "cancel",
      }
    );

    Alert.alert(
      `Options for ${format(day, "MMM d")}`,
      "Choose an action",
      options
    );
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

          // Aesthetic Focus Effect:
          // Today = Full Opacity (1.0)
          // Current Month = Dimmed (0.4)
          // Other Months = Faded (0.15)
          const focusOpacity = isToday ? 1 : isCurrentMonth ? 0.4 : 0.15;

          const dayStyle = [
            styles.dayCell,
            // Removed border style (styles.todayCell)
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
                  }, // Slight size bump for focus
                ]}
              >
                {format(day, "d")}
              </Text>

              {isCurrentMonth && (
                <View style={[styles.dot, { backgroundColor: statusColor }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
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
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});
