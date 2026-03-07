import Link from "next/link";
import { db } from "@/lib/db";

export default async function AdminDashboard() {
  const [orderCount, revenueResult, productCount, customerCount] =
    await Promise.all([
      db.order.count(),
      db.order.aggregate({ _sum: { totalInCents: true } }),
      db.product.count(),
      db.user.count({ where: { role: "CUSTOMER" } }),
    ]);

  const revenue = (revenueResult._sum.totalInCents ?? 0) / 100;

  const stats = [
    { label: "Total Orders", value: orderCount.toLocaleString() },
    {
      label: "Revenue",
      value: revenue.toLocaleString("uk-UA", {
        style: "currency",
        currency: "UAH",
      }),
    },
    { label: "Products", value: productCount.toLocaleString() },
    { label: "Customers", value: customerCount.toLocaleString() },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview of your store&apos;s performance.
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="rounded bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Register Admin
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border p-6"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
