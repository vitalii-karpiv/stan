import { NextResponse, type NextRequest } from "next/server";

import { db } from "@/lib/db";
import { verifySignature, mapMonoStatus, type MonoStatus } from "@/lib/monobank";

type WebhookBody = {
  invoiceId: string;
  status: MonoStatus;
  failureReason?: string;
  errCode?: string;
  amount: number;
  ccy: number;
  finalAmount: number;
  reference?: string;
  modifiedDate: string;
};

export async function POST(request: NextRequest) {
  const bodyBytes = Buffer.from(await request.arrayBuffer());
  const xSign = request.headers.get("X-Sign");

  if (!xSign) {
    return NextResponse.json({ error: "Missing X-Sign" }, { status: 400 });
  }

  let verified = false;
  try {
    verified = await verifySignature(bodyBytes, xSign);
  } catch {
    return NextResponse.json(
      { error: "Signature verification error" },
      { status: 500 },
    );
  }

  if (!verified) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  let body: WebhookBody;
  try {
    body = JSON.parse(bodyBytes.toString("utf-8")) as WebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const paymentStatus = mapMonoStatus(body.status);

  const order = await db.order.findFirst({
    where: { monoInvoiceId: body.invoiceId },
    select: { id: true, paymentStatus: true, updatedAt: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const incomingDate = new Date(body.modifiedDate);
  if (incomingDate <= order.updatedAt) {
    return NextResponse.json({ status: "skipped (stale)" });
  }

  await db.order.update({
    where: { id: order.id },
    data: {
      paymentStatus,
      ...(paymentStatus === "PAID" && { status: "CONFIRMED" }),
    },
  });

  return NextResponse.json({ status: "ok" });
}
