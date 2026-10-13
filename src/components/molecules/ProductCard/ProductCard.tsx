"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button/Button";
import { ImageCarousel } from "@/components/molecules/ImageCarousel/ImageCarousel";
import { QuantityControl } from "@/components/molecules/QuantityControl/QuantityControl";
import { formatCurrency } from "@/lib/format";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import type { Product } from "@/types/catalog";
import styles from "./ProductCard.module.scss";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        quantity,
        image: product.images[0] ?? "",
      }),
    );
    setQuantity(1);
  };

  return (
    <article className={styles.card}>
      <ImageCarousel images={product.images} alt={product.title} />
      <div className={styles.body}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.description}>{product.description}</p>
        <p className={styles.price}>{formatCurrency(product.price)}</p>
        <div className={styles.actions}>
          <QuantityControl value={quantity} onChange={setQuantity} />
          <Button onClick={handleAddToCart}>Adicionar</Button>
        </div>
      </div>
    </article>
  );
}
