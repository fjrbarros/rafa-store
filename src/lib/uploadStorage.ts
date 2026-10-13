import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { getStore } from "@netlify/blobs";
import { useNetlifyBlobs } from "@/lib/netlifyEnv";
import { getUploadsDirectory, resolveUploadFilePath } from "@/lib/uploadPaths";

const UPLOAD_BLOB_STORE = "rafa-store-uploads";

function contentTypeFromFilename(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

export function publicUploadUrl(filename: string): string {
  return useNetlifyBlobs() ? `/api/uploads/${filename}` : `/uploads/${filename}`;
}

export async function saveUploadFile(
  filename: string,
  buffer: Buffer,
  contentType: string,
): Promise<void> {
  if (useNetlifyBlobs()) {
    const store = getStore(UPLOAD_BLOB_STORE);
    await store.set(filename, new Blob([Uint8Array.from(buffer)], { type: contentType }), {
      metadata: { contentType },
    });
    return;
  }

  const uploadsDir = getUploadsDirectory();
  await mkdir(uploadsDir, { recursive: true });
  const filepath = resolveUploadFilePath(filename);
  if (!filepath) {
    throw new Error("Invalid upload filename");
  }
  await writeFile(filepath, buffer);
}

export async function readUploadFile(
  filename: string,
): Promise<{ buffer: Buffer; contentType: string } | null> {
  if (!resolveUploadFilePath(filename)) return null;

  if (useNetlifyBlobs()) {
    const store = getStore(UPLOAD_BLOB_STORE);
    const blob = await store.getWithMetadata(filename, { type: "arrayBuffer" });
    if (!blob?.data) return null;
    const metaType = blob.metadata?.contentType;
    const contentType =
      typeof metaType === "string" ? metaType : contentTypeFromFilename(filename);
    return { buffer: Buffer.from(blob.data), contentType };
  }

  const filepath = resolveUploadFilePath(filename);
  if (!filepath) return null;

  try {
    const buffer = await readFile(filepath);
    return { buffer, contentType: contentTypeFromFilename(filename) };
  } catch {
    return null;
  }
}

export async function deleteUploadFile(filename: string): Promise<boolean> {
  if (!resolveUploadFilePath(filename)) return false;

  if (useNetlifyBlobs()) {
    const store = getStore(UPLOAD_BLOB_STORE);
    const existing = await store.get(filename);
    if (!existing) return false;
    await store.delete(filename);
    return true;
  }

  const filepath = resolveUploadFilePath(filename);
  if (!filepath) return false;

  try {
    await unlink(filepath);
    return true;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return false;
    throw error;
  }
}
