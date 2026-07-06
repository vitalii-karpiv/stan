/** Site origin without trailing slash (sitemap, robots). Local fallback when env unset. */
export function getSiteUrl(): string {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;
  if (!rawUrl) return "https://stanjewels.com";
  return rawUrl.replace(/\/+$/, "");
}

/** URL embedded in legal text; defaults to production domain when env unset. */
export function getStoreUrlForLegalCopy(): string {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;
  if (!rawUrl) return "https://stanjewels.com";
  return rawUrl.replace(/\/+$/, "");
}
