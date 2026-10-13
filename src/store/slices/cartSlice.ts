import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { loadCartFromStorage, saveCartToStorage } from "@/lib/cartStorage";
import type { CartItem, CartState } from "@/types/cart";

function calcSubtotal(items: CartItem[]): number {
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return Number(total.toFixed(2));
}

export function getCartState(): CartState {
  const items = loadCartFromStorage();
  return { items, subtotal: calcSubtotal(items) };
}

const initialCartState: CartState = { items: [], subtotal: 0 };

const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    hydrateCart: (state) => {
      const items = loadCartFromStorage();
      state.items = items;
      state.subtotal = calcSubtotal(items);
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find((i) => i.productId === action.payload.productId);
      if (existing) {
        existing.quantity = action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.subtotal = calcSubtotal(state.items);
      saveCartToStorage(state.items);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find((i) => i.productId === action.payload.productId);
      if (!item) return;
      item.quantity = Math.max(1, action.payload.quantity);
      state.subtotal = calcSubtotal(state.items);
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      state.subtotal = calcSubtotal(state.items);
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      saveCartToStorage([]);
    },
  },
});

export const { hydrateCart, addToCart, updateQuantity, removeFromCart, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
