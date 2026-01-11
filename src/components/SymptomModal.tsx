import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AVAILABLE_INCIDENTS } from "../utils/radar";
import { format } from "date-fns";
import { useCycleStore } from "../store/cycleStore";

interface SymptomModalProps {
  visible: boolean;
  onClose: () => void;
  date: Date;
}

export default function SymptomModal({
  visible,
  onClose,
  date,
}: SymptomModalProps) {
  const { symptoms, toggleSymptom } = useCycleStore();
  const dateKey = format(date, "yyyy-MM-dd");
  const activeSymptoms = symptoms[dateKey] || [];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* UNIFIED HEADER STYLE */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>LOG NEW INTEL</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {format(date, "MMM dd").toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.instruction}>
            Tag distinct events to improve Radar predictions.
          </Text>

          <ScrollView
            style={styles.grid}
            contentContainerStyle={styles.gridContent}
          >
            {AVAILABLE_INCIDENTS.map((item) => {
              const isActive = activeSymptoms.includes(item);
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.tag, isActive && styles.activeTag]}
                  onPress={() => toggleSymptom(date, item)}
                >
                  <Text
                    style={[styles.tagText, isActive && styles.activeTagText]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>CONFIRM & SAVE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center", // Centered (Uniform Style)
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.85)", // Unified Dark Dim
  },
  modalView: {
    width: "90%",
    backgroundColor: "#1C1C1E",
    borderRadius: 16, // Unified Radius
    padding: 24,
    borderWidth: 1,
    borderColor: "#333",
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingBottom: 15,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  badge: {
    backgroundColor: "#333",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  instruction: {
    color: "#8E8E93",
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  grid: {
    marginBottom: 20,
  },
  gridContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  tag: {
    backgroundColor: "#111",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12, // Unified Tag Radius
    borderWidth: 1,
    borderColor: "#333",
  },
  activeTag: {
    backgroundColor: "#321414", // Red Tint for active
    borderColor: "#FF453A",
  },
  tagText: {
    color: "#666",
    fontSize: 12,
    fontWeight: "600",
  },
  activeTagText: {
    color: "#FF453A",
    fontWeight: "bold",
  },
  closeBtn: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  closeText: {
    color: "#000",
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
