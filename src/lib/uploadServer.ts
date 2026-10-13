import { unlink } from "node:fs/promises";
import { resolveUploadFilePath, uploadUrlToFilename } from "@/lib/uploadPaths";

export async function deleteUploadByUrl(url: string): Promise<boolean> {
  const filename = uploadUrlToFilename(url);
  if (!filename) return false;

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
