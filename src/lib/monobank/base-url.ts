/** Public origin for redirectUrl / webHookUrl (no trailing slash). */
export function getAppBaseUrl(): string {
  const raw =
    process.env.APP_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`
      : "");

  if (raw) return raw.replace(/\/$/, "");
  return "http://localhost:3000";
}
