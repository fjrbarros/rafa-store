"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { StoreBootstrap } from "@/app/StoreBootstrap";
import { makeStore } from "@/store";

export function Providers({ children }: { children: React.ReactNode }) {
  const storeRef = useRef(makeStore());
  return (
    <Provider store={storeRef.current}>
      <StoreBootstrap>{children}</StoreBootstrap>
    </Provider>
  );
}
