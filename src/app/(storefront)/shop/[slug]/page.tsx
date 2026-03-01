type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-12 md:grid-cols-2">
        {/* Image gallery placeholder */}
        <div className="aspect-square rounded bg-muted" />

        {/* Product info placeholder */}
        <div>
          <h1 className="font-[family-name:var(--font-cormorant)] text-3xl font-light">
            Product: {slug}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Product details, variant selector, and add-to-cart will be
            implemented here.
          </p>
        </div>
      </div>
    </div>
  );
}
