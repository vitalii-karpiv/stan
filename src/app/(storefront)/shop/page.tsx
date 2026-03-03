export const metadata = { title: "Магазин" };

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-light">
        Магазин
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Переглядайте нашу повну колекцію прикрас.
      </p>

      {/* TODO: фільтри + сітка товарів */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="aspect-square rounded bg-muted" />
        <div className="aspect-square rounded bg-muted" />
        <div className="aspect-square rounded bg-muted" />
        <div className="aspect-square rounded bg-muted" />
      </div>
    </div>
  );
}
