import { NextResponse } from "next/server";
import { publicUploadUrl, saveUploadFile } from "@/lib/uploadStorage";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Arquivo inválido" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const filename = `${Date.now()}-${safeName}`;
    const contentType = file.type || "application/octet-stream";

    await saveUploadFile(filename, buffer, contentType);

    return NextResponse.json({ url: publicUploadUrl(filename) });
  } catch {
    return NextResponse.json({ error: "Erro ao salvar arquivo" }, { status: 500 });
  }
}
