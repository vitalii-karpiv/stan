import Link from "next/link";

import { db } from "@/lib/db";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteBuilderPartAction } from "@/app/admin/builder-parts/actions";
import { BUILDER_PART_KIND_LABELS } from "@/lib/builder-part-kinds";
import type { BuilderPartKind } from "@/generated/prisma";
import { formatPrice } from "@/lib/utils";

type SearchParams = Promise<{
  collection?: string;
  category?: string;
  kind?: string;
}>;

export default async function BuilderPartsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const collectionFilter =
    typeof sp.collection === "string" && sp.collection ? sp.collection : undefined;
  const categoryFilter =
    typeof sp.category === "string" && sp.category ? sp.category : undefined;
  const kindFilter =
    sp.kind === "LEFT_HALF" || sp.kind === "RIGHT_HALF" || sp.kind === "PENDANT"
      ? sp.kind
      : undefined;

  const [collections, categories, parts] = await Promise.all([
    db.collection.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    db.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    db.builderPart.findMany({
      where: {
        ...(collectionFilter ? { collectionId: collectionFilter } : {}),
        ...(categoryFilter ? { categoryId: categoryFilter } : {}),
        ...(kindFilter ? { kind: kindFilter } : {}),
      },
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      include: {
        collection: { select: { name: true } },
        category: { select: { name: true } },
      },
    }),
  ]);

  const base = "/admin/builder-parts";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Builder parts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Images and options for the jewelry constructor.
          </p>
        </div>
        <Link
          href="/admin/builder-parts/new"
          className="rounded bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Add part
        </Link>
      </div>

      <form
        className="mt-6 flex flex-wrap items-end gap-3"
        method="get"
        action={base}
      >
        <div className="space-y-1">
          <label className="block text-xs font-medium text-muted-foreground">
            Collection
          </label>
          <select
            name="collection"
            defaultValue={collectionFilter ?? ""}
            className="rounded border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">All</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-muted-foreground">
            Category
          </label>
          <select
            name="category"
            defaultValue={categoryFilter ?? ""}
            className="rounded border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-muted-foreground">
            Kind
          </label>
          <select
            name="kind"
            defaultValue={kindFilter ?? ""}
            className="rounded border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">All</option>
            {(Object.keys(BUILDER_PART_KIND_LABELS) as BuilderPartKind[]).map(
              (k) => (
                <option key={k} value={k}>
                  {BUILDER_PART_KIND_LABELS[k]}
                </option>
              ),
            )}
          </select>
        </div>
        <button
          type="submit"
          className="rounded border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Filter
        </button>
        <Link
          href={base}
          className="rounded border border-transparent px-2 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          Clear
        </Link>
      </form>

      <div className="mt-6 rounded-lg border border-border">
        {parts.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No parts match the filters. Add parts or adjust filters.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Collection</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Kind</th>
                <th className="px-4 py-3 font-medium text-right">Price</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {parts.map((p) => (
                <tr key={p.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/builder-parts/${p.id}`}
                      className="font-medium hover:underline"
                    >
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.collection.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.category.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {BUILDER_PART_KIND_LABELS[p.kind]}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {p.price != null ? formatPrice(p.price) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeleteButton
                      action={deleteBuilderPartAction.bind(null, p.id)}
                      confirmMessage={`Delete "${p.title}"?`}
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
