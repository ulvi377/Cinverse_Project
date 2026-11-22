import { Platform } from "react-native";
import { getAuthToken } from "./tokenStorage";


const API_HOST =
  Platform.OS === "web"
    ? "http://localhost:5030"
    : Platform.OS === "android" && !__DEV__
      ? "http://192.168.1.102:5030"
      : Platform.OS === "android"
        ? "http://192.168.1.102:5030"
        : "http://localhost:5030";
export const API_URL = `${API_HOST}/api`;

export async function api<T>(path: string, options: RequestInit = {}, auth = false): Promise<T> {
  const token = auth ? await getAuthToken() : null;
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
      }
    });
  } catch (error) {
  console.log("API FETCH ERROR:", error);
  throw new Error(`Serverə qoşulmaq mümkün olmadı: ${String(error)}`);
}

  const responseText = await response.text();
  let data: any = null;
  if (responseText) {
    try { data = JSON.parse(responseText); }
    catch { data = null; }
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.title || `Server xətası: ${response.status}`);
  }
  if (response.status === 204 || !responseText) return undefined as T;
  return data as T;
}
