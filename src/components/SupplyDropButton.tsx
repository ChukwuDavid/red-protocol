import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Linking,
  Alert,
  Platform,
} from "react-native";

interface SupplyDropProps {
  appName?: "chowdeck" | "foodcourt" | "uber";
}

export default function SupplyDropButton({
  appName = "chowdeck",
}: SupplyDropProps) {
  const handlePress = async () => {
    // 1. Define the search query (Tactical Supplies)
    const query = "Chocolate ice cream comfort food";
    const encodedQuery = encodeURIComponent(query);

    // 2. Define URLs for specific apps
    // Note: Deep link schemes can vary. We default to web search fallback if app fails.
    let url = "";

    if (appName === "chowdeck") {
      // ChowDeck doesn't have a public search API doc, so we default to opening the app or site
      // Trying a generic web fallback for specific items if app scheme isn't known
      url = `https://chowdeck.com/search?q=${encodedQuery}`;
    } else if (appName === "foodcourt") {
      url = `https://www.foodcourt.app/`; // General open
    } else {
      // Fallback to Google Maps or generic search nearby
      url = `https://www.google.com/maps/search/chocolate+delivery+near+me`;
    }

    // 3. Attempt to open
    const supported = await Linking.canOpenURL(url);

    if (supported || Platform.OS === "web") {
      await Linking.openURL(url);
    } else {
      // If the specific app link fails, fall back to a generic browser search
      const fallbackUrl = `https://www.google.com/search?q=${encodedQuery}+delivery+near+me`;
      await Linking.openURL(fallbackUrl);
    }
  };

  const confirmDrop = () => {
    Alert.alert(
      "CONFIRM SUPPLY DROP",
      "Initiating emergency protocol. This will open delivery channels for immediate resupply.",
      [
        { text: "ABORT", style: "cancel" },
        { text: "EXECUTE", onPress: handlePress, style: "destructive" },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={confirmDrop}
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
    // In a real app we might use an image background for hazard stripes,
    // but this is a solid color for simplicity.
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
