import type { OrderStatus } from "@/generated/prisma/client";

export const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Очікує",
  CONFIRMED: "Підтверджено",
  SHIPPED: "Відправлено",
  DELIVERED: "Доставлено",
  CANCELLED: "Скасовано",
};

export const statusStyles: Record<OrderStatus, string> = {
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

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
