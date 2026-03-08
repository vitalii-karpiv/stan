import crypto from "node:crypto";

const MONO_API = "https://api.monobank.ua";

function getToken() {
  const token = process.env.MONO_TOKEN;
  if (!token) throw new Error("MONO_TOKEN env variable is not set");
  return token;
}

function getAppUrl() {
  const url = process.env.APP_URL;
  if (!url) throw new Error("APP_URL env variable is not set");
  return url.replace(/\/$/, "");
}

// --- Invoice creation ---

type BasketItem = {
  name: string;
  qty: number;
  sum: number;
  total: number;
  unit?: string;
  code?: string;
};

type CreateInvoiceParams = {
  amount: number;
  orderId: string;
  destination?: string;
  basketOrder?: BasketItem[];
};

type CreateInvoiceResponse = {
  invoiceId: string;
  pageUrl: string;
};

export async function createInvoice(
  params: CreateInvoiceParams,
): Promise<CreateInvoiceResponse> {
  const appUrl = getAppUrl();

  const body: Record<string, unknown> = {
    amount: params.amount,
    ccy: 980,
    merchantPaymInfo: {
      reference: params.orderId,
      destination: params.destination ?? "Оплата замовлення",
      ...(params.basketOrder && { basketOrder: params.basketOrder }),
    },
    redirectUrl: `${appUrl}/checkout/success?order=${params.orderId}`,
    webHookUrl: `${appUrl}/api/monobank/webhook`,
    validity: 3600,
    paymentType: "debit",
  };

  const res = await fetch(`${MONO_API}/api/merchant/invoice/create`, {
    method: "POST",
    headers: {
      "X-Token": getToken(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Monobank create invoice failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<CreateInvoiceResponse>;
}

// --- Invoice status ---

type InvoiceStatus = {
  invoiceId: string;
  status: "created" | "processing" | "hold" | "success" | "failure" | "reversed" | "expired";
  failureReason?: string;
  errCode?: string;
  amount: number;
  ccy: number;
  finalAmount: number;
  reference?: string;
  modifiedDate: string;
};

export async function getInvoiceStatus(
  invoiceId: string,
): Promise<InvoiceStatus> {
  const res = await fetch(
    `${MONO_API}/api/merchant/invoice/status?invoiceId=${encodeURIComponent(invoiceId)}`,
    {
      headers: { "X-Token": getToken() },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Monobank invoice status failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<InvoiceStatus>;
}

// --- Webhook signature verification ---

let cachedPubKey: string | null = null;

async function fetchPublicKey(): Promise<string> {
  const res = await fetch(`${MONO_API}/api/merchant/pubkey`, {
    headers: { "X-Token": getToken() },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch monobank public key (${res.status})`);
  }

  const data = (await res.json()) as { key: string };
  return data.key;
}

async function getPublicKey(): Promise<string> {
  if (!cachedPubKey) {
    cachedPubKey = await fetchPublicKey();
  }
  return cachedPubKey;
}

export function resetPublicKeyCache() {
  cachedPubKey = null;
}

export async function verifySignature(
  body: Buffer | Uint8Array,
  xSign: string,
): Promise<boolean> {
  const pubKeyBase64 = await getPublicKey();
  const pubKeyPem = Buffer.from(pubKeyBase64, "base64");
  const signature = Buffer.from(xSign, "base64");

  try {
    const verify = crypto.createVerify("SHA256");
    verify.update(body);
    verify.end();
    return verify.verify(pubKeyPem, signature);
  } catch {
    // Key might have rotated — refetch and retry once
    resetPublicKeyCache();
    const freshKeyBase64 = await getPublicKey();
    const freshPem = Buffer.from(freshKeyBase64, "base64");

    const verify2 = crypto.createVerify("SHA256");
    verify2.update(body);
    verify2.end();
    return verify2.verify(freshPem, signature);
  }
}

// --- Status mapping ---

export type MonoStatus = InvoiceStatus["status"];

const STATUS_MAP: Record<MonoStatus, "UNPAID" | "PROCESSING" | "PAID" | "FAILED" | "EXPIRED" | "REVERSED"> = {
  created: "UNPAID",
  processing: "PROCESSING",
  hold: "PROCESSING",
  success: "PAID",
  failure: "FAILED",
  reversed: "REVERSED",
  expired: "EXPIRED",
};

export function mapMonoStatus(monoStatus: MonoStatus) {
  return STATUS_MAP[monoStatus] ?? "UNPAID";
}
