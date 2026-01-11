import React from "react";
import { View, Text, StyleSheet } from "react-native";

// We import the type so we know what data to expect
import { TacticalStatus } from "../utils/translator";

interface TacticalCardProps {
  intel: TacticalStatus;
}

export default function TacticalCard({ intel }: TacticalCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={[styles.statusTitle, { color: intel.color }]}>
          {intel.weather.toUpperCase()}
        </Text>
        <Text style={styles.phaseLabel}>{intel.phase}</Text>
      </View>

      <Text style={styles.message}>{intel.message}</Text>

      <View style={styles.divider} />

      <Text style={styles.actionLabel}>RECOMMENDED ACTION:</Text>
      <Text style={styles.actionItem}>{intel.actionItem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1C1C1E",
    width: "100%",
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  phaseLabel: {
    color: "#555",
    fontSize: 12,
    fontWeight: "bold",
  },
  message: {
    color: "#DDD",
    fontSize: 16,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 15,
  },
  actionLabel: {
    color: "#8E8E93",
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 5,
  },
  actionItem: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
