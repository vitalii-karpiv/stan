import Link from "next/link";

import { CollectionForm } from "@/components/admin/collection-form";

export default function NewCollectionPage() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">New Collection</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a new seasonal or special collection.
          </p>
        </div>
        <Link
          href="/admin/collections"
          className="rounded border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Back to Collections
        </Link>
      </div>

      <CollectionForm />
    </div>
  );
}
