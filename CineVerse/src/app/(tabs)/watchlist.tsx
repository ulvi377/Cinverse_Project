import LocalizedText from "../../components/LocalizedText";
import React, { useCallback, useState } from "react";
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Screen from "../../components/Screen";
import { api } from "../../services/api";
import { WatchlistItem } from "../../types";
import { useTheme } from "../../context/ThemeContext";

export default function WatchlistScreen() {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const load = useCallback(() => { api<WatchlistItem[]>("/watchlist", {}, true).then(setItems).catch(e => Alert.alert("Xəta", e.message)); }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));
  const update = async (item: WatchlistItem) => {
    try { await api(`/watchlist/${item.id}`, { method: "PATCH", body: JSON.stringify({ status: item.status === "Watched" ? "PlanToWatch" : "Watched" }) }, true); load(); }
    catch (e) { Alert.alert("Xəta", e instanceof Error ? e.message : "Status dəyişdirilmədi."); }
  };
  const remove = async (id: number) => {
    try { await api(`/watchlist/${id}`, { method: "DELETE" }, true); load(); }
    catch (e) { Alert.alert("Xəta", e instanceof Error ? e.message : "Film silinmədi."); }
  };
  return <Screen>
    <View style={styles.header}><LocalizedText style={styles.eyebrow}>YOUR PERSONAL COLLECTION</LocalizedText><LocalizedText style={styles.title}>My <LocalizedText style={styles.accent}>Watchlist</LocalizedText></LocalizedText><LocalizedText style={styles.subtitle}>All the stories waiting for you.</LocalizedText></View>
    <FlatList data={items} keyExtractor={x => String(x.id)} contentContainerStyle={{ paddingHorizontal: 17, paddingBottom: 25 }} ListEmptyComponent={<View style={styles.empty}><Ionicons name="bookmark-outline" size={38} color={colors.muted} /><LocalizedText style={styles.emptyTitle}>Your list is waiting</LocalizedText><LocalizedText style={styles.emptyText}>Save movies you want to watch and they will appear here.</LocalizedText></View>}
      renderItem={({ item }) => <View style={styles.item}>
        <Pressable onPress={() => router.push(`/movie/${item.movieId}`)}><Image source={{ uri: item.movie.posterUrl }} style={styles.poster} /></Pressable>
        <View style={styles.info}>
          <LocalizedText numberOfLines={2} style={styles.name}>{item.movie.title}</LocalizedText><LocalizedText style={styles.meta}>{item.movie.genre} · {item.movie.releaseYear}</LocalizedText><LocalizedText style={styles.rating}>★ {item.movie.imdbRating.toFixed(1)}</LocalizedText>
          <View style={styles.actions}><Pressable onPress={() => update(item)} style={styles.status}><Ionicons name={item.status === "Watched" ? "checkmark-circle" : "play-circle-outline"} size={14} color={colors.purple} /><LocalizedText style={styles.actionText}>{item.status === "Watched" ? "Watched" : "Mark watched"}</LocalizedText></Pressable><Pressable onPress={() => remove(item.id)} style={styles.remove}><Ionicons name="trash-outline" size={15} color={colors.red} /></Pressable></View>
        </View>
      </View>} />
  </Screen>;
}
const makeStyles = (c: ReturnType<typeof useTheme>["colors"]) => StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 25, paddingBottom: 22 }, eyebrow: { color: c.purple, fontSize: 9, letterSpacing: 1.8, fontWeight: "900", marginBottom: 9 },
  title: { color: c.text, fontSize: 29, fontWeight: "900", letterSpacing: -0.6 }, accent: { color: c.purple }, subtitle: { color: c.muted, marginTop: 7, fontSize: 11 },
  item: { flexDirection: "row", padding: 12, gap: 14, borderRadius: 18, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, marginBottom: 11 },
  poster: { width: 91, height: 128, borderRadius: 12, backgroundColor: c.surfaceLight }, info: { flex: 1, justifyContent: "center", gap: 6 }, name: { color: c.text, fontSize: 14, fontWeight: "800" }, meta: { color: c.muted, fontSize: 10 }, rating: { color: c.gold, fontSize: 11, fontWeight: "800" },
  actions: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 5 }, status: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: c.surfaceLight, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10 }, actionText: { color: c.purple, fontSize: 9, fontWeight: "800" }, remove: { width: 31, height: 31, borderRadius: 10, backgroundColor: c.surfaceLight, alignItems: "center", justifyContent: "center" },
  empty: { alignItems: "center", paddingTop: 80, paddingHorizontal: 35 }, emptyTitle: { color: c.text, fontSize: 16, fontWeight: "900", marginTop: 14 }, emptyText: { color: c.muted, fontSize: 11, textAlign: "center", lineHeight: 18, marginTop: 7 },
});
