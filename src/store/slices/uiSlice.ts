import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  cartDrawerOpen: boolean;
  mobileMenuOpen: boolean;
  headerScrolled: boolean;
}

const initialState: UiState = {
  cartDrawerOpen: false,
  mobileMenuOpen: false,
  headerScrolled: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openCartDrawer: (state) => {
      state.cartDrawerOpen = true;
    },
    closeCartDrawer: (state) => {
      state.cartDrawerOpen = false;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false;
    },
    setHeaderScrolled: (state, action: PayloadAction<boolean>) => {
      state.headerScrolled = action.payload;
    },
  },
});

export const {
  openCartDrawer,
  closeCartDrawer,
  toggleMobileMenu,
  closeMobileMenu,
  setHeaderScrolled,
} = uiSlice.actions;
export default uiSlice.reducer;
