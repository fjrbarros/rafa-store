import { deleteUploadFile } from "@/lib/uploadStorage";
import { uploadUrlToFilename } from "@/lib/uploadPaths";

export async function deleteUploadByUrl(url: string): Promise<boolean> {
  const filename = uploadUrlToFilename(url);
  if (!filename) return false;
  return deleteUploadFile(filename);
}
