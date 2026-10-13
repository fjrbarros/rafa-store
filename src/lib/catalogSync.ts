import { saveCatalogToApi } from "@/lib/catalogApi";
import type { CatalogState } from "@/types/catalog";

let syncTimer: ReturnType<typeof setTimeout> | null = null;

export function scheduleCatalogSync(catalog: CatalogState): void {
  if (typeof window === "undefined") return;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    void saveCatalogToApi(catalog);
  }, 400);
}
