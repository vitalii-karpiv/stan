import Link from "next/link";
import { notFound } from "next/navigation";

import { BuilderPartForm } from "@/components/admin/builder-part-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { db } from "@/lib/db";
import { deleteBuilderPartAndRedirectAction } from "@/app/admin/builder-parts/actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditBuilderPartPage({ params }: Props) {
  const { id } = await params;

  const [part, collections, categories] = await Promise.all([
    db.builderPart.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        previewImageUrl: true,
        selectorImageUrl: true,
        price: true,
        kind: true,
        sortOrder: true,
        collectionId: true,
        categoryId: true,
      },
    }),
    db.collection.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    db.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!part) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Edit builder part</h1>
          <p className="mt-1 text-sm text-muted-foreground">{part.title}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DeleteButton
            action={deleteBuilderPartAndRedirectAction.bind(null, part.id)}
            confirmMessage={`Delete "${part.title}"? This cannot be undone.`}
          />
          <Link
            href="/admin/builder-parts"
            className="rounded border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Back to parts
          </Link>
        </div>
      </div>

      <BuilderPartForm
        part={part}
        collections={collections}
        categories={categories}
      />
    </div>
  );
}
