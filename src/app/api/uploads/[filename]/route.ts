import { NextResponse } from "next/server";
import { readUploadFile } from "@/lib/uploadStorage";
import { resolveUploadFilePath } from "@/lib/uploadPaths";

export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> },
) {
  const { filename } = await context.params;
  if (!resolveUploadFilePath(filename)) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  const file = await readUploadFile(filename);
  if (!file) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(file.buffer), {
    headers: {
      "Content-Type": file.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
