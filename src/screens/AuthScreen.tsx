import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import { auth } from "../lib/firebase";
import { COLORS, SPACING } from "../constants/Theme";

// Note: You need to get these IDs from Google Cloud Console
// and configure them in your app.json / GoogleService-Info.plist
const ANDROID_CLIENT_ID = "YOUR_ANDROID_CLIENT_ID";
const IOS_CLIENT_ID = "YOUR_IOS_CLIENT_ID";
const WEB_CLIENT_ID = "YOUR_WEB_CLIENT_ID";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Google Auth Request Hook
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
  });

  // Handle Google Response
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      setLoading(true);
      signInWithCredential(auth, credential).catch((e) => {
        setError(e.message);
        setLoading(false);
      });
    } else if (response?.type === "error") {
      setError("Google Sign-In failed.");
    }
  }, [response]);

  const handleAuth = async () => {
    if (!email || !password) return setError("Email and password required");
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (e: any) {
      // Friendly tactical error mapping
      if (e.code === "auth/user-not-found") setError("AGENT NOT FOUND");
      else if (e.code === "auth/wrong-password") setError("INVALID ACCESS KEY");
      else setError(e.message.toUpperCase());
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!request) {
      return Alert.alert(
        "Error",
        "Google Auth is not ready yet. Please check configuration."
      );
    }
    promptAsync();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.logo}>RED PROTOCOL</Text>
        <Text style={styles.subtitle}>
          {isLogin ? "SECURE LOGIN" : "RECRUIT ENROLLMENT"}
        </Text>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="AGENT EMAIL"
          placeholderTextColor="#444"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="ACCESS KEY"
          placeholderTextColor="#444"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.primaryBtnText}>
              {isLogin ? "AUTHORIZE" : "REGISTER"}
            </Text>
          )}
        </TouchableOpacity>

        {/* SOCIAL AUTH DIVIDER */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR AUTHENTICATE VIA</Text>
          <View style={styles.divider} />
        </View>

        {/* SOCIAL BUTTONS */}
        <View style={styles.socialContainer}>
          <TouchableOpacity
            style={styles.socialBtn}
            onPress={handleGoogleAuth}
            disabled={!request}
          >
            <Text style={styles.socialText}>GOOGLE</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.switchBtn}
          onPress={() => setIsLogin(!isLogin)}
        >
          <Text style={styles.switchText}>
            {isLogin ? "NEW AGENT? REGISTER HERE" : "ALREADY ENROLLED? LOGIN"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
  },
  content: { padding: SPACING.xl },
  logo: {
    color: COLORS.primary,
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 4,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    color: COLORS.subtext,
    fontSize: 10,
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 40,
  },
  errorBox: {
    backgroundColor: "rgba(255, 69, 58, 0.1)",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  errorText: {
    color: COLORS.primary,
    textAlign: "center",
    fontSize: 10,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  primaryBtn: {
    backgroundColor: COLORS.text,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  primaryBtnText: { color: "#000", fontWeight: "bold", letterSpacing: 2 },

  // Divider Styles
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
  divider: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: {
    color: COLORS.subtext,
    paddingHorizontal: 10,
    fontSize: 10,
    fontWeight: "bold",
  },

  // Social Styles
  socialContainer: { flexDirection: "row", gap: 15 },
  socialBtn: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  socialText: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 1,
  },

  switchBtn: { marginTop: 30, alignItems: "center" },
  switchText: { color: COLORS.subtext, fontSize: 12, fontWeight: "bold" },
});
