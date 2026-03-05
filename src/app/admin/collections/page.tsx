import Link from "next/link";

import { db } from "@/lib/db";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteCollectionAction } from "./actions";

export default async function CollectionsPage() {
  const collections = await db.collection.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Collections</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage seasonal and special collections.
          </p>
        </div>
        <Link
          href="/admin/collections/new"
          className="rounded bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Add Collection
        </Link>
      </div>

      <div className="mt-8 rounded-lg border border-border">
        {collections.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No collections yet. Click &quot;Add Collection&quot; to create your
            first one.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Season</th>
                <th className="px-4 py-3 font-medium text-right">Products</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {collections.map((collection) => (
                <tr key={collection.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/collections/${collection.id}`}
                      className="font-medium hover:underline"
                    >
                      {collection.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {collection.slug}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {collection.season ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {collection._count.products}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeleteButton
                      action={deleteCollectionAction.bind(null, collection.id)}
                      confirmMessage={`Delete "${collection.name}"? Products in this collection will not be deleted.`}
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
