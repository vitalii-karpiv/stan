import Link from "next/link";

import { ProductForm } from "@/components/admin/product-form";
import { db } from "@/lib/db";

export default async function NewProductPage() {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">New Product</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a new product for your catalog.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="rounded border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Back to Products
        </Link>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
