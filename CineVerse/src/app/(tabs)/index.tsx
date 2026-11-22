import LocalizedText from "../../components/LocalizedText";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Screen from "../../components/Screen";
import MovieCard from "../../components/MovieCard";
import { api } from "../../services/api";
import { Movie } from "../../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const styles = makeStyles(colors);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (nextPage = 1, refresh = false) => {
    try {
      setError("");
      const data = await api<{ movies: Movie[]; total: number }>(`/movies?page=${nextPage}&pageSize=10`);
      setMovies(old => refresh || nextPage === 1 ? data.movies : [...old, ...data.movies]);
      setTotal(data.total);
      setPage(nextPage);
      await AsyncStorage.setItem("cineverse_movie_cache", JSON.stringify({ movies: data.movies, total: data.total, savedAt: Date.now() }));
    } catch {
      if (nextPage === 1) {
        const cached = await AsyncStorage.getItem("cineverse_movie_cache");
        if (cached) {
          const parsed = JSON.parse(cached);
          setMovies(Array.isArray(parsed) ? parsed : parsed.movies || []);
          if (parsed.total) setTotal(parsed.total);
        }
      }
      setError("Serverə qoşulmaq mümkün olmadı. Saxlanmış filmlər göstərilir.");
    } finally { setLoading(false); setRefreshing(false); }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));
  const refresh = () => { setRefreshing(true); load(1, true); };
  const popular = [...movies].sort((a, b) => b.imdbRating - a.imdbRating);
  const newest = [...movies].sort((a, b) => b.releaseYear - a.releaseYear);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.purple} />}>
        <View style={styles.header}>
          <Pressable onPress={() => router.push("/drawer")} style={{ width: 38, height: 38, borderRadius: 13, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", marginRight: 10 }}><Ionicons name="menu" color={colors.text} size={21} /></Pressable><View style={{ flex: 1 }}><LocalizedText style={styles.brand}>NETFLIX</LocalizedText><LocalizedText style={styles.sub}>YOUR PERSONAL MOVIE UNIVERSE</LocalizedText></View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}><Pressable style={styles.addButton} onPress={() => user ? router.push("/add-movie") : router.push("/login")}><Ionicons name="add" color="#FFFFFF" size={22} /></Pressable><Pressable style={styles.avatar} onPress={() => router.push("/(tabs)/profile")}><Ionicons name="person" color="#FFFFFF" size={18} /></Pressable></View>
        </View>
        <View style={styles.hero}>
          <View style={styles.heroGlow} />
          <LocalizedText style={styles.kicker}>TONIGHT'S ESCAPE STARTS HERE</LocalizedText>
          <LocalizedText style={styles.heroTitle}>Stories worth{ "\n" }<LocalizedText style={styles.heroAccent}>staying in for.</LocalizedText></LocalizedText>
          <LocalizedText style={styles.heroSub}>Find your next obsession in a universe of cinema.</LocalizedText>
          <Pressable style={styles.explore} onPress={() => router.push("/(tabs)/search")}><LocalizedText style={styles.exploreText}>Explore movies</LocalizedText><Ionicons name="arrow-forward" size={16} color="#FFFFFF" /></Pressable>
          <View style={styles.heroBadge}><Ionicons name="sparkles" color={colors.gold} size={13} /><LocalizedText style={styles.heroBadgeText}>CURATED FOR YOU</LocalizedText></View>
        </View>
        {loading && movies.length === 0 ? <ActivityIndicator color={colors.purple} style={{ marginTop: 25 }} /> : null}
        {!!error && <Pressable onPress={() => load(1, true)} style={{ marginHorizontal: 18, marginTop: 12, padding: 12, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}><LocalizedText style={styles.error}>{error}  ·  Yenidən yoxla</LocalizedText></Pressable>}
        <View style={styles.sectionHeader}><View><LocalizedText style={styles.sectionTitle}>Trending now</LocalizedText><LocalizedText style={styles.sectionSub}>The films everyone's talking about</LocalizedText></View><LocalizedText style={styles.seeAll} onPress={() => router.push("/(tabs)/search")}>SEE ALL</LocalizedText></View>
        <FlatList horizontal data={movies} keyExtractor={item => String(item.id)} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 18 }} renderItem={({ item }) => <MovieCard movie={item} onPress={() => router.push(`/movie/${item.id}`)} />} />
        <View style={styles.sectionHeader}><View><LocalizedText style={styles.sectionTitle}>Top rated</LocalizedText><LocalizedText style={styles.sectionSub}>Critically loved, endlessly watchable</LocalizedText></View></View>
        <FlatList horizontal data={popular} keyExtractor={item => `r${item.id}`} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 18 }} renderItem={({ item }) => <MovieCard movie={item} onPress={() => router.push(`/movie/${item.id}`)} />} />
        <View style={styles.sectionHeader}><View><LocalizedText style={styles.sectionTitle}>Fresh arrivals</LocalizedText><LocalizedText style={styles.sectionSub}>A little something new</LocalizedText></View></View>
        <FlatList horizontal data={newest} keyExtractor={item => `n${item.id}`} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 18 }} renderItem={({ item }) => <MovieCard movie={item} onPress={() => router.push(`/movie/${item.id}`)} />} />
        <LocalizedText style={styles.footer}>{movies.length} / {total} films loaded</LocalizedText>
        {movies.length < total && <LocalizedText onPress={() => load(page + 1)} style={styles.more}>Load more movies  →</LocalizedText>}
      </ScrollView>
    </Screen>
  );
}

