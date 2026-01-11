import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

interface SupplyDropProps {
  onPress: () => void; // Now just accepts a click handler
  appName?: string; // Kept for backward compatibility but unused for logic now
}

export default function SupplyDropButton({ onPress }: SupplyDropProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.border}>
        <View style={styles.stripes} />
        <View style={styles.content}>
          <Text style={styles.icon}>🚁</Text>
          <View>
            <Text style={styles.title}>SUPPLY DROP</Text>
            <Text style={styles.subtitle}>INITIATE EMERGENCY PROTOCOL</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 10,
  },
  border: {
    backgroundColor: "#321414", // Dark Red background
    borderColor: "#FF453A", // Bright Red Border
    borderWidth: 2,
    borderRadius: 12,
    borderStyle: "dashed", // Hazard style
    padding: 3,
  },
  stripes: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 69, 58, 0.1)",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    backgroundColor: "rgba(0,0,0,0.3)", // Darken the inside
    borderRadius: 8,
  },
  icon: {
    fontSize: 32,
    marginRight: 15,
  },
  title: {
    color: "#FF453A",
    fontSize: 20,
    fontWeight: "900", // Heavy bold
    letterSpacing: 1,
  },
  subtitle: {
    color: "#FF453A",
    fontSize: 10,
    fontWeight: "bold",
    opacity: 0.8,
    letterSpacing: 2,
  },
});
