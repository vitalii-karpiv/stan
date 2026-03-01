export default function CollectionsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Collections</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage seasonal and special collections.
          </p>
        </div>
        <button className="rounded bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90">
          Add Collection
        </button>
      </div>

      <div className="mt-8 rounded-lg border border-border">
        <div className="p-8 text-center text-sm text-muted-foreground">
          No collections yet.
        </div>
      </div>
    </div>
  );
}
