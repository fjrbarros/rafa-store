import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getStore } from "@netlify/blobs";
import { defaultCatalog } from "@/lib/seed";
import { useNetlifyBlobs } from "@/lib/netlifyEnv";
import type { CatalogState } from "@/types/catalog";

const CATALOG_BLOB_STORE = "rafa-store-data";
const CATALOG_BLOB_KEY = "catalog.json";

const catalogPath = () => path.join(process.cwd(), "data", "catalog.json");

function parseCatalog(raw: string): CatalogState {
  const parsed = JSON.parse(raw) as CatalogState;
  if (!parsed.sections || !parsed.products) {
    throw new Error("Invalid catalog file");
  }
  return parsed;
}

async function readCatalogFromRepoFile(): Promise<CatalogState | null> {
  try {
    const raw = await readFile(catalogPath(), "utf-8");
    return parseCatalog(raw);
  } catch {
    return null;
  }
}

export async function readCatalogFromDisk(): Promise<CatalogState> {
  if (useNetlifyBlobs()) {
    const store = getStore(CATALOG_BLOB_STORE);
    const raw = await store.get(CATALOG_BLOB_KEY, { type: "text" });
    if (raw) {
      return parseCatalog(raw);
    }

    const seed = (await readCatalogFromRepoFile()) ?? defaultCatalog;
    await store.set(CATALOG_BLOB_KEY, JSON.stringify(seed, null, 2));
    return seed;
  }

  try {
    const raw = await readFile(catalogPath(), "utf-8");
    return parseCatalog(raw);
  } catch {
    await writeCatalogToDisk(defaultCatalog);
    return defaultCatalog;
  }
}

export async function writeCatalogToDisk(catalog: CatalogState): Promise<void> {
  if (useNetlifyBlobs()) {
    const store = getStore(CATALOG_BLOB_STORE);
    await store.set(CATALOG_BLOB_KEY, JSON.stringify(catalog, null, 2));
    return;
  }

  await mkdir(path.dirname(catalogPath()), { recursive: true });
  await writeFile(catalogPath(), JSON.stringify(catalog, null, 2), "utf-8");
}
