import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, LAYOUT, SPACING } from "../constants/Theme";
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
        <View style={[styles.phaseBadge, { borderColor: intel.color }]}>
          <Text style={[styles.phaseLabel, { color: intel.color }]}>
            {intel.phase}
          </Text>
        </View>
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
    backgroundColor: COLORS.surface,
    width: "100%",
    padding: LAYOUT.cardPadding,
    borderRadius: LAYOUT.borderRadius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.m,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  phaseBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  phaseLabel: {
    fontSize: 10,
    fontWeight: "bold",
  },
  message: {
    color: "#DDD",
    fontSize: 16,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.m,
  },
  actionLabel: {
    color: COLORS.subtext,
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 5,
  },
  actionItem: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },
});
