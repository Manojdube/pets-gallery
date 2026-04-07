import { API_BASE_URL } from "./config";

export const apiFetch = async <T>(endpoint: string): Promise<T> => {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json();
};