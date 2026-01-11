import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from "react-native";
import { COLORS, LAYOUT, SPACING } from "../constants/Theme";
import { useCycleStore } from "../store/cycleStore";
import { getTacticalIntel } from "../utils/translator";
import TacticalCommsModal from "../components/TacticalCommsModal";

export default function IntelScreen({ navigation }: any) {
  const { lastPeriodDate, cycleLength, periodDuration } = useCycleStore();
  const intel = getTacticalIntel(lastPeriodDate, cycleLength, periodDuration);
  const [commsVisible, setCommsVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>{"< HQ"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FIELD GUIDE</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>ACTIVE RESOURCES</Text>

        {/* 1. LOGISTICS */}
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate("Inventory", { date: new Date().toISOString() })
          }
        >
          <View style={styles.iconBox}>
            <Text style={styles.icon}>📋</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>DAILY LOGISTICS</Text>
            <Text style={styles.cardSub}>
              Checklist for {intel.phase} Phase
            </Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        {/* 2. COMMS */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => setCommsVisible(true)}
        >
          <View style={styles.iconBox}>
            <Text style={styles.icon}>💬</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>TACTICAL COMMS</Text>
            <Text style={styles.cardSub}>Generate AI Message Drafts</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>ARCHIVES</Text>
        <TouchableOpacity
          style={[styles.card, { opacity: 0.5 }]}
          disabled={true}
        >
          <View style={[styles.iconBox, { backgroundColor: "#333" }]}>
            <Text style={styles.icon}>🗄️</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>HISTORY LOG</Text>
            <Text style={styles.cardSub}>Coming Soon</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Comms Modal lives here now */}
      <TacticalCommsModal
        visible={commsVisible}
        onClose={() => setCommsVisible(false)}
        phase={intel.phase}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: SPACING.m,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: { padding: SPACING.s },
  backText: { color: COLORS.subtext, fontWeight: "bold" },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  content: { padding: SPACING.m },
  sectionTitle: {
    color: COLORS.subtext,
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: SPACING.m,
    marginTop: SPACING.s,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    borderRadius: LAYOUT.borderRadius,
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.surfaceHighlight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.m,
  },
  icon: { fontSize: 24 },
  cardContent: { flex: 1 },
  cardTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardSub: { color: COLORS.subtext, fontSize: 12 },
  arrow: { color: COLORS.subtext, fontSize: 20 },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.m,
  },
});
