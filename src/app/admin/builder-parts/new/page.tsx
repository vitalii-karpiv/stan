import Link from "next/link";

import { BuilderPartForm } from "@/components/admin/builder-part-form";
import { db } from "@/lib/db";

export default async function NewBuilderPartPage() {
  const [collections, categories] = await Promise.all([
    db.collection.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    db.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">New builder part</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a selectable segment for the storefront constructor.
          </p>
        </div>
        <Link
          href="/admin/builder-parts"
          className="rounded border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Back to parts
        </Link>
      </div>

      <BuilderPartForm collections={collections} categories={categories} />
    </div>
  );
}
