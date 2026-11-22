import LocalizedText from "../components/LocalizedText";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Screen from "../components/Screen";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async () => {
    if (!email.includes("@") || password.length < 6) return Alert.alert("Yoxlama", "Düzgün email və minimum 6 simvolluq şifrə daxil et.");
    try { setBusy(true); setError(""); await login(email, password); router.replace("/(tabs)"); }
    catch (e) { const message = e instanceof Error ? e.message : "Xəta baş verdi."; setError(message); Alert.alert("Giriş alınmadı", message); }
    finally { setBusy(false); }
  };
  return <Screen style={styles.screen}>
    <View style={styles.orb} />
    <View style={styles.content}>
      <View style={styles.logoIcon}><Ionicons name="film" size={25} color="#FFFFFF" /></View>
      <LocalizedText style={styles.logo}>NETFLIX</LocalizedText>
      <LocalizedText style={styles.eyebrow}>YOUR NEXT CHAPTER BEGINS HERE</LocalizedText>
      <LocalizedText style={styles.heading}>Welcome{ "\n" }<LocalizedText style={styles.accent}>back.</LocalizedText></LocalizedText>
      <LocalizedText style={styles.sub}>Sign in and pick up where your movie journey left off.</LocalizedText>
      <LocalizedText style={styles.fieldLabel}>EMAIL ADDRESS</LocalizedText>
      <TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor={colors.muted} autoCapitalize="none" keyboardType="email-address" style={styles.input} />
      <LocalizedText style={styles.fieldLabel}>PASSWORD</LocalizedText>
      <TextInput value={password} onChangeText={setPassword} placeholder="Enter your password" placeholderTextColor={colors.muted} secureTextEntry style={styles.input} />
      {error ? <LocalizedText style={styles.error}>{error}</LocalizedText> : null}
      <Pressable onPress={submit} disabled={busy} style={styles.button}><LocalizedText style={styles.buttonText}>{busy ? "Please wait..." : "Sign in"}</LocalizedText><Ionicons name="arrow-forward" color="#FFFFFF" size={17} /></Pressable>
      <LocalizedText onPress={() => router.push("/register")} style={styles.footer}>New to Netflix? <LocalizedText style={styles.accent}>Create an account</LocalizedText></LocalizedText>
    </View>
  </Screen>;
}
const makeStyles = (c: ReturnType<typeof import("../context/ThemeContext").useTheme>["colors"]) => StyleSheet.create({
  error: { color: "#FF6B6B", fontSize: 11, lineHeight: 17, marginTop: 8 }, screen: { justifyContent: "center", padding: 25, overflow: "hidden" }, orb: { position: "absolute", width: 280, height: 280, borderRadius: 150, backgroundColor: c.purple, opacity: 0.09, top: -95, right: -130 }, content: { width: "100%" }, logoIcon: { width: 49, height: 49, borderRadius: 16, backgroundColor: c.purple, alignItems: "center", justifyContent: "center", marginBottom: 13 }, logo: { color: c.text, fontSize: 22, fontWeight: "900", letterSpacing: 2.4 }, accent: { color: c.purple }, eyebrow: { color: c.muted, fontSize: 8, letterSpacing: 1.5, fontWeight: "900", marginTop: 7, marginBottom: 32 }, heading: { color: c.text, fontSize: 35, lineHeight: 39, fontWeight: "900", letterSpacing: -1 }, sub: { color: c.muted, fontSize: 11, lineHeight: 18, marginTop: 9, marginBottom: 24 }, fieldLabel: { color: c.muted, fontSize: 8, letterSpacing: 1.5, fontWeight: "900", marginBottom: 8, marginTop: 8 }, input: { backgroundColor: c.surface, color: c.text, borderRadius: 14, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: c.border, fontSize: 12 }, button: { backgroundColor: c.purple, borderRadius: 14, padding: 16, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 10, marginTop: 13 }, buttonText: { color: "#FFFFFF", fontWeight: "900", fontSize: 12 }, footer: { color: c.muted, textAlign: "center", marginTop: 23, fontSize: 10 },
});
