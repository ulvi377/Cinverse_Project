
import LocalizedText from "../components/LocalizedText";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Switch,
  ScrollView,
  View,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Screen from "../components/Screen";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useTheme } from "../context/ThemeContext";
import * as Notifications from "expo-notifications";

const NOTIFICATIONS_KEY = "cineverse_notifications";
const REMINDER_KEY = "cineverse_daily_reminder";
const TIME_KEY = "cineverse_reminder_time";
const NOTIFICATION_ID_KEY = "cineverse_notification_id";

export default function SettingsScreen() {
  const { mode, colors, setTheme } = useTheme();
  const dark = mode === "dark";
  const styles = makeStyles(colors);

  const [notificationStatus, setNotificationStatus] = useState(false);
  const [dailyReminder, setDailyReminder] = useState(false);
  const [hour, setHour] = useState(20);
  const [minute, setMinute] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const timeText = `${String(hour).padStart(2, "0")}:${String(
    minute
  ).padStart(2, "0")}`;

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const [notifications, reminder, savedTime] = await Promise.all([
        AsyncStorage.getItem(NOTIFICATIONS_KEY),
        AsyncStorage.getItem(REMINDER_KEY),
        AsyncStorage.getItem(TIME_KEY),
      ]);

      setNotificationStatus(notifications === "true");
      setDailyReminder(reminder === "true");

      if (savedTime) {
        const [savedHour, savedMinute] = savedTime.split(":").map(Number);

        if (
          Number.isInteger(savedHour) &&
          savedHour >= 0 &&
          savedHour <= 23 &&
          Number.isInteger(savedMinute) &&
          savedMinute >= 0 &&
          savedMinute <= 59
        ) {
          setHour(savedHour);
          setMinute(savedMinute);
        }
      }
    } catch (error) {
      console.error("Load settings error:", error);
    } finally {
      setLoaded(true);
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const current = await Notifications.getPermissionsAsync();

      let status = current.status;

      if (status !== "granted") {
        const result = await Notifications.requestPermissionsAsync();
        status = result.status;
      }

      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please enable notifications from your device settings."
        );

        return false;
      }

      return true;
    } catch (error) {
      console.error("Notification permission error:", error);

      Alert.alert(
        "Notification Error",
        error instanceof Error ? error.message : String(error)
      );

      return false;
    }
  };

  const cancelDailyNotification = async () => {
    try {
      const id = await AsyncStorage.getItem(NOTIFICATION_ID_KEY);

      if (id) {
        await Notifications.cancelScheduledNotificationAsync(id);
      }

      await AsyncStorage.removeItem(NOTIFICATION_ID_KEY);
    } catch (error) {
      console.error("Cancel notification error:", error);
    }
  };

  const scheduleDailyNotification = async (
    selectedHour: number,
    selectedMinute: number
  ) => {
    try {
      await cancelDailyNotification();

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "CineVerse 🎬",
          body: "It's movie time! Discover a new movie today.",
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: selectedHour,
          minute: selectedMinute,
        },
      });

      await AsyncStorage.setItem(NOTIFICATION_ID_KEY, id);

      console.log("Notification scheduled:", id);

      return true;
    } catch (error) {
      console.error("Schedule notification error:", error);

      Alert.alert(
        "Notification Error",
        error instanceof Error ? error.message : String(error)
      );

      return false;
    }
  };

  const toggleNotifications = async (value: boolean) => {
    try {
      if (value) {
        const granted = await requestNotificationPermission();

        if (!granted) return;

        if (dailyReminder) {
          const scheduled = await scheduleDailyNotification(hour, minute);

          if (!scheduled) return;
        }

        await AsyncStorage.setItem(NOTIFICATIONS_KEY, "true");
        setNotificationStatus(true);
      } else {
        await cancelDailyNotification();

        await AsyncStorage.multiSet([
          [NOTIFICATIONS_KEY, "false"],
          [REMINDER_KEY, "false"],
        ]);

        setNotificationStatus(false);
        setDailyReminder(false);
      }
    } catch (error) {
      console.error("Notification toggle error:", error);

      Alert.alert(
        "Notification Error",
        error instanceof Error ? error.message : String(error)
      );
    }
  };

  const toggleDailyReminder = async (value: boolean) => {
    try {
      if (value) {
        const granted = await requestNotificationPermission();

        if (!granted) return;

        const scheduled = await scheduleDailyNotification(hour, minute);

        if (!scheduled) return;

        await AsyncStorage.multiSet([
          [NOTIFICATIONS_KEY, "true"],
          [REMINDER_KEY, "true"],
        ]);

        setNotificationStatus(true);
        setDailyReminder(true);
      } else {
        await cancelDailyNotification();

        await AsyncStorage.setItem(REMINDER_KEY, "false");

        setDailyReminder(false);
      }
    } catch (error) {
      console.error("Reminder toggle error:", error);

      Alert.alert(
        "Notification Error",
        error instanceof Error ? error.message : String(error)
      );
    }
  };

  const changeTime = async (
    newHour: number,
    newMinute: number
  ) => {
    const safeHour = (newHour + 24) % 24;
    const safeMinute = (newMinute + 60) % 60;

    try {
      if (notificationStatus && dailyReminder) {
        const scheduled = await scheduleDailyNotification(
          safeHour,
          safeMinute
        );

        if (!scheduled) return;
      }

      setHour(safeHour);
      setMinute(safeMinute);

      await AsyncStorage.setItem(
        TIME_KEY,
        `${String(safeHour).padStart(2, "0")}:${String(
          safeMinute
        ).padStart(2, "0")}`
      );
    } catch (error) {
      console.error("Change time error:", error);

      Alert.alert(
        "Error",
        error instanceof Error ? error.message : String(error)
      );
    }
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  if (!loaded) {
    return <Screen />;
  }

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.screen}
      >
        <View style={styles.topBar}>
          <Pressable onPress={goBack} style={styles.back}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>

          <LocalizedText style={styles.topTitle}>Settings</LocalizedText>

          <View style={{ width: 42 }} />
        </View>

        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="options" size={27} color={colors.purple} />
          </View>

          <LocalizedText style={styles.eyebrow}>
            MAKE IT YOURS
          </LocalizedText>

          <LocalizedText style={styles.title}>
            Your experience,{"\n"}
            <LocalizedText style={styles.accent}>
              your atmosphere.
            </LocalizedText>
          </LocalizedText>

          <LocalizedText style={styles.subtitle}>
            Customize the look and feel of your CineVerse space.
          </LocalizedText>
        </View>

        <LocalizedText style={styles.sectionLabel}>
          APPEARANCE
        </LocalizedText>

        <View style={styles.settingCard}>
          <View style={styles.settingIcon}>
            <Ionicons
              name={dark ? "moon" : "sunny"}
              size={22}
              color={colors.purple}
            />
          </View>

          <View style={styles.settingCopy}>
            <LocalizedText style={styles.settingTitle}>
              Dark appearance
            </LocalizedText>

            <LocalizedText style={styles.settingDescription}>
              {dark
                ? "A cinematic dark experience is active."
                : "A clean, bright experience is active."}
            </LocalizedText>
          </View>

          <Switch
            value={dark}
            onValueChange={(value) =>
              setTheme(value ? "dark" : "light")
            }
            trackColor={{
              false: colors.border,
              true: colors.purple,
            }}
            thumbColor={colors.white}
          />
        </View>

        <LocalizedText style={[styles.sectionLabel, { marginTop: 22 }]}>
          LANGUAGE
        </LocalizedText>

        <View style={styles.settingCard}>
          <View style={styles.settingIcon}>
            <Ionicons name="language" size={22} color={colors.purple} />
          </View>

          <View style={styles.settingCopy}>
            <LocalizedText style={styles.settingTitle}>
              App language
            </LocalizedText>

            <LocalizedText style={styles.settingDescription}>
              Choose your preferred language.
            </LocalizedText>
          </View>

          <LanguageSwitcher />
        </View>

        <LocalizedText style={[styles.sectionLabel, { marginTop: 22 }]}>
          NOTIFICATIONS
        </LocalizedText>

        <View style={styles.settingCard}>
          <View style={styles.settingIcon}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={colors.purple}
            />
          </View>

          <View style={styles.settingCopy}>
            <LocalizedText style={styles.settingTitle}>
              Enable notifications
            </LocalizedText>

            <LocalizedText style={styles.settingDescription}>
              Receive notifications from CineVerse.
            </LocalizedText>
          </View>

          <Switch
            value={notificationStatus}
            onValueChange={toggleNotifications}
            trackColor={{
              false: colors.border,
              true: colors.purple,
            }}
            thumbColor={colors.white}
          />
        </View>

        <View style={[styles.settingCard, { marginTop: 12 }]}>
          <View style={styles.settingIcon}>
            <Ionicons
              name="alarm-outline"
              size={22}
              color={colors.purple}
            />
          </View>

          <View style={styles.settingCopy}>
            <LocalizedText style={styles.settingTitle}>
              Daily movie reminder
            </LocalizedText>

            <LocalizedText style={styles.settingDescription}>
              Get a daily reminder to discover a movie.
            </LocalizedText>
          </View>

          <Switch
            value={dailyReminder}
            onValueChange={toggleDailyReminder}
            trackColor={{
              false: colors.border,
              true: colors.purple,
            }}
            thumbColor={colors.white}
          />
        </View>

        <View
          style={[
            styles.timeCard,
            !notificationStatus || !dailyReminder
              ? { opacity: 0.45 }
              : null,
          ]}
        >
          <View style={styles.timeHeader}>
            <View style={styles.settingIcon}>
              <Ionicons
                name="time-outline"
                size={22}
                color={colors.purple}
              />
            </View>

            <View style={styles.settingCopy}>
              <LocalizedText style={styles.settingTitle}>
                Reminder time
              </LocalizedText>

              <LocalizedText style={styles.settingDescription}>
                Choose when you want to receive reminders.
              </LocalizedText>
            </View>
          </View>

          <View style={styles.timeSelector}>
            <View style={styles.timeColumn}>
              <Pressable
                disabled={!notificationStatus || !dailyReminder}
                style={styles.timeButton}
                onPress={() => changeTime(hour + 1, minute)}
              >
                <Ionicons
                  name="chevron-up"
                  size={22}
                  color={colors.purple}
                />
              </Pressable>

              <LocalizedText style={styles.timeValue}>
                {String(hour).padStart(2, "0")}
              </LocalizedText>

              <Pressable
                disabled={!notificationStatus || !dailyReminder}
                style={styles.timeButton}
                onPress={() => changeTime(hour - 1, minute)}
              >
                <Ionicons
                  name="chevron-down"
                  size={22}
                  color={colors.purple}
                />
              </Pressable>
            </View>

            <LocalizedText style={styles.timeSeparator}>
              :
            </LocalizedText>

            <View style={styles.timeColumn}>
              <Pressable
                disabled={!notificationStatus || !dailyReminder}
                style={styles.timeButton}
                onPress={() => changeTime(hour, minute + 5)}
              >
                <Ionicons
                  name="chevron-up"
                  size={22}
                  color={colors.purple}
                />
              </Pressable>

              <LocalizedText style={styles.timeValue}>
                {String(minute).padStart(2, "0")}
              </LocalizedText>

              <Pressable
                disabled={!notificationStatus || !dailyReminder}
                style={styles.timeButton}
                onPress={() => changeTime(hour, minute - 5)}
              >
                <Ionicons
                  name="chevron-down"
                  size={22}
                  color={colors.purple}
                />
              </Pressable>
            </View>
          </View>

          <LocalizedText style={styles.timeHint}>
            Daily reminder at {timeText}
          </LocalizedText>
        </View>

        <View style={styles.previewCard}>
          <View style={styles.previewTop}>
            <View style={styles.previewDot} />

            <LocalizedText style={styles.previewLabel}>
              LIVE PREVIEW
            </LocalizedText>

            <LocalizedText style={styles.previewMode}>
              {dark ? "DARK" : "LIGHT"}
            </LocalizedText>
          </View>

          <View style={styles.previewPosterRow}>
            <View
              style={[
                styles.posterMock,
                {
                  backgroundColor: dark ? "#33215C" : "#D9C9FA",
                },
              ]}
            >
              <Ionicons
                name="film"
                size={25}
                color={dark ? "#D8C6FF" : "#6940B5"}
              />
            </View>

            <View style={styles.previewText}>
              <LocalizedText style={styles.previewMovie}>
                Your next movie night
              </LocalizedText>

              <LocalizedText style={styles.previewSmall}>
                The perfect look, day or night.
              </LocalizedText>

              <View style={styles.previewPill}>
                <LocalizedText style={styles.previewPillText}>
                  CINEVERSE ORIGINAL
                </LocalizedText>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <LocalizedText style={styles.footerBrand}>
            CINEVERSE
          </LocalizedText>

          <LocalizedText style={styles.footerText}>
            A universe of stories, made yours.
          </LocalizedText>
        </View>
      </ScrollView>
    </Screen>
  );
}

