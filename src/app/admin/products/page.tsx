import Link from "next/link";

import { db } from "@/lib/db";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteProductAction } from "./actions";

export default async function ProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: { select: { name: true } } },
  });

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

      <div className="mt-8 rounded-lg border border-border">
        {products.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No products yet. Click &quot;Add Product&quot; to create your first
            one.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="font-medium hover:underline"
                    >
                      {product.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {product.slug}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {product.category.name}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        product.published
                          ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
                          : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                      }`}
                    >
                      {product.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeleteButton
                      action={deleteProductAction.bind(null, product.id)}
                      confirmMessage={`Delete "${product.title}"? This will also remove all its variants and images.`}
                    />
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
