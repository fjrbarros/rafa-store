import type { NextConfig } from "next";
import os from "node:os";

/** Permite abrir o dev server pelo IP da rede (celular/tablet na mesma Wi‑Fi). */
function getLanAllowedDevOrigins(): string[] {
  const origins = new Set<string>();
  for (const interfaces of Object.values(os.networkInterfaces())) {
    for (const iface of interfaces ?? []) {
      if (iface.family === "IPv4" && !iface.internal) {
        origins.add(iface.address);
      }
    }
  }
  return [...origins];
}

const nextConfig: NextConfig = {
  allowedDevOrigins: getLanAllowedDevOrigins(),
};

export default nextConfig;
