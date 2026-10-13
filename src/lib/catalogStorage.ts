import { slugify } from "@/lib/format";
import { defaultCatalog } from "@/lib/seed";
import type { CatalogState } from "@/types/catalog";

function normalizeCatalog(catalog: CatalogState): CatalogState {
  return {
    sections: catalog.sections.map((section) => ({
      ...section,
      slug: section.slug || slugify(section.name),
    })),
    products: catalog.products,
  };
}

export const CATALOG_STORAGE_KEY = "rafa-store-catalog";

export function loadCatalogFromStorage(): CatalogState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CATALOG_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CatalogState;
    if (!parsed.sections || !parsed.products) return null;
    return normalizeCatalog(parsed);
  } catch {
    return null;
  }
}

export function saveCatalogToStorage(catalog: CatalogState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(catalog));
}

export function getCatalogState(): CatalogState {
  return loadCatalogFromStorage() ?? defaultCatalog;
}