const makeStyles = (
  c: ReturnType<typeof useTheme>["colors"]
) =>
  StyleSheet.create({
    screen: {
      paddingHorizontal: 20,
      paddingBottom: 30,
    },
    topBar: {
      height: 54,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    back: {
      width: 42,
      height: 42,
      borderRadius: 15,
      backgroundColor: c.surface,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: c.border,
    },
    topTitle: {
      color: c.text,
      fontSize: 16,
      fontWeight: "800",
    },
    hero: {
      paddingTop: 28,
      paddingBottom: 28,
    },
    heroIcon: {
      width: 56,
      height: 56,
      borderRadius: 19,
      backgroundColor: c.surfaceLight,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 19,
      borderWidth: 1,
      borderColor: c.border,
    },
    eyebrow: {
      color: c.purple,
      fontSize: 10,
      letterSpacing: 2.4,
      fontWeight: "900",
      marginBottom: 11,
    },
    title: {
      color: c.text,
      fontSize: 31,
      lineHeight: 37,
      fontWeight: "900",
      letterSpacing: -0.8,
    },
    accent: {
      color: c.purple,
    },
    subtitle: {
      color: c.muted,
      fontSize: 13,
      lineHeight: 20,
      marginTop: 12,
      maxWidth: 290,
    },
    sectionLabel: {
      color: c.muted,
      fontSize: 10,
      letterSpacing: 2,
      fontWeight: "900",
      marginBottom: 11,
    },
    settingCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 20,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
    },
    settingIcon: {
      width: 45,
      height: 45,
      borderRadius: 15,
      backgroundColor: c.surfaceLight,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 13,
    },
    settingCopy: {
      flex: 1,
      paddingRight: 8,
    },
    settingTitle: {
      color: c.text,
      fontWeight: "800",
      fontSize: 14,
    },
    settingDescription: {
      color: c.muted,
      fontSize: 11,
      lineHeight: 16,
      marginTop: 5,
    },
    timeCard: {
      marginTop: 12,
      padding: 16,
      borderRadius: 20,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
    },
    timeHeader: {
      flexDirection: "row",
      alignItems: "center",
    },
    timeSelector: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 15,
      gap: 18,
    },
    timeColumn: {
      alignItems: "center",
      gap: 5,
    },
    timeButton: {
      width: 45,
      height: 34,
      borderRadius: 11,
      backgroundColor: c.surfaceLight,
      alignItems: "center",
      justifyContent: "center",
    },
    timeValue: {
      color: c.text,
      fontSize: 28,
      fontWeight: "900",
      fontVariant: ["tabular-nums"],
    },
    timeSeparator: {
      color: c.purple,
      fontSize: 27,
      fontWeight: "900",
      marginTop: -4,
    },
    timeHint: {
      color: c.muted,
      fontSize: 11,
      textAlign: "center",
      marginTop: 12,
    },
    previewCard: {
      marginTop: 18,
      borderRadius: 22,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      padding: 16,
    },
    previewTop: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
    },
    previewDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: "#42D6A4",
      marginRight: 8,
    },
    previewLabel: {
      color: c.muted,
      fontSize: 9,
      letterSpacing: 1.7,
      fontWeight: "900",
      flex: 1,
    },
    previewMode: {
      color: c.purple,
      fontSize: 9,
      letterSpacing: 1.4,
      fontWeight: "900",
    },
    previewPosterRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    posterMock: {
      width: 62,
      height: 78,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
    },
    previewText: {
      flex: 1,
    },
    previewMovie: {
      color: c.text,
      fontSize: 14,
      fontWeight: "800",
    },
    previewSmall: {
      color: c.muted,
      fontSize: 11,
      marginTop: 5,
    },
    previewPill: {
      alignSelf: "flex-start",
      backgroundColor: c.surfaceLight,
      borderRadius: 20,
      paddingHorizontal: 9,
      paddingVertical: 5,
      marginTop: 9,
    },
    previewPillText: {
      color: c.purple,
      fontSize: 8,
      fontWeight: "900",
      letterSpacing: 1,
    },
    footer: {
      alignItems: "center",
      paddingVertical: 25,
    },
    footerBrand: {
      color: c.muted,
      letterSpacing: 3,
      fontSize: 10,
      fontWeight: "900",
    },
    footerText: {
      color: c.muted,
      opacity: 0.7,
      fontSize: 10,
      marginTop: 5,
    },
  });
