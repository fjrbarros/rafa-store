import path from "node:path";

export function getUploadsDirectory(): string {
  return path.join(process.cwd(), "public", "uploads");
}

/** Converte `/uploads/arquivo.jpg` em nome de arquivo seguro, ou null. */
export function uploadUrlToFilename(url: string): string | null {
  if (!url.startsWith("/uploads/")) return null;

  const filename = path.basename(url);
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
