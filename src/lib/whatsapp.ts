import { formatCurrency } from "@/lib/format";
import type { CartItem } from "@/types/cart";

export function buildWhatsAppOrderMessage(items: CartItem[]): string {
  const lines = items.map(
    (item) =>
      `• ${item.title} — ${item.quantity}x ${formatCurrency(item.price)} = ${formatCurrency(
        item.price * item.quantity,
      )}`,
  );
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return encodeURIComponent(
    `Olá! Gostaria de finalizar meu pedido na Rafa Store:\n\n${lines.join("\n")}\n\n*Total: ${formatCurrency(total)}*`,
  );
}

export function getWhatsAppCheckoutUrl(items: CartItem[]): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5548984587893";
  const message = buildWhatsAppOrderMessage(items);
  return `https://wa.me/${phone}?text=${message}`;
}
