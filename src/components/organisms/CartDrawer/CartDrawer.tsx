"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/atoms/Button/Button";
import { CloseIcon } from "@/components/atoms/Icons/Icons";
import { CartItemRow } from "@/components/molecules/CartItemRow/CartItemRow";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { formatCurrency } from "@/lib/format";
import { getWhatsAppCheckoutUrl } from "@/lib/whatsapp";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeCartDrawer } from "@/store/slices/uiSlice";
import styles from "./CartDrawer.module.scss";

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.cartDrawerOpen);
  const items = useAppSelector((s) => s.cart.items);
  const subtotal = useAppSelector((s) => s.cart.subtotal);

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dispatch(closeCartDrawer());
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, dispatch]);

  if (!open) return null;

  const whatsappUrl = items.length > 0 ? getWhatsAppCheckoutUrl(items) : "#";

  const drawer = (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Carrinho">
      <button
        type="button"
        className={styles.backdrop}
        onClick={() => dispatch(closeCartDrawer())}
        aria-label="Fechar carrinho"
      />
      <aside className={styles.drawer}>
        <div className={styles.header}>
          <h2 className={styles.title}>Seu carrinho</h2>
          <button
            type="button"
            className={styles.close}
            onClick={() => dispatch(closeCartDrawer())}
            aria-label="Fechar"
          >
            <CloseIcon />
          </button>
        </div>

        <div className={styles.body}>
          {items.length === 0 ? (
            <p className={styles.empty}>Seu carrinho está vazio. Explore nossas novidades!</p>
          ) : (
            <ul className={styles.list}>
              {items.map((item) => (
                <CartItemRow key={item.productId} item={item} />
              ))}
            </ul>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.subtotal}>
            <span>Subtotal</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
          <Button
            fullWidth
            disabled={items.length === 0}
            onClick={() => {
              if (items.length > 0) window.open(whatsappUrl, "_blank", "noopener,noreferrer");
            }}
          >
            Finalizar no WhatsApp
          </Button>
        </div>
      </aside>
    </div>
  );

  return createPortal(drawer, document.body);
}
