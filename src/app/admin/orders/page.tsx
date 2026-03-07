import Link from "next/link";

import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/order-status";

export default async function OrdersPage() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { items: true } },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        View and manage customer orders.
      </p>

      <div className="mt-8 rounded-lg border border-border">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No orders yet.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Замовлення</th>
                <th className="px-4 py-3 font-medium">Клієнт</th>
                <th className="px-4 py-3 font-medium">Доставка</th>
                <th className="px-4 py-3 font-medium">Товарів</th>
                <th className="px-4 py-3 font-medium">Сума</th>
                <th className="px-4 py-3 font-medium">Статус</th>
                <th className="px-4 py-3 font-medium">Дата</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-mono text-xs font-medium hover:underline"
                    >
                      {order.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {order.shippingName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {order.user.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    м. {order.shippingCity}, НП №{order.shippingPostOffice}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {order._count.items}
                  </td>
                  <td className="px-4 py-3">
                    {formatPrice(order.totalInCents)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {order.createdAt.toLocaleDateString("uk-UA")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
