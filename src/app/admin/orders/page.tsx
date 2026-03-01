export default function OrdersPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        View and manage customer orders.
      </p>

      <div className="mt-8 rounded-lg border border-border">
        <div className="p-8 text-center text-sm text-muted-foreground">
          No orders yet.
        </div>
      </div>
    </div>
  );
}
