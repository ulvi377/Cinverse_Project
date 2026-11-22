import LocalizedText from "../../components/LocalizedText";

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Screen from "../../components/Screen";
import MovieCard from "../../components/MovieCard";
import { api } from "../../services/api";
import { Movie } from "../../types";
import { useTheme } from "../../context/ThemeContext";

export default function SearchScreen() {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [genres, setGenres] = useState<string[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api<string[]>("/movies/genres")
      .then(data => setGenres(Array.isArray(data) ? data : []))
      .catch(() => setGenres([]));
  }, []);

  useEffect(() => {
    let active = true;

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");

      const cacheKey = `cineverse_search_${search}_${genre}_${minRating}`;

      try {
        const query =
          `/movies?search=${encodeURIComponent(search)}` +
          `&genre=${encodeURIComponent(genre)}` +
          `&minRating=${minRating}&page=1&pageSize=30`;

        const data = await api<{ movies: Movie[] }>(query);

        if (!active) return;

        const results = Array.isArray(data?.movies) ? data.movies : [];

        setMovies(results);
        await AsyncStorage.setItem(cacheKey, JSON.stringify(results));
      } catch {
        try {
          const cached = await AsyncStorage.getItem(cacheKey);

          if (!active) return;

          if (cached) {
            setMovies(JSON.parse(cached) as Movie[]);
            setError("Offline mode · Saved search results");
          } else {
            setMovies([]);
            setError("Could not connect. Check your connection.");
          }
        } catch {
          if (!active) return;
          setMovies([]);
          setError("Could not load movies. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }, 350);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search, genre, minRating]);

  const retry = async () => {
    setLoading(true);
    setError("");

    try {
      const query =
        `/movies?search=${encodeURIComponent(search)}` +
        `&genre=${encodeURIComponent(genre)}` +
        `&minRating=${minRating}&page=1&pageSize=30`;

      const data = await api<{ movies: Movie[] }>(query);
      const results = Array.isArray(data?.movies) ? data.movies : [];

      setMovies(results);

      const cacheKey = `cineverse_search_${search}_${genre}_${minRating}`;
      await AsyncStorage.setItem(cacheKey, JSON.stringify(results));
    } catch {
      setError("Still offline. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const header = (
    <View>
      <View style={styles.header}>
        <LocalizedText style={styles.eyebrow}>THE COLLECTION</LocalizedText>
        <LocalizedText style={styles.title}>
          Find your next{"\n"}
          <LocalizedText style={styles.accent}>favorite film.</LocalizedText>
        </LocalizedText>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={19} color={colors.muted} />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search titles, stories..."
          placeholderTextColor={colors.muted}
          style={styles.input}
          returnKeyType="search"
        />

        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={18} color={colors.muted} />
          </Pressable>
        )}
      </View>

      <LocalizedText style={styles.label}>EXPLORE BY GENRE</LocalizedText>

      <FlatList
        horizontal
        data={["All", ...genres.filter(x => x !== "All")]}
        keyExtractor={item => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 17,
          paddingBottom: 15
        }}
        renderItem={({ item }) => (
          <Pressable onPress={() => setGenre(item)}>
            <LocalizedText style={[styles.chip, genre === item && styles.active]}>
              {item}
            </LocalizedText>
          </Pressable>
        )}
      />

      <LocalizedText style={styles.label}>MINIMUM IMDb RATING</LocalizedText>

      <View style={styles.ratingRow}>
        {[0, 5, 6, 7, 8, 9].map(value => (
          <Pressable
            key={value}
            onPress={() => setMinRating(value)}
            style={[
              styles.ratingChip,
              minRating === value && styles.active
            ]}
          >
            <LocalizedText
              style={[
                styles.ratingText,
                minRating === value && { color: "#FFFFFF" }
              ]}
            >
              {value === 0 ? "Any" : `${value}+`}
            </LocalizedText>
          </Pressable>
        ))}
      </View>

      <View style={styles.resultsHeader}>
        <LocalizedText style={styles.resultsTitle}>
          {search || genre !== "All" || minRating > 0
            ? "Search results"
            : "Discover movies"}
        </LocalizedText>

        <LocalizedText style={styles.count}>
          {movies.length} FILMS
        </LocalizedText>
      </View>

      {loading && (
        <ActivityIndicator
          color={colors.purple}
          style={{ marginVertical: 12 }}
        />
      )}

      {!!error && (
        <Pressable onPress={retry} style={styles.errorBox}>
          <LocalizedText style={styles.errorText}>
            {error} · Retry
          </LocalizedText>
        </Pressable>
      )}
    </View>
  );

  return (
    <Screen>
      <FlatList
        data={movies}
        numColumns={2}
        keyExtractor={item => String(item.id)}
        ListHeaderComponent={header}
        contentContainerStyle={{
          paddingHorizontal: 17,
          paddingBottom: 30
        }}
        columnWrapperStyle={{ gap: 14 }}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onPress={() => router.push(`/movie/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Ionicons
                name="film-outline"
                size={34}
                color={colors.muted}
              />
              <LocalizedText style={styles.emptyText}>
                No movies found. Try another title or filter.
              </LocalizedText>
            </View>
          ) : undefined
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </Screen>
  );
}

const makeStyles = (c: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    header: {
      paddingHorizontal: 20,
      paddingTop: 25,
      paddingBottom: 20
    },
    eyebrow: {
      color: c.purple,
      fontSize: 9,
      letterSpacing: 2,
      fontWeight: "900",
      marginBottom: 10
    },
    title: {
      color: c.text,
      fontSize: 29,
      lineHeight: 35,
      fontWeight: "900",
      letterSpacing: -0.7
    },
    accent: {
      color: c.purple
    },
    searchBox: {
      marginHorizontal: 17,
      flexDirection: "row",
      alignItems: "center",
      gap: 11,
      backgroundColor: c.surface,
      borderRadius: 16,
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: c.border,
      height: 54
    },
    input: {
      flex: 1,
      color: c.text,
      fontSize: 12
    },
    label: {
      color: c.muted,
      fontSize: 9,
      letterSpacing: 1.8,
      fontWeight: "900",
      marginHorizontal: 19,
      marginTop: 15,
      marginBottom: 11
    },
    chip: {
      color: c.muted,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      paddingHorizontal: 15,
      paddingVertical: 9,
      borderRadius: 20,
      marginRight: 8,
      overflow: "hidden",
      fontSize: 10,
      fontWeight: "700"
    },
    active: {
      color: "#FFFFFF",
      backgroundColor: c.purple,
      borderColor: c.purple
    },
    ratingRow: {
      flexDirection: "row",
      gap: 7,
      paddingHorizontal: 18,
      marginBottom: 18
    },
    ratingChip: {
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      backgroundColor: c.surface,
      paddingHorizontal: 13,
      paddingVertical: 8
    },
    ratingText: {
      color: c.muted,
      fontSize: 10,
      fontWeight: "800"
    },
    resultsHeader: {
      marginHorizontal: 19,
      marginBottom: 13,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    },
    resultsTitle: {
      color: c.text,
      fontSize: 15,
      fontWeight: "900"
    },
    count: {
      color: c.muted,
      fontSize: 8,
      letterSpacing: 1.2,
      fontWeight: "900"
    },
    empty: {
      alignItems: "center",
      paddingTop: 35,
      gap: 12
    },
    emptyText: {
      color: c.muted,
      fontSize: 11,
      textAlign: "center",
      paddingHorizontal: 25
    },
    errorBox: {
      marginHorizontal: 18,
      marginBottom: 12,
      padding: 11,
      borderRadius: 12,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border
    },
    errorText: {
      color: c.red,
      fontSize: 10,
      textAlign: "center"
    }
  });
