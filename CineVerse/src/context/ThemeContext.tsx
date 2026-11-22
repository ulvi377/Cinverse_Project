import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AppColors, palettes, ThemeMode } from "../constants/theme";

type ThemeContextType = {
  mode: ThemeMode;
  colors: AppColors;
  ready: boolean;
  toggleTheme: () => Promise<void>;
  setTheme: (mode: ThemeMode) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("cineverse_theme")
      .then(value => setMode(value === "light" ? "light" : "dark"))
      .finally(() => setReady(true));
  }, []);

  const setTheme = async (value: ThemeMode) => {
    setMode(value);
    await AsyncStorage.setItem("cineverse_theme", value);
  };

  const toggleTheme = async () => setTheme(mode === "dark" ? "light" : "dark");
  const value = useMemo(() => ({ mode, colors: palettes[mode], ready, toggleTheme, setTheme }), [mode, ready]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme ThemeProvider daxilində istifadə olunmalıdır.");
  return context;
}
