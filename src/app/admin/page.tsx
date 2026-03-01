export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Overview of your store&apos;s performance.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Orders", value: "0" },
          { label: "Revenue", value: "$0.00" },
          { label: "Products", value: "0" },
          { label: "Customers", value: "0" },
        ].map((stat) => (
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
