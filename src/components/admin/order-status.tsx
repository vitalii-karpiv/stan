import type { OrderStatus } from "@/generated/prisma";

export const statusLabels: Record<OrderStatus, string> = {
  AWAITING_PAYMENT: "Очікує оплату",
  PENDING: "Очікує",
  CONFIRMED: "Підтверджено",
  SHIPPED: "Відправлено",
  DELIVERED: "Доставлено",
  CANCELLED: "Скасовано",
};

export const statusStyles: Record<OrderStatus, string> = {
  AWAITING_PAYMENT:
    "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
  CONFIRMED:
    "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
  SHIPPED:
    "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200",
  DELIVERED:
    "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
  CANCELLED:
    "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
};

/** Statuses the admin may set manually (not system-only). */
export const manualOrderStatuses: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}

const unpaidPaymentBadgeClass =
  "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200";

export function PaidBadge({ paidAt }: { paidAt: Date | null }) {
  if (paidAt) {
    return (
      <span
        className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles.DELIVERED}`}
      >
        Оплачено
      </span>
    );
  }

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${unpaidPaymentBadgeClass}`}
    >
      Післяплата
    </span>
  );
}
