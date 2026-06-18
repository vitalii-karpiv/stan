import { db } from "@/lib/db";
import { CollectionCard } from "@/components/storefront/collection-card";
import { CatalogProducts } from "@/components/storefront/catalog-products";
import { parseShopSearchParams } from "@/lib/shop-search";

export const metadata = { title: "Каталог" };

const headingClassName =
  "font-[family-name:var(--font-display)] font-[750] uppercase text-brand";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ShopPage({
  searchParams,
}: Readonly<{
  searchParams: SearchParams;
}>) {
  const raw = await searchParams;
  const filters = parseShopSearchParams(raw);

  const [categories, collections, activeCollection] = await Promise.all([
    db.category.findMany({ orderBy: { name: "asc" } }),
    db.collection.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true, imageUrl: true },
    }),
    filters.collection
      ? db.collection.findFirst({ where: { slug: filters.collection } })
      : null,
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 pt-8 pb-12">
      <h1
        className={`${headingClassName} mb-8 hidden text-center text-2xl tracking-tight md:block md:text-3xl`}
      >
        Каталог
      </h1>

      {collections.length > 0 ? (
        <section>
          <h2 className={`${headingClassName} text-xl md:text-2xl`}>
            Колекції
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {collections.map((c) => (
              <CollectionCard
                key={c.id}
                name={c.name}
                slug={c.slug}
                imageUrl={c.imageUrl}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className={collections.length > 0 ? "mt-16" : ""}>
        <h2 className={`${headingClassName} text-xl md:text-2xl`}>Товари</h2>

        <CatalogProducts
          filters={filters}
          categories={categories}
          collection={activeCollection}
        />
      </section>
    </div>
  );
}
