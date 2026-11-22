import LocalizedText from "./LocalizedText";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Movie } from "../types";
import { useTheme } from "../context/ThemeContext";

export default function MovieCard({ movie, onPress }: { movie: Movie; onPress: () => void }) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    card: { width: 148, marginRight: 14 },
    posterWrap: { borderRadius: 17, overflow: "hidden", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
    poster: { width: 148, height: 214, backgroundColor: colors.surface },
    info: { paddingTop: 9, gap: 4 },
    title: { color: colors.text, fontSize: 13, fontWeight: "800" },
    meta: { color: colors.muted, fontSize: 10 },
    rating: { color: colors.gold, fontSize: 11, fontWeight: "800" },
  });
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.posterWrap}><Image source={{ uri: movie.posterUrl }} style={styles.poster} /></View>
      <View style={styles.info}>
        <LocalizedText numberOfLines={1} style={styles.title}>{movie.title}</LocalizedText>
        <LocalizedText style={styles.meta}>{movie.releaseYear} · {movie.genre}</LocalizedText>
        <LocalizedText style={styles.rating}>★ {Number(movie.imdbRating || 0).toFixed(1)}</LocalizedText>
      </View>
    </Pressable>
  );
}
