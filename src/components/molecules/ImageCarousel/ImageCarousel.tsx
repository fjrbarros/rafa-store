"use client";

import { type TouchEvent, useCallback, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/atoms/Icons/Icons";
import styles from "./ImageCarousel.module.scss";

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

const SWIPE_THRESHOLD = 50;

export function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (next: number) => {
      if (images.length === 0) return;
      setIndex((next + images.length) % images.length);
    },
    [images.length],
  );

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > SWIPE_THRESHOLD) goTo(index - 1);
    else if (delta < -SWIPE_THRESHOLD) goTo(index + 1);
    touchStartX.current = null;
  };

  if (images.length === 0) {
    return <div className={styles.placeholder}>Sem imagem</div>;
  }

  return (
    <div className={styles.carousel} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className={styles.viewport} aria-live="polite">
        {images.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt={i === index ? alt : ""}
            aria-hidden={i !== index}
            className={`${styles.image} ${i === index ? styles.imageActive : ""}`}
          />
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button
            type="button"
            className={`${styles.nav} ${styles.navPrev}`}
            onClick={() => goTo(index - 1)}
            aria-label="Imagem anterior"
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            className={`${styles.nav} ${styles.navNext}`}
            onClick={() => goTo(index + 1)}
            aria-label="Próxima imagem"
          >
            <ChevronRightIcon />
          </button>
          <div className={styles.dots}>
            {images.map((src, i) => (
              <button
                key={`${src}-dot-${i}`}
                type="button"
                className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
                onClick={() => setIndex(i)}
                aria-label={`Ir para imagem ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
