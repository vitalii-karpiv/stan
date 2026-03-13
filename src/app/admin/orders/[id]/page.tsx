import Link from "next/link";
import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { statusLabels } from "@/components/admin/order-status";
import { updateOrderStatus } from "./actions";
import type { OrderStatus } from "@/generated/prisma";

type Props = {
  params: Promise<{ id: string }>;
};

const allStatuses = Object.keys(statusLabels) as OrderStatus[];

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      items: {
        include: { product: { select: { id: true, title: true } } },
      },
    },
  });

  if (!order) notFound();

  const updateStatus = updateOrderStatus.bind(null, order.id);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">
            Замовлення {order.id.slice(0, 8)}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {order.createdAt.toLocaleDateString("uk-UA", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <Link
          href="/admin/orders"
          className="rounded border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Back to Orders
        </Link>
      </div>

      {/* Info grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {/* Customer & shipping */}
        <div className="rounded-lg border border-border p-5">
          <h2 className="text-sm font-medium text-muted-foreground">Клієнт</h2>
          <p className="mt-2 font-medium">{order.shippingName}</p>
          <p className="text-sm text-muted-foreground">{order.user.email}</p>
          {order.user.phone && (
            <p className="text-sm text-muted-foreground">{order.user.phone}</p>
          )}

          <h2 className="mt-5 text-sm font-medium text-muted-foreground">
            Доставка
          </h2>
          <p className="mt-2 text-sm">
            м. {order.shippingCity}, відділення НП №{order.shippingPostOffice}
          </p>
        </div>

        {/* Status & total */}
        <div className="rounded-lg border border-border p-5">
          <h2 className="text-sm font-medium text-muted-foreground">Сума</h2>
          <p className="mt-2 text-xl font-semibold">
            {formatPrice(order.totalInCents)}
          </p>

          <h2 className="mt-5 text-sm font-medium text-muted-foreground">
            Статус
          </h2>
          <form action={updateStatus} className="mt-2 flex items-center gap-2">
            <select
              key={order.status}
              name="status"
              defaultValue={order.status}
              className="rounded border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-foreground"
            >
              {allStatuses.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded bg-foreground px-3 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Оновити
            </button>
          </form>
        </div>
      </div>

      {/* Items table */}
      <div className="mt-8 rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Товар</th>
              <th className="px-4 py-3 font-medium">Опції</th>
              <th className="px-4 py-3 font-medium text-right">Ціна</th>
              <th className="px-4 py-3 font-medium text-right">К-сть</th>
              <th className="px-4 py-3 font-medium text-right">Сума</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {order.items.map((item) => {
              const attrs = [item.size, item.material, item.gemstone]
                .filter(Boolean)
                .join(" / ");

              return (
                <tr key={item.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${item.product.id}`}
                      className="font-medium hover:underline"
                    >
                      {item.product.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {attrs || "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {formatPrice(item.price)}
                  </td>
                  <td className="px-4 py-3 text-right">{item.quantity}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="border-t border-border">
            <tr>
              <td
                colSpan={4}
                className="px-4 py-3 text-right font-medium"
              >
                Разом
              </td>
              <td className="px-4 py-3 text-right font-semibold">
                {formatPrice(order.totalInCents)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
