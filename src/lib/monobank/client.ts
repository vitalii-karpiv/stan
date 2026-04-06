const MONO_API = "https://api.monobank.ua";

export type MonobankApiError = {
  errCode: string;
  errText: string;
};

export type CreateInvoiceParams = {
  amount: number;
  ccy?: number;
  redirectUrl: string;
  webHookUrl: string;
  merchantPaymInfo?: {
    reference: string;
    destination: string;
  };
};

export type CreateInvoiceResult = {
  invoiceId: string;
  pageUrl: string;
};

export type InvoiceTerminalStatus =
  | "created"
  | "processing"
  | "hold"
  | "success"
  | "failure"
  | "reversed"
  | "expired";

export type InvoiceStatusPayload = {
  invoiceId: string;
  status: InvoiceTerminalStatus;
  amount: number;
  ccy: number;
  reference?: string;
  failureReason?: string;
  errCode?: string;
};

function getToken(): string {
  const t = process.env.MONOBANK_TOKEN?.trim();
  if (!t) throw new Error("MONOBANK_TOKEN is not set");
  return t;
}

async function readMonoJson(res: Response): Promise<unknown> {
  const text = await res.text();
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error(`Monobank: invalid JSON (${res.status})`);
  }
}

function isApiError(x: unknown): x is MonobankApiError {
  return (
    typeof x === "object" &&
    x !== null &&
    "errCode" in x &&
    typeof (x as MonobankApiError).errCode === "string"
  );
}

export async function createInvoice(
  params: CreateInvoiceParams,
): Promise<CreateInvoiceResult> {
  const body = {
    amount: params.amount,
    ccy: params.ccy ?? 980,
    redirectUrl: params.redirectUrl,
    webHookUrl: params.webHookUrl,
    ...(params.merchantPaymInfo
      ? { merchantPaymInfo: params.merchantPaymInfo }
      : {}),
  };

  const res = await fetch(`${MONO_API}/api/merchant/invoice/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Token": getToken(),
    },
    body: JSON.stringify(body),
  });

  const json = await readMonoJson(res);

  if (!res.ok) {
    if (isApiError(json)) {
      throw new Error(`${json.errCode}: ${json.errText}`);
    }
    throw new Error(`Monobank invoice/create failed (${res.status})`);
  }

  const obj = json as Record<string, unknown>;
  const invoiceId = obj.invoiceId;
  const pageUrl = obj.pageUrl;
  if (typeof invoiceId !== "string" || typeof pageUrl !== "string") {
    throw new Error("Monobank: unexpected invoice/create response");
  }

  return { invoiceId, pageUrl };
}

export async function getInvoiceStatus(
  invoiceId: string,
): Promise<InvoiceStatusPayload> {
  const url = new URL(`${MONO_API}/api/merchant/invoice/status`);
  url.searchParams.set("invoiceId", invoiceId);

  const res = await fetch(url.toString(), {
    headers: { "X-Token": getToken() },
  });

  const json = await readMonoJson(res);

  if (!res.ok) {
    if (isApiError(json)) {
      throw new Error(`${json.errCode}: ${json.errText}`);
    }
    throw new Error(`Monobank invoice/status failed (${res.status})`);
  }

  const obj = json as Record<string, unknown>;
  if (
    typeof obj.invoiceId !== "string" ||
    typeof obj.status !== "string" ||
    typeof obj.amount !== "number"
  ) {
    throw new Error("Monobank: unexpected invoice/status response");
  }

  return {
    invoiceId: obj.invoiceId,
    status: obj.status as InvoiceTerminalStatus,
    amount: obj.amount,
    ccy: typeof obj.ccy === "number" ? obj.ccy : 980,
    reference: typeof obj.reference === "string" ? obj.reference : undefined,
    failureReason:
      typeof obj.failureReason === "string" ? obj.failureReason : undefined,
    errCode: typeof obj.errCode === "string" ? obj.errCode : undefined,
  };
}
