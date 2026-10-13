import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchCatalogFromApi, saveCatalogToApi } from "@/lib/catalogApi";
import {
  getCatalogState,
  loadCatalogFromStorage,
  saveCatalogToStorage,
} from "@/lib/catalogStorage";
import { scheduleCatalogSync } from "@/lib/catalogSync";
import { slugify } from "@/lib/format";
import { defaultCatalog } from "@/lib/seed";
import type { CatalogState, Product, Section } from "@/types/catalog";

function persistCatalog(state: CatalogState): void {
  saveCatalogToStorage(state);
  scheduleCatalogSync(state);
}

function isRicherThanServer(local: CatalogState, server: CatalogState): boolean {
  return (
    local.products.length > server.products.length ||
    local.sections.length > server.sections.length
  );
}

export const fetchCatalog = createAsyncThunk("catalog/fetch", async () => {
  try {
    const serverCatalog = await fetchCatalogFromApi();
    const localCatalog = loadCatalogFromStorage();

    if (localCatalog && isRicherThanServer(localCatalog, serverCatalog)) {
      await saveCatalogToApi(localCatalog);
      saveCatalogToStorage(localCatalog);
      return localCatalog;
    }

    saveCatalogToStorage(serverCatalog);
    return serverCatalog;
  } catch {
    return getCatalogState();
  }
});

const catalogSlice = createSlice({
  name: "catalog",
  initialState: defaultCatalog,
  reducers: {
    hydrateCatalog: (state) => {
      const catalog = loadCatalogFromStorage();
      if (catalog) {
        state.sections = catalog.sections;
        state.products = catalog.products;
      }
    },
    addSection: (state, action: PayloadAction<{ name: string }>) => {
      const slug = slugify(action.payload.name);
      const section: Section = {
        id: `sec-${Date.now()}`,
        name: action.payload.name,
        slug,
      };
      state.sections.push(section);
      persistCatalog(state);
    },
    removeSection: (state, action: PayloadAction<string>) => {
      state.sections = state.sections.filter((s) => s.id !== action.payload);
      state.products = state.products.filter((p) => p.sectionId !== action.payload);
      persistCatalog(state);
    },
    addProduct: (state, action: PayloadAction<Omit<Product, "id">>) => {
      const product: Product = {
        ...action.payload,
        id: `prod-${Date.now()}`,
      };
      state.products.push(product);
      persistCatalog(state);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index === -1) return;
      state.products[index] = action.payload;
      persistCatalog(state);
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
      persistCatalog(state);
    },
    resetCatalog: (state) => {
      state.sections = defaultCatalog.sections;
      state.products = defaultCatalog.products;
      persistCatalog(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCatalog.fulfilled, (state, action) => {
      state.sections = action.payload.sections;
      state.products = action.payload.products;
    });
  },
});

export const {
  hydrateCatalog,
  addSection,
  removeSection,
  addProduct,
  updateProduct,
  removeProduct,
  resetCatalog,
} = catalogSlice.actions;

export { getCatalogState };
export default catalogSlice.reducer;
