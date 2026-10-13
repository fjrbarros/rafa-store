/** Produção na Netlify: filesystem do deploy é read-only; usar Blobs. */
export function useNetlifyBlobs(): boolean {
  return process.env.NETLIFY === "true" || Boolean(process.env.NETLIFY_BLOBS_CONTEXT);
}
