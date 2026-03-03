import Link from "next/link";
import { notFound } from "next/navigation";

import { CategoryForm } from "@/components/admin/category-form";
import { db } from "@/lib/db";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;

  const category = await db.category.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  if (!category) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Edit Category</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {category.name}
          </p>
        </div>
        <Link
          href="/admin/categories"
          className="rounded border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Back to Categories
        </Link>
      </div>

      <CategoryForm category={category} />
    </div>
  );
}
