import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice";
import cartReducer from "@/store/slices/cartSlice";
import catalogReducer from "@/store/slices/catalogSlice";
import uiReducer from "@/store/slices/uiSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      cart: cartReducer,
      catalog: catalogReducer,
      auth: authReducer,
      ui: uiReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
