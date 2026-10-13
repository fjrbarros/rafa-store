import type { CatalogState } from "@/types/catalog";

export async function fetchCatalogFromApi(): Promise<CatalogState> {
  const response = await fetch("/api/catalog", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Falha ao carregar catálogo");
  }
  return response.json() as Promise<CatalogState>;
}

export async function saveCatalogToApi(catalog: CatalogState): Promise<void> {
  const response = await fetch("/api/catalog", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(catalog),
  });
  if (!response.ok) {
    throw new Error("Falha ao salvar catálogo");
  }
}
