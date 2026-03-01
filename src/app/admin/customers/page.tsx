export default function CustomersPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Customers</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        View registered customers.
      </p>

      <div className="mt-8 rounded-lg border border-border">
        <div className="p-8 text-center text-sm text-muted-foreground">
          No customers yet.
        </div>
      </div>
    </div>
  );
}
