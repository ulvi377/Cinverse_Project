import LocalizedText from "../components/LocalizedText";
import React, { useEffect, useState } from "react";
import { Modal, SectionList, StyleSheet, Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Screen from "../components/Screen";
import { api } from "../services/api";
import { WatchlistItem } from "../types";
import { useTheme } from "../context/ThemeContext";

export default function WatchedScreen() {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [selected, setSelected] = useState<WatchlistItem | null>(null);
  useEffect(() => { api<WatchlistItem[]>("/watchlist", {}, true).then(data => setItems(data.filter(x => x.status === "Watched"))).catch(() => {}); }, []);
  const average = items.length ? (items.reduce((sum, x) => sum + x.movie.imdbRating, 0) / items.length).toFixed(1) : "0.0";
  const genres = items.reduce<Record<string, number>>((acc, x) => { acc[x.movie.genre] = (acc[x.movie.genre] || 0) + 1; return acc; }, {});
  const topGenre = Object.entries(genres).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
  const sections = Object.entries(items.reduce<Record<string, WatchlistItem[]>>((acc, item) => { (acc[item.movie.genre] ||= []).push(item); return acc; }, {})).map(([title, data]) => ({ title, data }));
  return <Screen style={styles.screen}>
    <View style={styles.top}><Pressable onPress={() => router.back()} style={styles.back}><Ionicons name="chevron-back" size={21} color={colors.text} /></Pressable><LocalizedText style={styles.eyebrow}>YOUR CINEMA JOURNEY</LocalizedText></View>
    <LocalizedText style={styles.title}>Watched <LocalizedText style={styles.accent}>movies</LocalizedText></LocalizedText><LocalizedText style={styles.subtitle}>Every story leaves a little something behind.</LocalizedText>
    <View style={styles.stats}>
      <View style={styles.stat}><LocalizedText style={styles.number}>{items.length}</LocalizedText><LocalizedText style={styles.caption}>WATCHED</LocalizedText></View>
      <View style={styles.divider} />
      <View style={styles.stat}><LocalizedText numberOfLines={1} style={[styles.number, { fontSize: 17 }]}>{topGenre}</LocalizedText><LocalizedText style={styles.caption}>TOP GENRE</LocalizedText></View>
      <View style={styles.divider} />
      <View style={styles.stat}><LocalizedText style={styles.number}>{average}</LocalizedText><LocalizedText style={styles.caption}>AVG. RATING</LocalizedText></View>
    </View>
    <SectionList sections={sections} keyExtractor={x => String(x.id)} contentContainerStyle={{ paddingBottom: 20 }} stickySectionHeadersEnabled={false} ListEmptyComponent={<View style={styles.empty}><Ionicons name="ticket-outline" size={36} color={colors.muted} /><LocalizedText style={styles.emptyText}>Your watched movies will appear here.</LocalizedText></View>} renderSectionHeader={({ section }) => <LocalizedText style={styles.sectionTitle}>{section.title}</LocalizedText>} renderItem={({ item }) => <Pressable onPress={() => setSelected(item)} style={styles.item}><View style={styles.movieIcon}><Ionicons name="film" size={18} color={colors.purple} /></View><View style={{ flex: 1 }}><LocalizedText style={styles.movie}>{item.movie.title}</LocalizedText><LocalizedText style={styles.genre}>{item.movie.releaseYear}</LocalizedText></View><LocalizedText style={styles.rating}>★ {item.movie.imdbRating.toFixed(1)}</LocalizedText></Pressable>} />
    <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}><View style={styles.modalBackdrop}><View style={styles.modalCard}><Pressable onPress={() => setSelected(null)} style={styles.modalClose}><Ionicons name="close" size={20} color={colors.text} /></Pressable><LocalizedText style={styles.modalTitle}>{selected?.movie.title}</LocalizedText><LocalizedText style={styles.modalText}>{selected?.movie.overview}</LocalizedText><LocalizedText style={styles.modalRating}>★ {selected?.movie.imdbRating.toFixed(1)}  ·  {selected?.movie.releaseYear}</LocalizedText><Pressable onPress={() => { const id = selected?.movieId; setSelected(null); if (id) router.push(`/movie/${id}`); }} style={styles.modalButton}><LocalizedText style={styles.modalButtonText}>Open movie details</LocalizedText></Pressable></View></View></Modal>
  </Screen>;
}
const makeStyles = (c: ReturnType<typeof import("../context/ThemeContext").useTheme>["colors"]) => StyleSheet.create({
  screen: { padding: 20 }, top: { flexDirection: "row", alignItems: "center", gap: 12, paddingTop: 12 }, back: { width: 38, height: 38, borderRadius: 13, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, alignItems: "center", justifyContent: "center" }, eyebrow: { color: c.purple, fontSize: 9, fontWeight: "900", letterSpacing: 1.7 }, title: { color: c.text, fontSize: 29, fontWeight: "900", marginTop: 22 }, accent: { color: c.purple }, subtitle: { color: c.muted, fontSize: 11, marginTop: 7, lineHeight: 17 },
  stats: { flexDirection: "row", alignItems: "center", justifyContent: "space-around", backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, paddingVertical: 18, borderRadius: 19, marginTop: 23, marginBottom: 22 }, stat: { alignItems: "center", flex: 1 }, number: { color: c.purple, fontSize: 22, fontWeight: "900" }, caption: { color: c.muted, fontSize: 7, letterSpacing: 1, fontWeight: "900", marginTop: 6 }, divider: { width: 1, height: 34, backgroundColor: c.border },
  sectionTitle: { color: c.purple, fontSize: 10, fontWeight: "900", letterSpacing: 1.4, marginTop: 10, marginBottom: 10 }, modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.72)", justifyContent: "center", padding: 22 }, modalCard: { backgroundColor: c.surface, borderRadius: 22, borderWidth: 1, borderColor: c.border, padding: 22 }, modalClose: { alignSelf: "flex-end", padding: 5 }, modalTitle: { color: c.text, fontSize: 21, fontWeight: "900", marginTop: 8 }, modalText: { color: c.muted, fontSize: 12, lineHeight: 19, marginTop: 12 }, modalRating: { color: c.gold, fontSize: 11, fontWeight: "900", marginTop: 15 }, modalButton: { backgroundColor: c.purple, borderRadius: 12, padding: 13, alignItems: "center", marginTop: 18 }, modalButtonText: { color: "#fff", fontSize: 11, fontWeight: "900" },
  item: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: 15, padding: 12, marginBottom: 9 }, movieIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: c.surfaceLight, alignItems: "center", justifyContent: "center" }, movie: { color: c.text, fontSize: 12, fontWeight: "800" }, genre: { color: c.muted, fontSize: 9, marginTop: 4 }, rating: { color: c.gold, fontSize: 11, fontWeight: "900" }, empty: { alignItems: "center", paddingTop: 45 }, emptyText: { color: c.muted, fontSize: 11, marginTop: 12 },
});
