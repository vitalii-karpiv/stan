import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export default async function CustomersPage() {
  const customers = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      orders: { select: { totalInCents: true } },
      _count: { select: { orders: true } },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Customers</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        View registered customers.
      </p>

      <div className="mt-8 rounded-lg border border-border">
        {customers.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No customers yet.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Ім&apos;я</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Телефон</th>
                <th className="px-4 py-3 font-medium">Замовлень</th>
                <th className="px-4 py-3 font-medium">Загальна сума</th>
                <th className="px-4 py-3 font-medium">Дата реєстрації</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.map((customer) => {
                const totalSpent = customer.orders.reduce(
                  (sum, o) => sum + o.totalInCents,
                  0,
                );

                return (
                  <tr key={customer.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">
                      {customer.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {customer.email}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {customer.phone || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {customer._count.orders}
                    </td>
                    <td className="px-4 py-3">
                      {formatPrice(totalSpent)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {customer.createdAt.toLocaleDateString("uk-UA")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
