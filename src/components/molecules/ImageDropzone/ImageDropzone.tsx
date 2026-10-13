"use client";

import { type ChangeEvent, type DragEvent, useEffect, useRef, useState } from "react";
import styles from "./ImageDropzone.module.scss";

interface ImageDropzoneProps {
  label?: string;
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
}

function mergeImageFiles(current: File[], incoming: FileList | File[]): File[] {
  const next = [...current];
  const list = Array.from(incoming).filter((file) => file.type.startsWith("image/"));

  for (const file of list) {
    const exists = next.some(
      (f) => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified,
    );
    if (!exists) next.push(file);
  }

  return next;
}

export function ImageDropzone({
  label = "Imagens",
  files,
  onChange,
  disabled = false,
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => {
      for (const url of urls) URL.revokeObjectURL(url);
    };
  }, [files]);

  const openPicker = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    onChange(mergeImageFiles(files, e.target.files));
    e.target.value = "";
  };

  const onDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled || !e.dataTransfer.files.length) return;
    onChange(mergeImageFiles(files, e.dataTransfer.files));
  };

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.wrapper}>
      {label && <span className={styles.label}>{label}</span>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className={styles.hiddenInput}
        onChange={onInputChange}
        disabled={disabled}
        tabIndex={-1}
      />

      <button
        type="button"
        className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ""} ${disabled ? styles.dropzoneDisabled : ""}`}
        onClick={openPicker}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        disabled={disabled}
      >
        <span className={styles.icon} aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 16V8m0 0-3 3m3-3 3 3M4 16.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className={styles.dropzoneTitle}>
          {isDragging ? "Solte as imagens aqui" : "Arraste fotos ou clique para selecionar"}
        </span>
        <span className={styles.dropzoneHint}>PNG, JPG, WEBP — várias imagens por produto</span>
      </button>

      {files.length > 0 && (
        <ul className={styles.previewList}>
          {files.map((file, index) => (
            <li key={`${file.name}-${file.lastModified}-${index}`} className={styles.previewItem}>
              <img src={previewUrls[index]} alt="" className={styles.previewImage} />
              <span className={styles.previewName}>{file.name}</span>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                disabled={disabled}
                aria-label={`Remover ${file.name}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
