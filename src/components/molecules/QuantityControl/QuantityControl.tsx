import { MinusIcon, PlusIcon } from "@/components/atoms/Icons/Icons";
import styles from "./QuantityControl.module.scss";

interface QuantityControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
}

export function QuantityControl({ value, onChange, min = 1 }: QuantityControlProps) {
  return (
    <div className={styles.control}>
      <button
        type="button"
        className={styles.btn}
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Diminuir quantidade"
        disabled={value <= min}
      >
        <MinusIcon />
      </button>
      <span className={styles.value} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={styles.btn}
        onClick={() => onChange(value + 1)}
        aria-label="Aumentar quantidade"
      >
        <PlusIcon />
      </button>
    </div>
  );
}
