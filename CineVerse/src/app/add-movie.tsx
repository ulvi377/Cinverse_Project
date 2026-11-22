import LocalizedText from "../components/LocalizedText";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Screen from "../components/Screen";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

type FieldProps = { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; multiline?: boolean; keyboardType?: "default" | "numeric"; };

export default function AddMovieScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [title, setTitle] = useState("");
  const [overview, setOverview] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [trailerUrl, setTrailerUrl] = useState("");
  const [backdropUrl, setBackdropUrl] = useState("");
  const [genre, setGenre] = useState("");
  const [cast, setCast] = useState("");
  const [releaseYear, setReleaseYear] = useState(String(new Date().getFullYear()));
  const [imdbRating, setImdbRating] = useState("7.5");
  const [saving, setSaving] = useState(false);
  const [pickedPoster, setPickedPoster] = useState<string | null>(null);

  const choosePoster = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { Alert.alert("İcazə lazımdır", "Poster seçmək üçün qalereya icazəsi verilməlidir."); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [2, 3], quality: 0.8 });
    if (!result.canceled) { setPickedPoster(result.assets[0].uri); }
  };

  const submit = async () => {
    if (!user) { router.replace("/login"); return; }
    if (!title.trim() || !overview.trim() || !posterUrl.trim() || !trailerUrl.trim() || !genre.trim() || !releaseYear.trim()) {
      Alert.alert("Məlumat çatışmır", "Film adı, təsvir, poster linki, trailer linki, janr və il mütləqdir.");
      return;
    }
    if (!/^https?:\/\//i.test(posterUrl.trim()) || !/^https?:\/\//i.test(trailerUrl.trim())) {
      Alert.alert("Link düzgün deyil", "Poster və trailer linkləri http:// və ya https:// ilə başlamalıdır.");
      return;
    }
    const year = Number(releaseYear);
    const rating = Number(imdbRating);
    if (!Number.isInteger(year) || year < 1888 || year > 2100 || !Number.isFinite(rating) || rating < 0 || rating > 10) {
      Alert.alert("Məlumat düzgün deyil", "Buraxılış ilini və 0–10 arası reytinqi yoxlayın.");
      return;
    }
    try {
      setSaving(true);
      await api("/movies", { method: "POST", body: JSON.stringify({ title: title.trim(), overview: overview.trim(), posterUrl: posterUrl.trim(), trailerUrl: trailerUrl.trim(), backdropUrl: backdropUrl.trim() || posterUrl.trim(), genre: genre.trim(), cast: cast.trim(), releaseYear: year, imdbRating: rating }) }, true);
      Alert.alert("Netflix", "Film uğurla əlavə edildi.", [{ text: "Əla", onPress: () => router.replace("/(tabs)") }]);
    } catch (error) {
      Alert.alert("Xəta", error instanceof Error ? error.message : "Film əlavə edilə bilmədi.");
    } finally { setSaving(false); }
  };

  const field = ({ label, value, onChangeText, placeholder, multiline, keyboardType }: FieldProps) => (
    <View style={styles.field}>
      <LocalizedText style={styles.label}>{label}</LocalizedText>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.muted} multiline={multiline} keyboardType={keyboardType || "default"} autoCapitalize="none" style={[styles.input, multiline && styles.multiline]} />
    </View>
  );

  return <Screen>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.back}><Ionicons name="chevron-back" size={21} color={colors.text} /></Pressable>
          <View style={{ flex: 1 }}><LocalizedText style={styles.eyebrow}>NETFLIX COMMUNITY</LocalizedText><LocalizedText style={styles.heading}>Add a movie</LocalizedText></View>
          <View style={styles.headerIcon}><Ionicons name="film" size={20} color={colors.purple} /></View>
        </View>
        <LocalizedText style={styles.description}>Sevdiyin filmi kataloqa əlavə et. Poster və trailer üçün ayrı-ayrı link daxil et.</LocalizedText>
        {field({ label: "FILM ADI *", value: title, onChangeText: setTitle, placeholder: "Məsələn: Interstellar" })}
        <Pressable onPress={choosePoster} style={styles.imagePicker}><Ionicons name="image-outline" size={19} color={colors.purple} /><LocalizedText style={styles.imagePickerText}>Qalereyadan poster seç</LocalizedText></Pressable>
        {pickedPoster ? <Image source={{ uri: pickedPoster }} style={styles.posterPreview} /> : null}
        {field({ label: "POSTER ŞƏKLİNİN LINKİ *", value: posterUrl, onChangeText: value => { setPosterUrl(value); setPickedPoster(null); }, placeholder: "https://.../poster.jpg və ya qalereyadan seç" })}
        <LocalizedText style={styles.hint}>Bu sahəyə serverdə əlçatan HTTPS şəkil linki daxil et. Qalereya seçimi cihaz icazəsini və şəkil preview-sunu nümayiş etdirir.</LocalizedText>
        {field({ label: "TRAILER LINKİ *", value: trailerUrl, onChangeText: setTrailerUrl, placeholder: "https://www.youtube.com/watch?v=..." })}
        <LocalizedText style={styles.hint}>Bu link Details səhifəsindəki Watch Trailer düyməsinə bağlanacaq.</LocalizedText>
        {field({ label: "BACKDROP ŞƏKLİNİN LINKİ", value: backdropUrl, onChangeText: setBackdropUrl, placeholder: "https://.../backdrop.jpg (istəyə bağlı)" })}
        {field({ label: "JANR *", value: genre, onChangeText: setGenre, placeholder: "Məsələn: Sci-Fi, Drama" })}
        {field({ label: "FİLM HAQQINDA *", value: overview, onChangeText: setOverview, placeholder: "Filmin qısa təsviri...", multiline: true })}
        {field({ label: "AKTYORLAR", value: cast, onChangeText: setCast, placeholder: "Məsələn: Matthew McConaughey, Anne Hathaway" })}
        <View style={styles.row}>
          <View style={{ flex: 1 }}>{field({ label: "BURAXILIŞ İLİ *", value: releaseYear, onChangeText: setReleaseYear, placeholder: "2026", keyboardType: "numeric" })}</View>
          <View style={{ flex: 1 }}>{field({ label: "REYTİNQ (0–10)", value: imdbRating, onChangeText: setImdbRating, placeholder: "7.5", keyboardType: "numeric" })}</View>
        </View>
        <Pressable onPress={submit} disabled={saving} style={[styles.submit, saving && { opacity: 0.6 }]}>
          <Ionicons name="add-circle-outline" size={19} color="#FFFFFF" /><LocalizedText style={styles.submitText}>{saving ? "Əlavə olunur..." : "Filmi kataloqa əlavə et"}</LocalizedText>
        </Pressable>
        <LocalizedText style={styles.required}>* İşarəli xanalar mütləq doldurulmalıdır.</LocalizedText>
      </ScrollView>
    </KeyboardAvoidingView>
  </Screen>;
}

