import type { Product } from "@/types/catalog";

/** URLs em `/uploads/` que não são usadas por nenhum produto fora do conjunto a excluir. */
export function getUploadUrlsToDelete(
  urls: string[],
  products: Product[],
  excludingProductIds: Set<string>,
): string[] {
  const stillUsed = new Set(
    products
      .filter((product) => !excludingProductIds.has(product.id))
      .flatMap((product) => product.images),
  );

  return urls.filter((url) => url.startsWith("/uploads/") && !stillUsed.has(url));
}
