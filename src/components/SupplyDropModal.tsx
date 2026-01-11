import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  Image,
} from "react-native";

interface SupplyDropModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SupplyDropModal({
  visible,
  onClose,
}: SupplyDropModalProps) {
  const openApp = async (appName: "chowdeck" | "foodcourt") => {
    // 1. CONFIGURATION (You must replace these with real IDs later)
    const config = {
      chowdeck: {
        name: "ChowDeck",
        scheme: "chowdeck://", // Hypothetical scheme
        // Fallback to store search if specific ID is unknown
        storeUrl:
          Platform.OS === "ios"
            ? "https://apps.apple.com/us/search?term=chowdeck"
            : "market://search?q=chowdeck&c=apps",
      },
      foodcourt: {
        name: "Food Court",
        scheme: "foodcourt://", // Hypothetical scheme
        storeUrl:
          Platform.OS === "ios"
            ? "https://apps.apple.com/us/search?term=food+court"
            : "market://search?q=food+court&c=apps",
      },
    };

    const target = config[appName];

    try {
      // 2. CHECK IF INSTALLED
      // Note: On Android 11+, canOpenURL often returns false even if installed due to privacy.
      // We try to open it directly first in a try/catch block.
      const supported = await Linking.canOpenURL(target.scheme);

      if (supported) {
        await Linking.openURL(target.scheme);
      } else {
        // 3. FALLBACK TO STORE
        // If canOpenURL failed, or we just want to force store logic
        throw new Error("App not supported/installed");
      }
    } catch (error) {
      console.log(`Failed to open ${target.name}, redirecting to store...`);
      // Open the App Store / Play Store page
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
            {/* OPTION 1: CHOWDECK */}
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

            {/* OPTION 2: FOOD COURT */}
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
    backgroundColor: "rgba(0,0,0,0.85)",
  },
  modalView: {
    width: "85%",
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#333",
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
    color: "#FFF",
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
    borderColor: "#FF453A",
  },
  warningText: {
    color: "#FF453A",
    fontSize: 10,
    fontWeight: "bold",
  },
  subText: {
    color: "#8E8E93",
    fontSize: 14,
    marginBottom: 25,
    textAlign: "center",
  },
  optionsContainer: {
    width: "100%",
    marginBottom: 10,
  },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 15,
  },
  icon: {
    fontSize: 32,
    marginRight: 15,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  optionSub: {
    color: "#666",
    fontSize: 12,
  },
  cancelBtn: {
    paddingVertical: 10,
    marginTop: 10,
  },
  cancelText: {
    color: "#555",
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 1,
  },
});
