import Link from "next/link";

export default function ProductsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your product catalog.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Add Product
        </Link>
      </div>

      {/* Product table placeholder */}
      <div className="mt-8 rounded-lg border border-border">
        <div className="p-8 text-center text-sm text-muted-foreground">
          No products yet. Click &quot;Add Product&quot; to create your first
          one.
        </div>
      </div>
    </div>
  );
}
