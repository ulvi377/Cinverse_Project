import LocalizedText from "../../components/LocalizedText";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Screen from "../../components/Screen";
import { useTheme } from "../../context/ThemeContext";

export default function DrawerHome() {
  const { colors } = useTheme();
  const items = [{ title: "Home", icon: "home-outline" as const, action: () => router.replace("/(tabs)") }, { title: "Search movies", icon: "search-outline" as const, action: () => router.push("/(tabs)/search") }, { title: "My watchlist", icon: "bookmark-outline" as const, action: () => router.push("/(tabs)/watchlist") }, { title: "Profile", icon: "person-outline" as const, action: () => router.push("/(tabs)/profile") }, { title: "Settings", icon: "settings-outline" as const, action: () => router.push("/settings") }];
  return <Screen style={{ padding: 20 }}><LocalizedText style={{ color: colors.purple, fontSize: 10, fontWeight: "900", letterSpacing: 2 }}>EXPLORE YOUR UNIVERSE</LocalizedText><LocalizedText style={{ color: colors.text, fontSize: 29, fontWeight: "900", marginTop: 8, marginBottom: 22 }}>Netflix Menu</LocalizedText>{items.map(item => <Pressable key={item.title} onPress={item.action} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 15, padding: 17, marginBottom: 11, flexDirection: "row", alignItems: "center", gap: 13 }}><Ionicons name={item.icon} size={21} color={colors.purple} /><LocalizedText style={{ color: colors.text, fontSize: 13, fontWeight: "800", flex: 1 }}>{item.title}</LocalizedText><Ionicons name="chevron-forward" size={18} color={colors.muted} /></Pressable>)}</Screen>;
}
