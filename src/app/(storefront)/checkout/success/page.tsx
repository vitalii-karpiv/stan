import Link from "next/link";
import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { getInvoiceStatus, mapMonoStatus } from "@/lib/monobank";
import { ClearCart } from "./clear-cart";

export const metadata = { title: "Замовлення оформлено" };

type Props = {
  searchParams: Promise<{ order?: string }>;
};

async function syncPaymentStatus(order: {
  id: string;
  monoInvoiceId: string | null;
  paymentStatus: string;
}) {
  if (!order.monoInvoiceId) return order.paymentStatus;
  if (order.paymentStatus === "PAID") return order.paymentStatus;

  try {
    const status = await getInvoiceStatus(order.monoInvoiceId);
    const mapped = mapMonoStatus(status.status);

    if (mapped !== order.paymentStatus) {
      await db.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: mapped,
          ...(mapped === "PAID" && { status: "CONFIRMED" }),
        },
      });
    }

    return mapped;
  } catch {
    return order.paymentStatus;
  }
}

const paymentLabels: Record<string, { text: string; className: string }> = {
  PAID: {
    text: "Оплачено",
    className: "text-green-700 bg-green-50 border-green-200 dark:text-green-300 dark:bg-green-950 dark:border-green-900",
  },
  PROCESSING: {
    text: "Обробляється",
    className: "text-yellow-700 bg-yellow-50 border-yellow-200 dark:text-yellow-300 dark:bg-yellow-950 dark:border-yellow-900",
  },
  FAILED: {
    text: "Помилка оплати",
    className: "text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-950 dark:border-red-900",
  },
  EXPIRED: {
    text: "Час оплати вичерпано",
    className: "text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-950 dark:border-red-900",
  },
  REVERSED: {
    text: "Повернено",
    className: "text-gray-700 bg-gray-50 border-gray-200 dark:text-gray-300 dark:bg-gray-950 dark:border-gray-900",
  },
  UNPAID: {
    text: "Очікує оплати",
    className: "text-yellow-700 bg-yellow-50 border-yellow-200 dark:text-yellow-300 dark:bg-yellow-950 dark:border-yellow-900",
  },
};

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { order: orderId } = await searchParams;
  if (!orderId) notFound();

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) notFound();

  const isOnline = order.paymentMethod === "ONLINE";
  const currentPaymentStatus = isOnline
    ? await syncPaymentStatus(order)
    : null;

  const paymentFailed =
    isOnline &&
    (currentPaymentStatus === "FAILED" || currentPaymentStatus === "EXPIRED");

  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center">
      <ClearCart />

      <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-light">
        {paymentFailed ? "Оплата не пройшла" : "Дякуємо за замовлення!"}
      </h1>

      <p className="mt-3 text-muted-foreground">
        {paymentFailed
          ? "На жаль, оплата не була завершена. Ви можете спробувати ще раз."
          : "Ваше замовлення успішно оформлено. Ми зв\u2019яжемося з вами найближчим часом."}
      </p>

      <div className="mx-auto mt-8 max-w-sm rounded border border-border p-5 text-left">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Номер замовлення</dt>
            <dd className="font-mono text-xs">{order.id.slice(0, 8)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Кількість товарів</dt>
            <dd>{itemCount}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Сума</dt>
            <dd className="font-medium">{formatPrice(order.totalInCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Доставка</dt>
            <dd>
              м. {order.shippingCity}, відділення НП №
              {order.shippingPostOffice}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Оплата</dt>
            <dd>
              {isOnline ? "Онлайн" : "При отриманні"}
            </dd>
          </div>
          {isOnline && currentPaymentStatus && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Статус оплати</dt>
              <dd>
                <span
                  className={`inline-block rounded border px-2 py-0.5 text-xs font-medium ${paymentLabels[currentPaymentStatus]?.className ?? ""}`}
                >
                  {paymentLabels[currentPaymentStatus]?.text ?? currentPaymentStatus}
                </span>
              </dd>
            </div>
          )}
        </dl>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <Link
          href="/shop"
          className="inline-block bg-foreground px-8 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Продовжити покупки
        </Link>
      </div>
    </div>
  );
}
