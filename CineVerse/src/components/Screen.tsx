import React from "react";
import { SafeAreaView, ViewStyle } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function Screen({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const { colors } = useTheme();
  return <SafeAreaView style={[{ flex: 1, backgroundColor: colors.background }, style]}>{children}</SafeAreaView>;
}
