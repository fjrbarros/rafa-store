import { NextResponse } from "next/server";
import { deleteUploadByUrl } from "@/lib/uploadServer";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { urls?: string[] };
    const urls = body.urls ?? [];

    if (!Array.isArray(urls)) {
      return NextResponse.json({ error: "Lista de URLs inválida" }, { status: 400 });
    }

    let deleted = 0;
    for (const url of urls) {
      if (typeof url !== "string") continue;
      const removed = await deleteUploadByUrl(url);
      if (removed) deleted += 1;
    }

    return NextResponse.json({ ok: true, deleted });
  } catch {
    return NextResponse.json({ error: "Erro ao remover arquivos" }, { status: 500 });
  }
}
