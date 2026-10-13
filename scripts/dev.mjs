import { spawn } from "node:child_process";
import os from "node:os";

function getLanAddresses() {
  const addresses = [];
  for (const interfaces of Object.values(os.networkInterfaces())) {
    for (const iface of interfaces ?? []) {
      if (iface.family !== "IPv4" || iface.internal) continue;
      addresses.push(iface.address);
    }
  }
  return addresses;
}

const port = process.env.PORT ?? "3000";
const lan = getLanAddresses();

console.log("\n  Rafa Store — desenvolvimento\n");
console.log(`  No mesmo computador:  http://localhost:${port}`);
if (lan.length > 0) {
  console.log("  Em outro dispositivo (celular/tablet na mesma Wi‑Fi):");
  for (const ip of lan) {
    console.log(`    → http://${ip}:${port}`);
  }
} else {
  console.log("  Não foi possível detectar o IP da rede. Use o IP do seu PC (ex.: 192.168.0.x).");
}
console.log("\n  Não use http://0.0.0.0 — esse endereço não abre em outro aparelho.");
console.log("  Se mudou de rede, reinicie o npm run dev (IP no next.config).\n");

const child = spawn("npx", ["next", "dev", "--hostname", "0.0.0.0", "--port", port], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

child.on("exit", (code) => process.exit(code ?? 0));
