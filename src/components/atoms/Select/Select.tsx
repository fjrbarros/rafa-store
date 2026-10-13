"use client";

import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { ChevronRightIcon } from "@/components/atoms/Icons/Icons";
import styles from "./Select.module.scss";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  id?: string;
  name?: string;
  value?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export function Select({
  label,
  options,
  placeholder = "Selecione uma opção",
  id,
  name,
  value = "",
  disabled = false,
  className = "",
  onChange,
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? name ?? generatedId;
  const listboxId = `${selectId}-listbox`;

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = options.find((option) => option.value === value);
  const displayLabel = selected?.label ?? placeholder;

  const emitChange = (nextValue: string) => {
    onChange?.({
      target: { value: nextValue, name } as HTMLSelectElement,
      currentTarget: { value: nextValue, name } as HTMLSelectElement,
    } as ChangeEvent<HTMLSelectElement>);
  };

  const choose = (nextValue: string) => {
    emitChange(nextValue);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen((prev) => !prev);
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
    }
  };

  return (
    <div className={styles.wrapper} ref={rootRef}>
      {label && (
        <span className={styles.label} id={`${selectId}-label`}>
          {label}
        </span>
      )}

      <select
        tabIndex={-1}
        aria-hidden="true"
        className={styles.nativeSelect}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        {options.length === 0 ? (
          <option value="">{placeholder}</option>
        ) : (
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        )}
      </select>

      <div className={`${styles.field} ${className}`}>
        <button
          type="button"
          id={selectId}
          className={`${styles.trigger} ${open ? styles.triggerOpen : ""} ${!selected ? styles.triggerPlaceholder : ""}`}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          onKeyDown={onTriggerKeyDown}
          disabled={disabled || options.length === 0}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-labelledby={label ? `${selectId}-label` : undefined}
        >
          {displayLabel}
        </button>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`} aria-hidden="true">
          <ChevronRightIcon />
        </span>

        {open && options.length > 0 && (
          <ul id={listboxId} className={styles.list} role="listbox" aria-labelledby={`${selectId}-label`}>
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <li key={option.value} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`${styles.option} ${isSelected ? styles.optionSelected : ""}`}
                    onClick={() => choose(option.value)}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
