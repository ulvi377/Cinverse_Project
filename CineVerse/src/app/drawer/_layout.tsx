
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { Redirect } from "expo-router";

export default function DrawerLayout() {
  const { colors } = useTheme();
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Redirect href="/login" />;

  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        drawerStyle: {
          backgroundColor: colors.surface,
        },
        drawerActiveTintColor: colors.purple,
        drawerInactiveTintColor: colors.muted,
        sceneStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Netflix Menu",
          drawerLabel: "Menu",
          drawerIcon: ({ size }) => (
            <Ionicons
              name="grid-outline"
              color={colors.text}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="settings"
        options={{
          title: "Settings",
          drawerIcon: ({ size }) => (
            <Ionicons
              name="settings-outline"
              color={colors.text}
              size={size}
            />
          ),
        }}
      />
    </Drawer>
  );
}
