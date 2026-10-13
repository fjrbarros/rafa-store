import { useEffect } from "react";

function getScrollPosition(): number {
  return window.scrollY || document.documentElement.scrollTop || 0;
}

/** Restaura o scroll sem animação (evita conflito com scroll-behavior: smooth no html). */
function restoreScrollPosition(y: number): void {
  const html = document.documentElement;
  const previousHtmlBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";

  window.scrollTo({ left: 0, top: y, behavior: "instant" });

  html.style.scrollBehavior = previousHtmlBehavior;
}

export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const scrollY = getScrollPosition();
    const { style } = document.body;
    const previousOverflow = style.overflow;
    const previousPosition = style.position;
    const previousTop = style.top;
    const previousWidth = style.width;

    style.overflow = "hidden";
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.width = "100%";

    return () => {
      const lockedTop = style.top;
      const y = lockedTop ? Math.abs(Number.parseInt(lockedTop, 10)) : scrollY;

      style.overflow = previousOverflow;
      style.position = previousPosition;
      style.top = previousTop;
      style.width = previousWidth;

      restoreScrollPosition(y);
    };
  }, [locked]);
}
