import path from "node:path";

export function getUploadsDirectory(): string {
  return path.join(process.cwd(), "public", "uploads");
}

/** Converte `/uploads/...` ou `/api/uploads/...` em nome de arquivo seguro, ou null. */
export function uploadUrlToFilename(url: string): string | null {
  const prefix = url.startsWith("/api/uploads/")
    ? "/api/uploads/"
    : url.startsWith("/uploads/")
      ? "/uploads/"
      : null;
  if (!prefix) return null;

  const filename = path.basename(url.slice(prefix.length));
  if (!filename || filename === "." || filename === "..") return null;

  return filename;
}

export function resolveUploadFilePath(filename: string): string | null {
  const uploadsDir = path.resolve(getUploadsDirectory());
  const filepath = path.resolve(uploadsDir, filename);

  if (!filepath.startsWith(`${uploadsDir}${path.sep}`) && filepath !== uploadsDir) {
    return null;
  }

  return filepath;
}
