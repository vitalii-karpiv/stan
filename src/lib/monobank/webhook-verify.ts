import { createPublicKey, verify } from "node:crypto";

const MONO_API = "https://api.monobank.ua";

let cachedPubKeyBase64: string | null = null;

function getToken(): string {
  const t = process.env.MONOBANK_TOKEN?.trim();
  if (!t) throw new Error("MONOBANK_TOKEN is not set");
  return t;
}

export async function fetchMonobankPubKeyBase64(
  forceRefresh = false,
): Promise<string> {
  if (cachedPubKeyBase64 && !forceRefresh) return cachedPubKeyBase64;

  const res = await fetch(`${MONO_API}/api/merchant/pubkey`, {
    headers: { "X-Token": getToken() },
  });

  const json = (await res.json()) as { key?: string };
  if (!res.ok || typeof json.key !== "string" || !json.key) {
    throw new Error("Monobank: could not load pubkey");
  }

  cachedPubKeyBase64 = json.key;
  return cachedPubKeyBase64;
}

export function verifyMonobankSignature(
  pubKeyBase64: string,
  xSignBase64: string,
  body: Buffer,
): boolean {
  try {
    const pem = Buffer.from(pubKeyBase64, "base64").toString("utf8");
    const key = createPublicKey(pem);
    const signature = Buffer.from(xSignBase64, "base64");
    return verify(null, body, key, signature);
  } catch {
    return false;
  }
}

/** Verify body; on failure refreshes pubkey once and retries (per Monobank docs). */
export async function verifyMonobankWebhookRequest(
  xSignHeader: string | null,
  rawBody: Buffer,
): Promise<boolean> {
  if (!xSignHeader?.trim()) return false;

  let key = await fetchMonobankPubKeyBase64(false);
  if (verifyMonobankSignature(key, xSignHeader, rawBody)) return true;

  key = await fetchMonobankPubKeyBase64(true);
  return verifyMonobankSignature(key, xSignHeader, rawBody);
}
