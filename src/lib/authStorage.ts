export const AUTH_STORAGE_KEY = "rafa-store-auth";

export interface StoredAuth {
  isAuthenticated: boolean;
  email: string;
}

export function loadAuthFromStorage(): StoredAuth {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, email: "" };
  }
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return { isAuthenticated: false, email: "" };
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return { isAuthenticated: false, email: "" };
  }
}
