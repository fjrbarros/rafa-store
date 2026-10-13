# Rafa Store

Loja de moda feminina em Next.js (TypeScript), com vitrine em uma página, carrinho lateral e checkout via WhatsApp.

## Como rodar

```bash
cp .env.example .env.local
npm install
npm run dev
```

- Loja: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

### Acessar pelo celular/tablet (mesma rede Wi‑Fi)

Ao rodar `npm run dev`, o terminal mostra o IP correto (ex.: `http://192.168.0.22:3000`).

**Não use** `http://0.0.0.0:3000` — isso só indica que o servidor escuta em todas as interfaces; em outro aparelho você precisa do **IP do computador** na rede.

Se não abrir, verifique firewall (Linux: `sudo ufw allow 3000/tcp`) e que o celular não está em rede visitante com isolamento de clientes.

O `next.config.ts` registra automaticamente o IP da máquina em `allowedDevOrigins` (exigido pelo Next.js 16 para JS e API funcionarem pelo IP da rede). **Reinicie** `npm run dev` após conectar em outra rede Wi‑Fi.

### Deploy na Netlify

Este projeto é **Next.js** (com API routes), não um React estático. **Não** use pasta de publicação `.` (raiz do repo).

1. Conecte o repositório na Netlify.
2. A Netlify deve detectar o `netlify.toml` (build: `npm run build` + plugin `@netlify/plugin-nextjs`).
3. No painel, se existir **Publish directory**, deixe em branco ou use o que o preset Next.js sugere — **não** coloque `.`.
4. Em **Environment variables**, configure `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `NEXT_PUBLIC_WHATSAPP_NUMBER`.

**Limitação:** em serverless, `data/catalog.json` e `public/uploads/` **não persistem** de forma confiável. Para produção, use Supabase (ou similar) como planejado.

Configure no `.env.local`:

- `NEXT_PUBLIC_WHATSAPP_NUMBER` — DDI + DDD + número, só dígitos
- `ADMIN_EMAIL` e `ADMIN_PASSWORD` — acesso ao painel (valores de exemplo em `.env.example`)

## Scripts

- `npm run dev` — desenvolvimento
- `npm run build` / `npm start` — produção
- `npm run lint` — Biome
- `npm run format` — formatar com Biome

## Estrutura (atomic design)

- `src/components/atoms` — botões, inputs, ícones
- `src/components/molecules` — card de produto, carrossel, item do carrinho
- `src/components/organisms` — header, drawer, seções, admin
- `src/components/templates` — layout da loja e do admin
- `src/store` — Redux (catálogo, carrinho, auth, UI)

Catálogo e carrinho persistem no `localStorage`. Imagens do admin são salvas em `public/uploads/` via `POST /api/upload`.
