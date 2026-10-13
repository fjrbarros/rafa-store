export interface CartItem {
  productId: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
}
