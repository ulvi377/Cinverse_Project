import LocalizedText from "../components/LocalizedText";

import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Screen from "../components/Screen";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function RegisterScreen() {
  const { register } = useAuth();
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    console.log("REGISTER BUTTON PRESSED");
    console.log("Name:", name);
    console.log("Email:", email);

    if (!name.trim() || !email.includes("@") || password.length < 6) {
      console.log("REGISTER VALIDATION FAILED");
      return Alert.alert(
        "Yoxlama",
        "Ad, düzgün email və minimum 6 simvolluq şifrə daxil et."
      );
    }

    try {
      setBusy(true);
      setError("");

      console.log("SENDING REGISTER REQUEST");

      await register(name, email, password);

      console.log("REGISTER SUCCESS");

      router.replace("/(tabs)");
    } catch (e) {
      console.log("REGISTER ERROR:", e);

      const message = e instanceof Error ? e.message : "Xəta baş verdi.";
      setError(message);
      Alert.alert("Qeydiyyat alınmadı", message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.logoIcon}>
        <Ionicons name="film" size={24} color="#FFFFFF" />
      </View>

      <LocalizedText style={styles.logo}>
        Join the <LocalizedText style={styles.accent}>universe.</LocalizedText>
      </LocalizedText>

      <LocalizedText style={styles.sub}>
        Create your Netflix account and build a collection of stories you love.
      </LocalizedText>

      <LocalizedText style={styles.fieldLabel}>YOUR NAME</LocalizedText>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Full name"
        placeholderTextColor={colors.muted}
        style={styles.input}
      />

      <LocalizedText style={styles.fieldLabel}>EMAIL ADDRESS</LocalizedText>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <LocalizedText style={styles.fieldLabel}>PASSWORD</LocalizedText>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="At least 6 characters"
        placeholderTextColor={colors.muted}
        secureTextEntry
        style={styles.input}
      />

      {error ? <LocalizedText style={styles.error}>{error}</LocalizedText> : null}

      <Pressable
        onPress={submit}
        disabled={busy}
        style={styles.button}
      >
        <LocalizedText style={styles.buttonText}>
          {busy ? "Creating account..." : "Create account"}
        </LocalizedText>
        <Ionicons name="arrow-forward" color="#FFFFFF" size={17} />
      </Pressable>

      <LocalizedText onPress={() => router.back()} style={styles.footer}>
        Already a member? <LocalizedText style={styles.accent}>Sign in</LocalizedText>
      </LocalizedText>
    </Screen>
  );
}

const makeStyles = (
  c: ReturnType<typeof import("../context/ThemeContext").useTheme>["colors"]
) =>
  StyleSheet.create({
    error: {
      color: "#FF6B6B",
      fontSize: 11,
      lineHeight: 17,
      marginTop: 8
    },
    screen: {
      justifyContent: "center",
      padding: 25
    },
    logoIcon: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: c.purple,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24
    },
    logo: {
      color: c.text,
      fontSize: 29,
      fontWeight: "900",
      letterSpacing: -0.7
    },
    accent: {
      color: c.purple
    },
    sub: {
      color: c.muted,
      fontSize: 11,
      lineHeight: 18,
      marginTop: 10,
      marginBottom: 23
    },
    fieldLabel: {
      color: c.muted,
      fontSize: 8,
      letterSpacing: 1.5,
      fontWeight: "900",
      marginBottom: 8,
      marginTop: 8
    },
    input: {
      backgroundColor: c.surface,
      color: c.text,
      borderRadius: 14,
      padding: 16,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: c.border,
      fontSize: 12
    },
    button: {
      backgroundColor: c.purple,
      borderRadius: 14,
      padding: 16,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 10,
      marginTop: 13
    },
    buttonText: {
      color: "#FFFFFF",
      fontWeight: "900",
      fontSize: 12
    },
    footer: {
      color: c.muted,
      textAlign: "center",
      marginTop: 23,
      fontSize: 10
    }
  });
