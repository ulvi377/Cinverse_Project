import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage, AppLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

const options: { code: AppLanguage; label: string; flag: string }[] = [
  { code: "az", label: "Azərbaycan", flag: "🇦🇿" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" }
];

export default function LanguageSwitcher() {
  const [visible, setVisible] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { colors } = useTheme();
  const current = options.find(item => item.code === language)!;
  return <>
    <Pressable onPress={() => setVisible(true)} style={[styles.trigger, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={{ fontSize: 15 }}>{current.flag}</Text><Text style={{ color: colors.text, fontSize: 11, fontWeight: "800" }}>{language.toUpperCase()}</Text><Ionicons name="chevron-down" size={13} color={colors.text} />
    </Pressable>
    <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
      <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
        <View style={[styles.menu, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.heading, { color: colors.text }]}>Choose language / Dil seç</Text>
          {options.map(item => <Pressable key={item.code} onPress={async () => { await setLanguage(item.code); setVisible(false); }} style={[styles.option, { borderBottomColor: colors.border }]}>
            <Text style={styles.flag}>{item.flag}</Text><Text style={{ color: colors.text, flex: 1, fontSize: 14, fontWeight: "600" }}>{item.label}</Text>
            {language === item.code ? <Ionicons name="checkmark-circle" size={19} color={colors.purple} /> : null}
          </Pressable>)}
        </View>
      </Pressable>
    </Modal>
  </>;
}

const styles = StyleSheet.create({
  trigger: { height: 34, minWidth: 66, paddingHorizontal: 9, borderRadius: 12, borderWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5 },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.48)", justifyContent: "center", alignItems: "center", padding: 25 },
  menu: { width: "100%", maxWidth: 320, borderRadius: 20, borderWidth: 1, padding: 17 },
  heading: { fontSize: 16, fontWeight: "800", marginBottom: 9 },
  option: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  flag: { fontSize: 21 }
});
