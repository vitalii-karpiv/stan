import Link from "next/link";

import { CategoryForm } from "@/components/admin/category-form";

export default function NewCategoryPage() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">New Category</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a new product category.
          </p>
        </div>
        <Link
          href="/admin/categories"
          className="rounded border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Back to Categories
        </Link>
      </div>

      <CategoryForm />
    </div>
  );
}
