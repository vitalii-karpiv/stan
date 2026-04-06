import { db } from "@/lib/db";
import {
  notifyAdminsNewOrder,
  notifyCustomerOrderConfirmation,
} from "@/lib/mail";

import type { InvoiceStatusPayload } from "./client";

async function loadOrderForInvoice(payload: InvoiceStatusPayload) {
  const byInvoice = await db.order.findUnique({
    where: { monoInvoiceId: payload.invoiceId },
    include: {
      user: { select: { email: true, name: true } },
      items: true,
    },
  });
  if (byInvoice) return byInvoice;

  if (!payload.reference) return null;

  const byRef = await db.order.findUnique({
    where: { id: payload.reference },
    include: {
      user: { select: { email: true, name: true } },
      items: true,
    },
  });

  if (
    byRef?.monoInvoiceId &&
    byRef.monoInvoiceId !== payload.invoiceId
  ) {
    return null;
  }

  return byRef;
}

/**
 * Applies Monobank invoice status to the matching MONOBANK order.
 * Idempotent for success. Returns whether the order is paid after this call.
 */
export async function applyMonobankInvoiceStatus(
  payload: InvoiceStatusPayload,
): Promise<{ ok: boolean; paid: boolean; reason?: string }> {
  const order = await loadOrderForInvoice(payload);

  if (!order || order.paymentMethod !== "MONOBANK") {
    return { ok: false, paid: false, reason: "order_not_found" };
  }

  if (order.monoInvoiceId && order.monoInvoiceId !== payload.invoiceId) {
    return { ok: false, paid: false, reason: "invoice_mismatch" };
  }

  if (order.totalInCents !== payload.amount) {
    return { ok: false, paid: false, reason: "amount_mismatch" };
  }

  if (order.paidAt) {
    return { ok: true, paid: true };
  }

  if (payload.status === "success") {
    const updated = await db.order.updateMany({
      where: {
        id: order.id,
        paymentMethod: "MONOBANK",
        paidAt: null,
        status: "AWAITING_PAYMENT",
      },
      data: {
        paidAt: new Date(),
        status: "PENDING",
        monoInvoiceId: payload.invoiceId,
      },
    });

    if (updated.count === 0) {
      const again = await db.order.findUnique({ where: { id: order.id } });
      return { ok: true, paid: Boolean(again?.paidAt) };
    }

    const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);

    notifyAdminsNewOrder({
      id: order.id,
      customerName: order.shippingName,
      customerEmail: order.user.email,
      totalInCents: order.totalInCents,
      itemCount: order.items.length,
    }).catch(() => {});

    notifyCustomerOrderConfirmation({
      orderId: order.id,
      customerName: order.shippingName,
      customerEmail: order.user.email,
      totalInCents: order.totalInCents,
      itemCount,
      shippingCity: order.shippingCity,
      shippingPostOffice: order.shippingPostOffice,
    }).catch(() => {});

    return { ok: true, paid: true };
  }

  if (payload.status === "failure" || payload.status === "reversed") {
    return { ok: true, paid: false };
  }

  if (payload.status === "expired") {
    return { ok: true, paid: false };
  }

  // created | processing | hold — no terminal action
  return { ok: true, paid: Boolean(order.paidAt) };
}
