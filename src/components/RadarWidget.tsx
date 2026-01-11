import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { format } from "date-fns";
import { RadarPrediction } from "../utils/radar";

interface RadarWidgetProps {
  predictions: RadarPrediction[];
}

export default function RadarWidget({ predictions }: RadarWidgetProps) {
  if (predictions.length === 0) return null;

  // We only show the nearest prediction to avoid clutter
  const topPrediction = predictions[0];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.icon}>📡</Text>
        <Text style={styles.title}>PATTERN RADAR DETECTED</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.timeBox}>
          <Text style={styles.timeValue}>T-{topPrediction.daysFromNow}D</Text>
          <Text style={styles.timeLabel}>
            {format(topPrediction.date, "MMM d")}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.details}>
          <Text style={styles.warningLabel}>PROJECTED INCIDENTS:</Text>
          <View style={styles.tagRow}>
            {/* FIX: Added explicit types to callback parameters */}
            {topPrediction.incidents.map((incident: string, index: number) => (
              <View key={index} style={styles.incidentTag}>
                <Text style={styles.incidentText}>
                  {incident.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.advice}>Stock supplies immediately.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 69, 58, 0.5)", // Red tint
    backgroundColor: "rgba(255, 69, 58, 0.05)",
    borderRadius: 12,
    padding: 15,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    fontSize: 16,
    marginRight: 10,
  },
  title: {
    color: "#FF453A",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeBox: {
    alignItems: "center",
    paddingRight: 15,
  },
  timeValue: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  timeLabel: {
    color: "#8E8E93",
    fontSize: 10,
    fontWeight: "bold",
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: "#FF453A",
    opacity: 0.3,
    marginRight: 15,
  },
  details: {
    flex: 1,
  },
  warningLabel: {
    color: "#FF453A",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 5,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginBottom: 5,
  },
  incidentTag: {
    backgroundColor: "#321414",
    borderWidth: 1,
    borderColor: "#FF453A",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  incidentText: {
    color: "#FF453A",
    fontSize: 10,
    fontWeight: "bold",
  },
  advice: {
    color: "#8E8E93",
    fontSize: 10,
    fontStyle: "italic",
  },
});
