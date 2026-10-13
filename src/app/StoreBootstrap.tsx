"use client";

import { useEffect } from "react";
import { CATALOG_STORAGE_KEY } from "@/lib/catalogStorage";
import { useAppDispatch } from "@/store/hooks";
import { hydrateAuth } from "@/store/slices/authSlice";
import { hydrateCart } from "@/store/slices/cartSlice";
import { fetchCatalog, hydrateCatalog } from "@/store/slices/catalogSlice";

export function StoreBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateCart());
    dispatch(hydrateAuth());
    void dispatch(fetchCatalog());
  }, [dispatch]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === CATALOG_STORAGE_KEY) {
        dispatch(hydrateCatalog());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [dispatch]);

  return children;
}
