export async function uploadProductImages(files: FileList | File[]): Promise<string[]> {
  const list = Array.from(files);
  const urls: string[] = [];

  for (const file of list) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Falha ao enviar imagem");
    }

    const data = (await response.json()) as { url: string };
    urls.push(data.url);
  }

  return urls;
}

export async function deleteProductImages(urls: string[]): Promise<void> {
  if (urls.length === 0) return;

  const response = await fetch("/api/upload/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ urls }),
  });

  if (!response.ok) {
    throw new Error("Falha ao remover imagens");
  }
}
