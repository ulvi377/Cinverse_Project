import LocalizedText from "../components/LocalizedText";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Screen from "../components/Screen";
import { api } from "../services/api";
import { Movie } from "../types";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function EditMovieScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", overview: "", posterUrl: "", trailerUrl: "", backdropUrl: "", genre: "", cast: "", releaseYear: "", imdbRating: "" });

  useEffect(() => {
    if (!user) { router.replace("/login"); return; }
    api<Movie>(`/movies/${id}`).then(data => {
      setMovie(data);
      setForm({ title: data.title, overview: data.overview, posterUrl: data.posterUrl, trailerUrl: data.trailerUrl, backdropUrl: data.backdropUrl, genre: data.genre, cast: data.cast || "", releaseYear: String(data.releaseYear), imdbRating: String(data.imdbRating) });
    }).catch(error => Alert.alert("Xəta", error.message));
  }, [id, user]);

  const update = (key: keyof typeof form, value: string) => setForm(old => ({ ...old, [key]: value }));
  const save = async () => {
    if (!form.title.trim() || !form.overview.trim() || !form.posterUrl.trim() || !form.trailerUrl.trim() || !form.genre.trim()) { Alert.alert("Məlumat çatışmır", "Məcburi xanaları doldurun."); return; }
    const year = Number(form.releaseYear), rating = Number(form.imdbRating);
    if (!/^https?:\/\//i.test(form.posterUrl) || !/^https?:\/\//i.test(form.trailerUrl) || !Number.isInteger(year) || year < 1888 || year > 2100 || !Number.isFinite(rating) || rating < 0 || rating > 10) { Alert.alert("Yanlış məlumat", "Linkləri, ili və 0–10 arası reytinqi yoxlayın."); return; }
    try {
      setSaving(true);
      await api(`/movies/${id}`, { method: "PUT", body: JSON.stringify({ ...form, releaseYear: year, imdbRating: rating }) }, true);
      Alert.alert("Netflix", "Film məlumatları yeniləndi.", [{ text: "OK", onPress: () => router.replace(`/movie/${id}`) }]);
    } catch (error) { Alert.alert("Xəta", error instanceof Error ? error.message : "Yeniləmə alınmadı."); }
    finally { setSaving(false); }
  };

  if (!movie) return <Screen style={{ flex: 1, justifyContent: "center" }}><ActivityIndicator color={colors.purple} /></Screen>;
  const fields: { key: keyof typeof form; label: string; multiline?: boolean; keyboard?: "default" | "numeric" }[] = [
    { key: "title", label: "FILM ADI" }, { key: "posterUrl", label: "POSTER LINKİ" }, { key: "trailerUrl", label: "TRAILER LINKİ" }, { key: "backdropUrl", label: "BACKDROP LINKİ" }, { key: "genre", label: "JANR" }, { key: "overview", label: "TƏSVİR", multiline: true }, { key: "cast", label: "AKTYORLAR" }, { key: "releaseYear", label: "BURAXILIŞ İLİ", keyboard: "numeric" }, { key: "imdbRating", label: "REYTİNQ (0–10)", keyboard: "numeric" }
  ];
  return <Screen><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <View style={styles.header}><Pressable onPress={() => router.back()}><Ionicons name="chevron-back" size={25} color={colors.text} /></Pressable><LocalizedText style={styles.heading}>Edit movie</LocalizedText></View>
    <LocalizedText style={styles.description}>Film məlumatlarını dəyiş və yenilənmiş versiyanı kataloqda saxla.</LocalizedText>
    {fields.map(field => <View key={field.key} style={styles.field}><LocalizedText style={styles.label}>{field.label}</LocalizedText><TextInput value={form[field.key]} onChangeText={value => update(field.key, value)} placeholder={field.label} placeholderTextColor={colors.muted} multiline={field.multiline} keyboardType={field.keyboard || "default"} autoCapitalize="none" style={[styles.input, field.multiline && styles.multiline]} /></View>)}
    <Pressable disabled={saving} onPress={save} style={[styles.submit, saving && { opacity: 0.6 }]}><LocalizedText style={styles.submitText}>{saving ? "Yadda saxlanılır..." : "Dəyişiklikləri yadda saxla"}</LocalizedText></Pressable>
  </ScrollView></KeyboardAvoidingView></Screen>;
}
const makeStyles = (c: ReturnType<typeof useTheme>["colors"]) => StyleSheet.create({ content: { padding: 20, paddingBottom: 35 }, header: { flexDirection: "row", alignItems: "center", gap: 15, marginTop: 8 }, heading: { color: c.text, fontSize: 25, fontWeight: "900" }, description: { color: c.muted, fontSize: 12, lineHeight: 19, marginVertical: 18 }, field: { marginBottom: 14 }, label: { color: c.text, fontSize: 9, fontWeight: "900", letterSpacing: 1, marginBottom: 7 }, input: { minHeight: 48, backgroundColor: c.surface, borderColor: c.border, borderWidth: 1, borderRadius: 13, padding: 13, color: c.text, fontSize: 12 }, multiline: { minHeight: 100, textAlignVertical: "top" }, submit: { minHeight: 52, borderRadius: 14, backgroundColor: c.purple, alignItems: "center", justifyContent: "center", marginTop: 8 }, submitText: { color: "#fff", fontSize: 12, fontWeight: "900" } });
