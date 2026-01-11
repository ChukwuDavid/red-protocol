import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Clipboard,
} from "react-native";
import { generateTacticalMessage } from "../utils/commsGenerator";

interface TacticalCommsModalProps {
  visible: boolean;
  onClose: () => void;
  phase: string;
}

export default function TacticalCommsModal({
  visible,
  onClose,
  phase,
}: TacticalCommsModalProps) {
  const [message, setMessage] = useState("");

  // Regenerate message when modal opens or phase changes
  useEffect(() => {
    if (visible) {
      regenerate();
    }
  }, [visible, phase]);

  const regenerate = () => {
    const msg = generateTacticalMessage(phase);
    setMessage(msg);
  };

  const copyToClipboard = () => {
    Clipboard.setString(message);
    Alert.alert("COPIED", "Intel copied to clipboard. Paste in messaging app.");
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.headerText}>TACTICAL DIPLOMAT</Text>
            <View
              style={[styles.badge, { backgroundColor: getPhaseColor(phase) }]}
            >
              <Text style={styles.badgeText}>{phase}</Text>
            </View>
          </View>

          <Text style={styles.label}>GENERATED INTEL:</Text>

          <View style={styles.messageBox}>
            <Text style={styles.messageText}>"{message}"</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={regenerate}>
              <Text style={styles.secondaryText}>RE-ROLL 🎲</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={copyToClipboard}
            >
              <Text style={styles.primaryText}>COPY & EXECUTE 📋</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>DISMISS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const getPhaseColor = (phase: string) => {
  switch (phase) {
    case "MENSTRUATION":
      return "#FF453A";
    case "FOLLICULAR":
      return "#32D74B";
    case "OVULATION":
      return "#BF5AF2";
    default:
      return "#FFD60A";
  }
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)", // Dark dim background
  },
  modalView: {
    width: "90%",
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 10,
  },
  label: {
    color: "#8E8E93",
    fontSize: 12,
    marginBottom: 10,
    letterSpacing: 1,
  },
  messageBox: {
    backgroundColor: "#000",
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#FFF",
    marginBottom: 20,
  },
  messageText: {
    color: "#FFF",
    fontSize: 18,
    fontStyle: "italic",
    lineHeight: 26,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 10,
  },
  primaryText: {
    color: "#000",
    fontWeight: "bold",
  },
  secondaryBtn: {
    flex: 0.5,
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  closeBtn: {
    alignItems: "center",
    padding: 10,
  },
  closeText: {
    color: "#8E8E93",
    fontSize: 12,
  },
});
