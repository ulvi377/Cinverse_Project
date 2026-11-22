import LocalizedText from "../../components/LocalizedText";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Screen from "../../components/Screen";
import { api } from "../../services/api";
import { Review } from "../../types";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export default function ReviewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const load = () => api<Review[]>(`/reviews/movie/${id}`).then(setReviews).catch(() => {});
  useEffect(() => { load(); }, [id]);
  const submit = async () => {
    if (!user) return Alert.alert("Giriş lazımdır", "Rəy yazmaq üçün hesabına daxil ol.");
    if (!comment.trim()) return Alert.alert("Rəy boşdur", "Zəhmət olmasa rəy mətnini yaz.");
    try {
      const payload = { movieId: Number(id), rating, comment };
      if (editingId) await api(`/reviews/${editingId}`, { method: "PUT", body: JSON.stringify(payload) }, true);
      else await api("/reviews", { method: "POST", body: JSON.stringify(payload) }, true);
      setComment(""); setRating(5); setEditingId(null); load(); Alert.alert("Netflix", "Rəy yadda saxlanıldı.");
    } catch (e) { Alert.alert("Xəta", e instanceof Error ? e.message : "Rəy göndərilmədi."); }
  };
  const edit = (review: Review) => { setEditingId(review.id); setRating(review.rating); setComment(review.comment); };
  const remove = async (reviewId: number) => {
    try { await api(`/reviews/${reviewId}`, { method: "DELETE" }, true); load(); }
    catch (e) { Alert.alert("Xəta", e instanceof Error ? e.message : "Silinmədi."); }
  };
  return <Screen style={styles.screen}>
    <View style={styles.top}><Pressable onPress={() => router.back()} style={styles.back}><Ionicons name="chevron-back" color={colors.text} size={20} /></Pressable><LocalizedText style={styles.eyebrow}>COMMUNITY VOICES</LocalizedText></View>
    <LocalizedText style={styles.title}>Movie <LocalizedText style={styles.accent}>reviews</LocalizedText></LocalizedText>
    <View style={styles.composer}>
      <LocalizedText style={styles.composerTitle}>{editingId ? "Edit your review" : "Share your thoughts"}</LocalizedText>
      <LocalizedText style={styles.label}>YOUR RATING</LocalizedText>
      <View style={styles.stars}>{[1, 2, 3, 4, 5].map(n => <Pressable key={n} onPress={() => setRating(n)}><Ionicons name={n <= rating ? "star" : "star-outline"} color={n <= rating ? colors.gold : colors.muted} size={26} /></Pressable>)}</View>
      <TextInput value={comment} onChangeText={setComment} placeholder="What did you think of this movie?" placeholderTextColor={colors.muted} multiline style={styles.input} />
      <Pressable onPress={submit} style={styles.button}><LocalizedText style={styles.buttonText}>{editingId ? "Save changes" : "Publish review"}</LocalizedText></Pressable>
      {editingId && <LocalizedText onPress={() => { setEditingId(null); setComment(""); setRating(5); }} style={styles.cancel}>Cancel editing</LocalizedText>}
    </View>
    <LocalizedText style={styles.section}>WHAT PEOPLE ARE SAYING</LocalizedText>
    <ScrollView showsVerticalScrollIndicator={false}>
      {reviews.map(review => <View key={review.id} style={styles.review}>
        <View style={styles.reviewTop}><View style={styles.userAvatar}><LocalizedText style={styles.userInitial}>{review.userName?.[0] || "C"}</LocalizedText></View><View style={{ flex: 1 }}><LocalizedText style={styles.user}>{review.userName}</LocalizedText><LocalizedText style={styles.date}>{new Date(review.createdAt).toLocaleDateString()}</LocalizedText></View><LocalizedText style={styles.rating}>★ {review.rating}/5</LocalizedText></View>
        <LocalizedText style={styles.comment}>{review.comment}</LocalizedText>
        {user && review.userName === user.name && <View style={styles.reviewActions}><LocalizedText onPress={() => edit(review)} style={styles.edit}>Edit</LocalizedText><LocalizedText onPress={() => remove(review.id)} style={styles.remove}>Delete</LocalizedText></View>}
      </View>)}
      {!reviews.length && <LocalizedText style={styles.empty}>No reviews yet. Be the first to share your thoughts.</LocalizedText>}
    </ScrollView>
  </Screen>;
}
const makeStyles = (c: ReturnType<typeof import("../../context/ThemeContext").useTheme>["colors"]) => StyleSheet.create({
  screen: { padding: 18 }, top: { flexDirection: "row", alignItems: "center", gap: 12, paddingTop: 7 }, back: { width: 37, height: 37, borderRadius: 12, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, alignItems: "center", justifyContent: "center" }, eyebrow: { color: c.purple, fontSize: 8, fontWeight: "900", letterSpacing: 1.7 }, title: { color: c.text, fontSize: 27, fontWeight: "900", marginTop: 18, marginBottom: 17 }, accent: { color: c.purple },
  composer: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: 19, padding: 15 }, composerTitle: { color: c.text, fontSize: 14, fontWeight: "900" }, label: { color: c.muted, fontSize: 8, letterSpacing: 1.5, fontWeight: "900", marginTop: 14 }, stars: { flexDirection: "row", gap: 9, marginVertical: 10 }, input: { backgroundColor: c.input, color: c.text, padding: 13, borderRadius: 12, minHeight: 78, textAlignVertical: "top", fontSize: 11, borderWidth: 1, borderColor: c.border }, button: { backgroundColor: c.purple, padding: 13, borderRadius: 12, alignItems: "center", marginTop: 10 }, buttonText: { color: "#FFFFFF", fontWeight: "900", fontSize: 11 }, cancel: { color: c.muted, textAlign: "center", marginTop: 10, fontSize: 10 },
  section: { color: c.muted, fontSize: 8, letterSpacing: 1.7, fontWeight: "900", marginTop: 22, marginBottom: 11 }, review: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, padding: 14, borderRadius: 16, marginBottom: 10 }, reviewTop: { flexDirection: "row", alignItems: "center", gap: 10 }, userAvatar: { width: 34, height: 34, borderRadius: 12, backgroundColor: c.surfaceLight, alignItems: "center", justifyContent: "center" }, userInitial: { color: c.purple, fontWeight: "900" }, user: { color: c.text, fontWeight: "800", fontSize: 11 }, date: { color: c.muted, fontSize: 8, marginTop: 3 }, rating: { color: c.gold, fontSize: 10, fontWeight: "900" }, comment: { color: c.muted, marginTop: 12, lineHeight: 19, fontSize: 11 }, reviewActions: { flexDirection: "row", justifyContent: "flex-end", gap: 17, marginTop: 12 }, edit: { color: c.purple, fontSize: 10, fontWeight: "800" }, remove: { color: c.red, fontSize: 10, fontWeight: "800" }, empty: { color: c.muted, fontSize: 11, textAlign: "center", paddingVertical: 25 },
});
