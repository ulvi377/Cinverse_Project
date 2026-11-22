import LocalizedText from "../../components/LocalizedText";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ImageBackground, ScrollView, StyleSheet, Text, Pressable, View, Alert, Linking } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Screen from "../../components/Screen";
import { api } from "../../services/api";
import { Movie } from "../../types";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  useEffect(() => { setLoading(true); api<Movie>(`/movies/${id}`).then(setMovie).catch(e => Alert.alert("Xəta", e.message)).finally(() => setLoading(false)); }, [id]);
  const removeMovie = () => {
    if (!user) { router.push("/login"); return; }
    Alert.alert("Filmi sil", `“${movie?.title}” kataloqdan silinsin?`, [
      { text: "Ləğv et", style: "cancel" },
      { text: "Sil", style: "destructive", onPress: async () => {
        try { await api(`/movies/${id}`, { method: "DELETE" }, true); Alert.alert("Netflix", "Film silindi.", [{ text: "OK", onPress: () => router.replace("/(tabs)") }]); }
        catch (error) { Alert.alert("Xəta", error instanceof Error ? error.message : "Film silinə bilmədi."); }
      } }
    ]);
  };
  const add = async () => {
    if (!user) return router.push("/login");
    try { await api("/watchlist", { method: "POST", body: JSON.stringify({ movieId: Number(id) }) }, true); Alert.alert("Netflix", "Film Watchlist-ə əlavə edildi."); }
    catch (e) { Alert.alert("Xəta", e instanceof Error ? e.message : "Əməliyyat alınmadı."); }
  };
  if (loading || !movie) return <Screen style={styles.loading}><ActivityIndicator color={colors.purple} /></Screen>;
  return <Screen>
    <ScrollView showsVerticalScrollIndicator={false}>
      <ImageBackground source={{ uri: movie.backdropUrl || movie.posterUrl }} style={styles.backdrop} imageStyle={styles.backdropImage}>
        <View style={styles.backdropOverlay} />
        <Pressable onPress={() => router.back()} style={styles.back}><Ionicons name="chevron-back" size={21} color="#FFFFFF" /></Pressable>
        <View style={styles.backdropBottom}><LocalizedText style={styles.featured}>NETFLIX FEATURE</LocalizedText><LocalizedText style={styles.backdropTitle}>{movie.title}</LocalizedText></View>
      </ImageBackground>
      <View style={styles.body}>
        <View style={styles.metaRow}><LocalizedText style={styles.meta}>{movie.releaseYear}  ·  {movie.genre}</LocalizedText><View style={styles.rating}><Ionicons name="star" size={13} color={colors.gold} /><LocalizedText style={styles.ratingText}>{movie.imdbRating.toFixed(1)} IMDb</LocalizedText></View></View>
        <LocalizedText style={styles.title}>{movie.title}</LocalizedText>
        <LocalizedText style={styles.section}>THE STORY</LocalizedText><LocalizedText style={styles.text}>{movie.overview}</LocalizedText>
        {!!movie.cast && <><LocalizedText style={styles.section}>CAST & CREW</LocalizedText><LocalizedText style={styles.text}>{movie.cast}</LocalizedText></>}
        {user && <View style={styles.manageRow}>
          <Pressable onPress={() => router.push({ pathname: "/edit-movie", params: { id: String(movie.id) } })} style={styles.manageButton}><Ionicons name="create-outline" size={16} color={colors.purple} /><LocalizedText style={styles.manageText}>Edit movie</LocalizedText></Pressable>
          <Pressable onPress={removeMovie} style={styles.deleteButton}><Ionicons name="trash-outline" size={16} color={colors.red} /><LocalizedText style={[styles.manageText, { color: colors.red }]}>Delete</LocalizedText></Pressable>
        </View>}
        <Pressable onPress={add} style={styles.button}><Ionicons name="bookmark-outline" color="#FFFFFF" size={17} /><LocalizedText style={styles.buttonText}>Add to Watchlist</LocalizedText></Pressable>
        <Pressable onPress={() => router.push(`/reviews/${movie.id}`)} style={styles.secondary}><Ionicons name="chatbubble-ellipses-outline" size={17} color={colors.purple} /><LocalizedText style={styles.secondaryText}>Read & write reviews</LocalizedText></Pressable>
        {!!movie.trailerUrl && <Pressable onPress={() => Linking.openURL(movie.trailerUrl).catch(() => Alert.alert("Xəta", "Trailer açıla bilmədi."))} style={styles.trailer}><Ionicons name="play-circle" size={18} color={colors.purple} /><LocalizedText style={styles.trailerText}>Watch trailer</LocalizedText></Pressable>}
      </View>
    </ScrollView>
  </Screen>;
}
const makeStyles = (c: ReturnType<typeof import("../../context/ThemeContext").useTheme>["colors"]) => StyleSheet.create({
  loading: { justifyContent: "center" }, backdrop: { height: 330, justifyContent: "space-between", padding: 18 }, backdropImage: { opacity: 0.94 }, backdropOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: c.overlay }, back: { width: 41, height: 41, borderRadius: 14, backgroundColor: "rgba(0,0,0,0.35)", alignItems: "center", justifyContent: "center" }, backdropBottom: { paddingBottom: 9 }, featured: { color: "#D7C4FF", fontSize: 8, letterSpacing: 2, fontWeight: "900" }, backdropTitle: { color: "#FFFFFF", fontSize: 30, lineHeight: 36, fontWeight: "900", marginTop: 8 },
  body: { padding: 20 }, metaRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, meta: { color: c.muted, fontSize: 10 }, rating: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: c.surfaceLight, borderRadius: 10, paddingHorizontal: 9, paddingVertical: 6 }, ratingText: { color: c.text, fontSize: 10, fontWeight: "800" }, title: { color: c.text, fontSize: 27, fontWeight: "900", marginTop: 12, letterSpacing: -0.5 }, section: { color: c.purple, fontSize: 9, letterSpacing: 1.8, fontWeight: "900", marginTop: 25, marginBottom: 9 }, text: { color: c.muted, lineHeight: 22, fontSize: 12 },
  manageRow: { flexDirection: "row", gap: 10, marginTop: 20 }, manageButton: { flex: 1, borderRadius: 13, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, padding: 13, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 }, deleteButton: { flex: 1, borderRadius: 13, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, padding: 13, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 }, manageText: { color: c.purple, fontSize: 11, fontWeight: "900" },
  button: { backgroundColor: c.purple, borderRadius: 14, padding: 15, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 9, marginTop: 27 }, buttonText: { color: "#FFFFFF", fontWeight: "900", fontSize: 12 }, secondary: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: 14, padding: 15, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 9, marginTop: 10 }, secondaryText: { color: c.text, fontWeight: "800", fontSize: 12 }, trailer: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, padding: 17 }, trailerText: { color: c.purple, fontWeight: "800", fontSize: 11 },
});
