export default function CategoriesPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage product categories.
          </p>
        </div>
        <button className="rounded bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90">
          Add Category
        </button>
      </div>

      <div className="mt-8 rounded-lg border border-border">
        <div className="p-8 text-center text-sm text-muted-foreground">
          No categories yet.
        </div>
      </div>
    </div>
  );
}
