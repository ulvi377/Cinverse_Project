
import { Stack, Redirect, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { LanguageProvider } from "../context/LanguageContext";

function useAppAuth() {
  return useAuth();
}

function AppStack() {
  const { colors, mode } = useTheme();
  const { user, loading } = useAppAuth();
  const segments = useSegments();
  const firstSegment = segments[0];

  const publicRoutes = [
    "index",
    "onboarding",
    "login",
    "register",
    "+not-found",
  ];

  const protectedRoute =
    !!firstSegment && !publicRoutes.includes(firstSegment);

  return (
    <>
      <StatusBar
        style={mode === "dark" ? "light" : "dark"}
        backgroundColor={colors.background}
      />

      {!loading && !user && protectedRoute ? (
        <Redirect href="/login" />
      ) : null}

      {!loading &&
      user &&
      (firstSegment === "login" || firstSegment === "register") ? (
        <Redirect href="/(tabs)" />
      ) : null}

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "fade_from_bottom",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="drawer" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="movie/[id]" />
        <Stack.Screen name="add-movie" />
        <Stack.Screen name="edit-movie" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="reviews/[id]" />
        <Stack.Screen name="watched" />
        <Stack.Screen name="settings" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppStack />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
