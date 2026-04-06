import { NextRequest, NextResponse } from "next/server";

import { applyMonobankInvoiceStatus } from "@/lib/monobank/apply-invoice-status";
import type { InvoiceStatusPayload } from "@/lib/monobank/client";
import { verifyMonobankWebhookRequest } from "@/lib/monobank/webhook-verify";

function parseStatusPayload(raw: unknown): InvoiceStatusPayload | null {
  if (typeof raw !== "object" || raw === null) return null;
  const o = raw as Record<string, unknown>;
  if (
    typeof o.invoiceId !== "string" ||
    typeof o.status !== "string" ||
    typeof o.amount !== "number"
  ) {
    return null;
  }
  return {
    invoiceId: o.invoiceId,
    status: o.status as InvoiceStatusPayload["status"],
    amount: o.amount,
    ccy: typeof o.ccy === "number" ? o.ccy : 980,
    reference: typeof o.reference === "string" ? o.reference : undefined,
    failureReason:
      typeof o.failureReason === "string" ? o.failureReason : undefined,
    errCode: typeof o.errCode === "string" ? o.errCode : undefined,
  };
}

export async function POST(req: NextRequest) {
  const rawBody = Buffer.from(await req.arrayBuffer());
  const xSign = req.headers.get("x-sign");

  const verified = await verifyMonobankWebhookRequest(xSign, rawBody);
  if (!verified) {
    return new NextResponse(null, { status: 401 });
  }

  let json: unknown;
  try {
    json = JSON.parse(rawBody.toString("utf8"));
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const payload = parseStatusPayload(json);
  if (!payload) {
    return new NextResponse(null, { status: 400 });
  }

  await applyMonobankInvoiceStatus(payload);

  return new NextResponse(null, { status: 200 });
}
