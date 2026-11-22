import LocalizedText from "../components/LocalizedText";
import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const { user, loading } = useAuth();
  const { colors, ready } = useTheme();
  const scale = useRef(new Animated.Value(0.82)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [splashFinished, setSplashFinished] = React.useState(false);
  const [onboardingDone, setOnboardingDone] = React.useState<boolean | null>(null);
  useEffect(() => { AsyncStorage.getItem("cineverse_onboarding_done").then(value => setOnboardingDone(value === "1")); }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 55, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 650, useNativeDriver: true })
    ]).start();
    const timer = setTimeout(() => setSplashFinished(true), 1900);
    return () => clearTimeout(timer);
  }, [opacity, scale]);

  if (!loading && ready && splashFinished && onboardingDone !== null) return <Redirect href={!onboardingDone ? "/onboarding" : user ? "/(tabs)" : "/login"} />;

  return <View style={[styles.container, { backgroundColor: "#050505" }]}>
    <Animated.View style={{ alignItems: "center", opacity, transform: [{ scale }] }}>
      <Image source={require("../../assets/icon.png")} style={styles.logoImage} resizeMode="contain" />
      <LocalizedText style={styles.wordmark}>NETFLIX</LocalizedText>
      <LocalizedText style={styles.caption}>SEE WHAT'S NEXT</LocalizedText>
    </Animated.View>
    <View style={styles.bottom}><LocalizedText style={styles.bottomText}>NETFLIX EXPERIENCE</LocalizedText></View>
  </View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  logoImage: { width: 104, height: 104, borderRadius: 18 },
  wordmark: { color: "#FFFFFF", fontSize: 23, fontWeight: "900", letterSpacing: 5, marginTop: 21 },
  caption: { color: "#777777", fontSize: 8, letterSpacing: 3, fontWeight: "800", marginTop: 9 },
  bottom: { position: "absolute", bottom: 48 },
  bottomText: { color: "#555555", fontSize: 8, letterSpacing: 2, fontWeight: "800" }
});
