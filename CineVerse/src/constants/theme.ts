export type ThemeMode = "dark" | "light";

export const palettes = {
  dark: {
    background: "#080808",
    surface: "#181818",
    surfaceLight: "#242424",
    purple: "#E50914",
    purpleDark: "#B20710",
    white: "#FFFFFF",
    text: "#F7F5FF",
    muted: "#A5A2B8",
    border: "#303030",
    red: "#E50914",
    gold: "#FFC66D",
    input: "#202020",
    overlay: "rgba(0,0,0,0.78)",
    card: "#181818",
  },
  light: {
    background: "#F5F3FA",
    surface: "#FFFFFF",
    surfaceLight: "#EEEAF7",
    purple: "#E50914",
    purpleDark: "#B20710",
    white: "#FFFFFF",
    text: "#211B31",
    muted: "#777187",
    border: "#E4DFEF",
    red: "#E50914",
    gold: "#B7791F",
    input: "#FFFFFF",
    overlay: "rgba(20,15,35,0.58)",
    card: "#FFFFFF",
  },
} as const;

export type AppColors = { [K in keyof typeof palettes.dark]: string };
export const colors = palettes.dark;
