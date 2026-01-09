import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useCycleStore } from "./src/store/cycleStore";

export default function App() {
  // Grab the data and actions from our store
  const { lastPeriodDate, logPeriodStart, getDaysUntilNext, getCurrentPhase } =
    useCycleStore();

  const daysUntil = getDaysUntilNext();
  const phase = getCurrentPhase();

  // "Midnight Tactical" Colors
  const bgColor = "#0D0D0D";
  const cardColor = "#1C1C1E";
  const accentColor =
    phase === "LUTEAL"
      ? "#FFD60A"
      : phase === "MENSTRUATION"
      ? "#FF453A"
      : "#32D74B";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      <StatusBar barStyle="light-content" />

      <View
        style={{
          flex: 1,
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* THE HUD DISPLAY */}
        <Text
          style={{
            color: "#8E8E93",
            fontSize: 16,
            letterSpacing: 2,
            marginBottom: 10,
          }}
        >
          STATUS MONITOR
        </Text>

        <View
          style={{
            width: 250,
            height: 250,
            borderRadius: 125,
            borderWidth: 4,
            borderColor: cardColor,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <Text
            style={{ color: accentColor, fontSize: 60, fontWeight: "bold" }}
          >
            {lastPeriodDate ? daysUntil : "--"}
          </Text>
          <Text style={{ color: "#8E8E93", fontSize: 14 }}>DAYS REMAINING</Text>
        </View>

        {/* STATUS READOUT */}
        <View
          style={{
            backgroundColor: cardColor,
            padding: 20,
            borderRadius: 12,
            width: "100%",
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: "600",
              marginBottom: 5,
            }}
          >
            Current Phase: {phase}
          </Text>
          <Text style={{ color: "#8E8E93" }}>
            {phase === "LUTEAL"
              ? "⚠️ Caution: Patience levels dropping."
              : phase === "MENSTRUATION"
              ? "🔴 Alert: Maintenance required."
              : phase === "OVULATION"
              ? "🟣 Intel: High energy detected."
              : "Waiting for input..."}
          </Text>
        </View>

        {/* ACTION BUTTON */}
        <TouchableOpacity
          onPress={() => logPeriodStart(new Date())}
          style={{
            backgroundColor: "#333",
            paddingVertical: 15,
            paddingHorizontal: 40,
            borderRadius: 30,
            borderWidth: 1,
            borderColor: "#555",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            Log Cycle Start (Today)
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
