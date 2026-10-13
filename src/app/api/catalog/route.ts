import { NextResponse } from "next/server";
import { readCatalogFromDisk, writeCatalogToDisk } from "@/lib/catalogServer";
import type { CatalogState } from "@/types/catalog";

export async function GET() {
  const catalog = await readCatalogFromDisk();
  return NextResponse.json(catalog);
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as CatalogState;
    if (!body.sections || !body.products) {
      return NextResponse.json({ error: "Catálogo inválido" }, { status: 400 });
    }
    await writeCatalogToDisk(body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro ao salvar catálogo" }, { status: 500 });
  }
}