const makeStyles = (c: ReturnType<typeof useTheme>["colors"]) => StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 13, paddingBottom: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brand: { color: c.text, fontSize: 22, fontWeight: "900", letterSpacing: 2.2 },
  sub: { color: c.muted, marginTop: 4, fontSize: 8, letterSpacing: 1.5, fontWeight: "800" },
  avatar: { width: 42, height: 42, borderRadius: 15, backgroundColor: c.purple, alignItems: "center", justifyContent: "center" },
  addButton: { width: 42, height: 42, borderRadius: 15, backgroundColor: c.surfaceLight, borderWidth: 1, borderColor: c.border, alignItems: "center", justifyContent: "center" },
  hero: { marginHorizontal: 18, marginBottom: 12, borderRadius: 25, backgroundColor: c.surfaceLight, borderWidth: 1, borderColor: c.border, padding: 22, overflow: "hidden" },
  heroGlow: { position: "absolute", width: 190, height: 190, borderRadius: 100, backgroundColor: c.purple, opacity: 0.12, right: -60, top: -65 },
  kicker: { color: c.purple, fontSize: 8, letterSpacing: 2, fontWeight: "900" },
  heroTitle: { color: c.text, fontSize: 31, fontWeight: "900", lineHeight: 36, marginTop: 16, letterSpacing: -0.7 },
  heroAccent: { color: c.purple },
  heroSub: { color: c.muted, fontSize: 11, lineHeight: 18, marginTop: 9, maxWidth: 230 },
  explore: { marginTop: 19, backgroundColor: c.purple, alignSelf: "flex-start", borderRadius: 13, paddingHorizontal: 15, paddingVertical: 11, flexDirection: "row", alignItems: "center", gap: 10 },
  exploreText: { color: "#FFFFFF", fontSize: 11, fontWeight: "800" },
  heroBadge: { position: "absolute", right: 17, bottom: 20, flexDirection: "row", alignItems: "center", gap: 5 },
  heroBadgeText: { color: c.muted, fontSize: 7, fontWeight: "900", letterSpacing: 1 },
  sectionHeader: { marginHorizontal: 18, marginTop: 24, marginBottom: 13, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { color: c.text, fontSize: 19, fontWeight: "900", letterSpacing: -0.3 },
  sectionSub: { color: c.muted, fontSize: 10, marginTop: 4 },
  seeAll: { color: c.purple, fontSize: 9, fontWeight: "900", letterSpacing: 1 },
  error: { color: c.red, marginHorizontal: 18, marginTop: 10, fontSize: 11 },
  footer: { color: c.muted, textAlign: "center", margin: 18, fontSize: 10 },
  more: { color: c.purple, textAlign: "center", padding: 16, fontWeight: "800", fontSize: 12 },
});
