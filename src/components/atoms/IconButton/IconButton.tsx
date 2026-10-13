import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./IconButton.module.scss";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
  badge?: number;
}

export function IconButton({ label, children, badge, className = "", ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.iconButton} ${className}`}
      aria-label={label}
      {...props}
    >
      {children}
      {badge !== undefined && badge > 0 && <span className={styles.badge}>{badge}</span>}
    </button>
  );
}
