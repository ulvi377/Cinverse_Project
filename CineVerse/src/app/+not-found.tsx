import LocalizedText from "../components/LocalizedText";

import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
export default function NotFoundScreen() { const { colors } = useTheme(); return <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", padding: 30 }}><LocalizedText style={{ color: colors.purple, fontSize: 58, fontWeight: "900" }}>404</LocalizedText><LocalizedText style={{ color: colors.text, fontSize: 22, fontWeight: "900", marginTop: 8 }}>This scene is missing</LocalizedText><LocalizedText style={{ color: colors.muted, textAlign: "center", marginTop: 10 }}>Axtardığın səhifə tapılmadı.</LocalizedText><Pressable onPress={() => router.replace("/(tabs)")} style={{ backgroundColor: colors.purple, paddingHorizontal: 25, paddingVertical: 14, borderRadius: 13, marginTop: 24 }}><LocalizedText style={{ color: "#fff", fontWeight: "900" }}>Go to Home</LocalizedText></Pressable></View>; }
