type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-12 md:grid-cols-2">
        {/* Галерея зображень */}
        <div className="aspect-square rounded bg-muted" />

        {/* Інформація про товар */}
        <div>
          <h1 className="font-[family-name:var(--font-cormorant)] text-3xl font-light">
            Товар: {slug}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Деталі товару, вибір варіантів та додавання до кошика будуть
            реалізовані тут.
          </p>
        </div>
      </div>
    </div>
  );
}
