import Link from "next/link";
import { notFound } from "next/navigation";

import { CollectionForm } from "@/components/admin/collection-form";
import { db } from "@/lib/db";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditCollectionPage({ params }: Props) {
  const { id } = await params;

  const collection = await db.collection.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      season: true,
      imageUrl: true,
    },
  });

  if (!collection) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Edit Collection</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {collection.name}
          </p>
        </div>
        <Link
          href="/admin/collections"
          className="rounded border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Back to Collections
        </Link>
      </div>

      <CollectionForm collection={collection} />
    </div>
  );
}
