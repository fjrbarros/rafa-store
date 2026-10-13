import type { RootState } from "@/store";

/** Seções cadastradas no painel, na ordem em que foram salvas. */
export function selectCatalogSections(state: RootState) {
  return state.catalog.sections;
}
