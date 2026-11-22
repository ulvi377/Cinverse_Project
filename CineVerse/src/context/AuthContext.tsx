import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { getAuthToken, removeAuthToken, saveAuthToken } from "../services/tokenStorage";
import { User } from "../types";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);
const USER_KEY = "cineverse_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([AsyncStorage.getItem(USER_KEY), getAuthToken()])
      .then(async ([value, token]) => {
        if (!mounted) return;
        if (value && token) {
          const profile = JSON.parse(value) as Omit<User, "token">;
          setUser({ ...profile, token });
        } else if (value || token) {
          await AsyncStorage.removeItem(USER_KEY);
          await removeAuthToken();
        }
      })
      .catch(async () => {
        await AsyncStorage.removeItem(USER_KEY);
        await removeAuthToken();
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const saveUser = async (data: User) => {
    if (!data?.token || !data.userId || !data.email) {
      throw new Error("Server qeydiyyat cavabını düzgün göndərmədi. Backend cavabını yoxlamaq lazımdır.");
    }
    const { token, ...profile } = data;
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(profile));
    await saveAuthToken(token);
    setUser(data);
  };

  const login = async (email: string, password: string) => {
    const data = await api<User>("/auth/login", { method: "POST", body: JSON.stringify({ email: email.trim(), password }) });
    await saveUser(data);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await api<User>("/auth/register", { method: "POST", body: JSON.stringify({ name: name.trim(), email: email.trim(), password }) });
    await saveUser(data);
  };

  const logout = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
    await removeAuthToken();
    setUser(null);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth AuthProvider daxilində istifadə olunmalıdır.");
  return context;
}
