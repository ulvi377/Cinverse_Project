
import LocalizedText from "../../components/LocalizedText";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Screen from "../../components/Screen";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [photo, setPhoto] = useState<string | null>(null);

  React.useEffect(() => {
    AsyncStorage.getItem("cineverse_profile_photo").then(setPhoto);
  }, []);

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return Alert.alert(
        "İcazə lazımdır",
        "Şəkil seçmək üçün qalereya icazəsi ver."
      );
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      await AsyncStorage.setItem(
        "cineverse_profile_photo",
        result.assets[0].uri
      );
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Logout failed. Please try again.");
    }
  };

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.screen}
      >
        <View style={styles.header}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <LocalizedText style={styles.eyebrow}>
                YOUR NETFLIX
              </LocalizedText>
              <LocalizedText style={styles.title}>
                Profile
              </LocalizedText>
            </View>

            <Pressable
              onPress={() => router.push("/drawer")}
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                backgroundColor: colors.surface,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Ionicons name="menu" size={22} color={colors.text} />
            </Pressable>
          </View>
        </View>

        <View style={styles.profileCard}>
          <Pressable onPress={pickImage} style={styles.avatarWrap}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.avatar} />
            ) : (
              <View style={styles.avatar}>
                <LocalizedText style={styles.initial}>
                  {user?.name?.[0] || "C"}
                </LocalizedText>
              </View>
            )}

            <View style={styles.camera}>
              <Ionicons name="camera" color="#FFFFFF" size={13} />
            </View>
          </Pressable>

          <LocalizedText style={styles.name}>
            {user?.name || "Netflix member"}
          </LocalizedText>

          <LocalizedText style={styles.email}>
            {user?.email}
          </LocalizedText>

          <View style={styles.memberTag}>
            <Ionicons name="sparkles" size={11} color={colors.gold} />
            <LocalizedText style={styles.memberText}>
              CINEMA ENTHUSIAST
            </LocalizedText>
          </View>
        </View>

        <LocalizedText style={styles.section}>
          YOUR SPACE
        </LocalizedText>

        <Pressable
          onPress={() => router.push("/watched")}
          style={styles.menuItem}
        >
          <View style={styles.menuIcon}>
            <Ionicons
              name="film-outline"
              size={20}
              color={colors.purple}
            />
          </View>

          <View style={styles.menuCopy}>
            <LocalizedText style={styles.menuTitle}>
              Watched movies
            </LocalizedText>
            <LocalizedText style={styles.menuSub}>
              Your viewing history and stats
            </LocalizedText>
          </View>

          <Ionicons
            name="chevron-forward"
            color={colors.muted}
            size={19}
          />
        </Pressable>

        <Pressable
          onPress={() => router.push("/settings")}
          style={styles.menuItem}
        >
          <View style={styles.menuIcon}>
            <Ionicons
              name="settings-outline"
              size={20}
              color={colors.purple}
            />
          </View>

          <View style={styles.menuCopy}>
            <LocalizedText style={styles.menuTitle}>
              Settings
            </LocalizedText>
            <LocalizedText style={styles.menuSub}>
              Personalize your experience
            </LocalizedText>
          </View>

          <Ionicons
            name="chevron-forward"
            color={colors.muted}
            size={19}
          />
        </Pressable>

        <Pressable
          onPress={handleLogout}
          style={styles.logout}
        >
          <Ionicons
            name="log-out-outline"
            size={18}
            color={colors.red}
          />
          <LocalizedText style={styles.logoutText}>
            Log out
          </LocalizedText>
        </Pressable>

        <LocalizedText style={styles.version}>
          NETFLIX  ·  MADE FOR MOVIE LOVERS
        </LocalizedText>
      </ScrollView>
    </Screen>
  );
}

const makeStyles = (
  c: ReturnType<typeof import("../../context/ThemeContext").useTheme>["colors"]
) =>
  StyleSheet.create({
    screen: {
      padding: 20,
      paddingBottom: 35,
    },
    header: {
      paddingTop: 15,
      paddingBottom: 20,
    },
    eyebrow: {
      color: c.purple,
      fontSize: 9,
      fontWeight: "900",
      letterSpacing: 2,
    },
    title: {
      color: c.text,
      fontSize: 29,
      fontWeight: "900",
      marginTop: 7,
    },
    profileCard: {
      alignItems: "center",
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 23,
      padding: 22,
    },
    avatarWrap: {
      position: "relative",
    },
    avatar: {
      width: 94,
      height: 94,
      borderRadius: 32,
      backgroundColor: c.surfaceLight,
      alignItems: "center",
      justifyContent: "center",
    },
    initial: {
      color: c.purple,
      fontSize: 38,
      fontWeight: "900",
    },
    camera: {
      position: "absolute",
      right: -4,
      bottom: -3,
      width: 29,
      height: 29,
      borderRadius: 10,
      backgroundColor: c.purple,
      borderWidth: 3,
      borderColor: c.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    name: {
      color: c.text,
      fontSize: 19,
      fontWeight: "900",
      marginTop: 16,
    },
    email: {
      color: c.muted,
      fontSize: 11,
      marginTop: 5,
    },
    memberTag: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: c.surfaceLight,
      paddingHorizontal: 11,
      paddingVertical: 7,
      borderRadius: 20,
      marginTop: 14,
    },
    memberText: {
      color: c.muted,
      fontSize: 8,
      letterSpacing: 1,
      fontWeight: "900",
    },
    section: {
      color: c.muted,
      fontSize: 9,
      fontWeight: "900",
      letterSpacing: 1.8,
      marginTop: 27,
      marginBottom: 11,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 13,
      backgroundColor: c.surface,
      borderRadius: 17,
      borderWidth: 1,
      borderColor: c.border,
      marginBottom: 10,
    },
    menuIcon: {
      width: 42,
      height: 42,
      borderRadius: 13,
      backgroundColor: c.surfaceLight,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    menuCopy: {
      flex: 1,
    },
    menuTitle: {
      color: c.text,
      fontSize: 12,
      fontWeight: "800",
    },
    menuSub: {
      color: c.muted,
      fontSize: 9,
      marginTop: 4,
    },
    logout: {
      marginTop: 18,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 14,
      padding: 14,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
    },
    logoutText: {
      color: c.red,
      fontSize: 11,
      fontWeight: "800",
    },
    version: {
      color: c.muted,
      opacity: 0.7,
      textAlign: "center",
      fontSize: 8,
      letterSpacing: 1.3,
      marginTop: 25,
      paddingTop: 10,
    },
  });