const makeStyles = (c: ReturnType<typeof useTheme>["colors"]) => StyleSheet.create({
  content: { padding: 20, paddingBottom: 35 },
  header: { flexDirection: "row", alignItems: "center", gap: 13, marginTop: 8 },
  back: { width: 42, height: 42, borderRadius: 14, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, alignItems: "center", justifyContent: "center" },
  eyebrow: { color: c.purple, fontSize: 8, fontWeight: "900", letterSpacing: 1.8 },
  heading: { color: c.text, fontSize: 27, fontWeight: "900", marginTop: 3 },
  headerIcon: { width: 43, height: 43, borderRadius: 15, backgroundColor: c.surfaceLight, alignItems: "center", justifyContent: "center" },
  description: { color: c.muted, fontSize: 12, lineHeight: 19, marginTop: 17, marginBottom: 20 },
  field: { marginBottom: 15 }, label: { color: c.text, fontSize: 9, fontWeight: "900", letterSpacing: 1.1, marginBottom: 8 },
  input: { minHeight: 49, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: 13, paddingHorizontal: 14, paddingVertical: 13, color: c.text, fontSize: 12 },
  multiline: { minHeight: 105, textAlignVertical: "top" }, hint: { color: c.muted, fontSize: 9, lineHeight: 14, marginTop: -8, marginBottom: 14, paddingHorizontal: 2 },
  imagePicker: { minHeight: 47, borderRadius: 13, borderWidth: 1, borderColor: c.border, backgroundColor: c.surfaceLight, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, marginBottom: 12 }, imagePickerText: { color: c.text, fontSize: 11, fontWeight: "800" }, posterPreview: { width: 100, height: 145, borderRadius: 12, marginBottom: 12, alignSelf: "center" },
  row: { flexDirection: "row", gap: 12 }, submit: { backgroundColor: c.purple, minHeight: 53, borderRadius: 15, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 9, marginTop: 9 },
  submitText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" }, required: { color: c.muted, fontSize: 9, textAlign: "center", marginTop: 13 },
});
