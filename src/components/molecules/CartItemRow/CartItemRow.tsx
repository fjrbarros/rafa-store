"use client";

import { CloseIcon } from "@/components/atoms/Icons/Icons";
import { QuantityControl } from "@/components/molecules/QuantityControl/QuantityControl";
import { formatCurrency } from "@/lib/format";
import { useAppDispatch } from "@/store/hooks";
import { removeFromCart, updateQuantity } from "@/store/slices/cartSlice";
import type { CartItem } from "@/types/cart";
import styles from "./CartItemRow.module.scss";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const dispatch = useAppDispatch();

  return (
    <li className={styles.row}>
      {item.image && <img src={item.image} alt="" className={styles.thumb} />}
      <div className={styles.info}>
        <div className={styles.header}>
          <h4 className={styles.title}>{item.title}</h4>
          <button
            type="button"
            className={styles.remove}
            onClick={() => dispatch(removeFromCart(item.productId))}
            aria-label="Remover item"
          >
            <CloseIcon />
          </button>
        </div>
        <p className={styles.description}>{item.description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>{formatCurrency(item.price)}</span>
          <QuantityControl
            value={item.quantity}
            onChange={(q) => dispatch(updateQuantity({ productId: item.productId, quantity: q }))}
          />
        </div>
      </div>
    </li>
  );
}
