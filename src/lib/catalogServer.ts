import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { defaultCatalog } from "@/lib/seed";
import type { CatalogState } from "@/types/catalog";

const catalogPath = () => path.join(process.cwd(), "data", "catalog.json");

export async function readCatalogFromDisk(): Promise<CatalogState> {
  try {
    const raw = await readFile(catalogPath(), "utf-8");
    const parsed = JSON.parse(raw) as CatalogState;
    if (!parsed.sections || !parsed.products) {
      throw new Error("Invalid catalog file");
    }
    return parsed;
  } catch {
    await writeCatalogToDisk(defaultCatalog);
    return defaultCatalog;
  }
}

export async function writeCatalogToDisk(catalog: CatalogState): Promise<void> {
  await mkdir(path.dirname(catalogPath()), { recursive: true });
  await writeFile(catalogPath(), JSON.stringify(catalog, null, 2), "utf-8");
}
