import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { COLORS, LAYOUT, SPACING } from "../constants/Theme";

interface SupplyDropModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SupplyDropModal({
  visible,
  onClose,
}: SupplyDropModalProps) {
  const openApp = async (appName: "chowdeck" | "foodcourt") => {
    const config = {
      chowdeck: {
        name: "ChowDeck",
        scheme: "chowdeck://",
        storeUrl:
          Platform.OS === "ios"
            ? "https://apps.apple.com/us/search?term=chowdeck"
            : "market://search?q=chowdeck&c=apps",
      },
      foodcourt: {
        name: "Food Court",
        scheme: "foodcourt://",
        storeUrl:
          Platform.OS === "ios"
            ? "https://apps.apple.com/us/search?term=food+court"
            : "market://search?q=food+court&c=apps",
      },
    };
    const target = config[appName];
    try {
      const supported = await Linking.canOpenURL(target.scheme);
      if (supported) await Linking.openURL(target.scheme);
      else throw new Error("App not supported/installed");
    } catch (error) {
      await Linking.openURL(target.storeUrl);
    }
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>SUPPLY LINE SELECTOR</Text>
            <View style={styles.warningBadge}>
              <Text style={styles.warningText}>EMERGENCY</Text>
            </View>
          </View>

          <Text style={styles.subText}>
            Select delivery vector for immediate resupply.
          </Text>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: "#0C9463" }]}
              onPress={() => openApp("chowdeck")}
            >
              <Text style={styles.icon}>🛵</Text>
              <View>
                <Text style={[styles.optionTitle, { color: "#0C9463" }]}>
                  CHOWDECK
                </Text>
                <Text style={styles.optionSub}>Direct Delivery</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: "#FF6B6B" }]}
              onPress={() => openApp("foodcourt")}
            >
              <Text style={styles.icon}>🥡</Text>
              <View>
                <Text style={[styles.optionTitle, { color: "#FF6B6B" }]}>
                  FOOD COURT
                </Text>
                <Text style={styles.optionSub}>Rapid Response</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>ABORT MISSION</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  modalView: {
    width: "85%",
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  warningBadge: {
    backgroundColor: "#321414",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  warningText: { color: COLORS.primary, fontSize: 10, fontWeight: "bold" },
  subText: {
    color: COLORS.subtext,
    fontSize: 14,
    marginBottom: 25,
    textAlign: "center",
  },
  optionsContainer: { width: "100%", marginBottom: 10 },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 15,
  },
  icon: { fontSize: 32, marginRight: 15 },
  optionTitle: { fontSize: 18, fontWeight: "bold", letterSpacing: 1 },
  optionSub: { color: "#666", fontSize: 12 },
  cancelBtn: { paddingVertical: 10, marginTop: 10 },
  cancelText: {
    color: COLORS.subtext,
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 1,
  },
});
