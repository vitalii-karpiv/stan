"use server";

import { db } from "@/lib/db";
import { applyMonobankInvoiceStatus } from "@/lib/monobank/apply-invoice-status";
import { getInvoiceStatus } from "@/lib/monobank/client";

export type PaymentSyncResult =
  | { kind: "success"; successUrl: string }
  | { kind: "pending" }
  | { kind: "failed"; message: string }
  | { kind: "error"; message: string };

export async function syncMonobankPaymentReturn(
  orderId: string,
): Promise<PaymentSyncResult> {
  const order = await db.order.findUnique({
    where: { id: orderId },
    select: {
      paymentMethod: true,
      monoInvoiceId: true,
      paidAt: true,
    },
  });

  if (!order || order.paymentMethod !== "MONOBANK") {
    return { kind: "error", message: "Некоректне замовлення." };
  }

  const successUrl = `/checkout/success?order=${orderId}`;

  if (order.paidAt) {
    return { kind: "success", successUrl };
  }

  if (!order.monoInvoiceId) {
    return { kind: "error", message: "Рахунок оплати не знайдено." };
  }

  try {
    const status = await getInvoiceStatus(order.monoInvoiceId);
    const result = await applyMonobankInvoiceStatus(status);

    if (result.paid) {
      return { kind: "success", successUrl };
    }

    if (
      status.status === "failure" ||
      status.status === "reversed" ||
      status.status === "expired"
    ) {
      return {
        kind: "failed",
        message:
          status.failureReason ||
          status.errCode ||
          "Оплату не завершено. Спробуйте ще раз або оберіть інший спосіб оплати.",
      };
    }

    if (!result.ok && result.reason === "amount_mismatch") {
      return { kind: "error", message: "Невідповідність суми оплати." };
    }

    return { kind: "pending" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Помилка перевірки оплати.";
    return { kind: "error", message: msg };
  }
}
