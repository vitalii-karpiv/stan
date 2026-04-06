import { notFound, redirect } from "next/navigation";

import { db } from "@/lib/db";
import { applyMonobankInvoiceStatus } from "@/lib/monobank/apply-invoice-status";
import { getInvoiceStatus } from "@/lib/monobank/client";

import { PaymentReturnClient } from "./payment-return-client";

type Props = {
  searchParams: Promise<{ order?: string }>;
};

export default async function CheckoutPaymentReturnPage({ searchParams }: Props) {
  const { order: orderId } = await searchParams;
  if (!orderId?.trim()) notFound();

  const order = await db.order.findUnique({
    where: { id: orderId },
    select: {
      paymentMethod: true,
      monoInvoiceId: true,
      paidAt: true,
    },
  });

  if (!order || order.paymentMethod !== "MONOBANK") notFound();

  if (order.paidAt) {
    redirect(`/checkout/success?order=${orderId}`);
  }

  let initialFailedMessage: string | null = null;

  if (order.monoInvoiceId) {
    try {
      const status = await getInvoiceStatus(order.monoInvoiceId);
      const applied = await applyMonobankInvoiceStatus(status);

      if (applied.paid) {
        redirect(`/checkout/success?order=${orderId}`);
      }

      if (
        status.status === "failure" ||
        status.status === "reversed" ||
        status.status === "expired"
      ) {
        initialFailedMessage =
          status.failureReason ||
          status.errCode ||
          "Оплату не завершено. Спробуйте ще раз або оберіть інший спосіб оплати.";
      }
    } catch {
      // MONOBANK_TOKEN missing or API error — client may retry poll
    }
  }

  return (
    <PaymentReturnClient
      orderId={orderId}
      initialFailedMessage={initialFailedMessage}
    />
  );
}
