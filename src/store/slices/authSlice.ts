import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AUTH_STORAGE_KEY, loadAuthFromStorage } from "@/lib/authStorage";

interface AuthState {
  isAuthenticated: boolean;
  email: string;
}

export function getAuthState(): AuthState {
  return loadAuthFromStorage();
}

const authSlice = createSlice({
  name: "auth",
  initialState: { isAuthenticated: false, email: "" },
  reducers: {
    hydrateAuth: (state) => {
      const auth = loadAuthFromStorage();
      state.isAuthenticated = auth.isAuthenticated;
      state.email = auth.email;
    },
    login: (state, action: PayloadAction<{ email: string }>) => {
      state.isAuthenticated = true;
      state.email = action.payload.email;
      if (typeof window !== "undefined") {
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ isAuthenticated: true, email: action.payload.email }),
        );
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.email = "";
      if (typeof window !== "undefined") {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    },
  },
});

export const { hydrateAuth, login, logout } = authSlice.actions;
export default authSlice.reducer;
