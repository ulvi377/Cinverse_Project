import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { Redirect } from "expo-router";
import { useLanguage } from "../../context/LanguageContext";

export default function TabsLayout() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Redirect href="/login" />;
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, borderTopWidth: 1, height: 66, paddingBottom: 8, paddingTop: 7 },
      tabBarActiveTintColor: colors.purple,
      tabBarInactiveTintColor: colors.muted,
      tabBarLabelStyle: { fontSize: 10, fontWeight: "700" },
    }}>
      <Tabs.Screen name="index" options={{ title: t("Home"), tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} /> }} />
      <Tabs.Screen name="search" options={{ title: t("Search"), tabBarIcon: ({ color, size }) => <Ionicons name="search" color={color} size={size} /> }} />
      <Tabs.Screen name="watchlist" options={{ title: t("Watchlist"), tabBarIcon: ({ color, size }) => <Ionicons name="bookmark" color={color} size={size} /> }} />
      <Tabs.Screen name="profile" options={{ title: t("Profile"), tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} /> }} />
    </Tabs>
  );
}
