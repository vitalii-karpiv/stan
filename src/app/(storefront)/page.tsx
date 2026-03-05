import { db } from "@/lib/db";
import { CollectionCard } from "@/components/storefront/collection-card";
import { ProductCard } from "@/components/storefront/product-card";

export default async function HomePage() {
  const [collections, featuredProducts] = await Promise.all([
    db.collection.findMany({
      where: { products: { some: {} } },
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    db.product.findMany({
      where: { featured: true, published: true },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        variants: { orderBy: { priceInCents: "asc" }, take: 1 },
      },
    }),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="font-[family-name:var(--font-cormorant)] text-5xl font-light tracking-tight md:text-7xl">
          Прикраси, що надихають
        </h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">
          Мінімалістичні вироби, створені доповнювати ваш щоденний стиль.
        </p>
        <a
          href="/shop"
          className="mt-8 inline-block bg-accent px-8 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          До магазину
        </a>
      </section>

      {/* Колекції */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-cormorant)] text-3xl font-light">
          Колекції
        </h2>
        {collections.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <CollectionCard
                key={collection.id}
                name={collection.name}
                slug={collection.slug}
                imageUrl={collection.imageUrl}
                productCount={collection._count.products}
              />
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            Нові колекції незабаром.
          </p>
        )}
      </section>

      {/* Обране */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-cormorant)] text-3xl font-light">
          Обране
        </h2>
        {featuredProducts.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                title={product.title}
                slug={product.slug}
                imageUrl={product.images[0]?.url ?? null}
                imageAlt={product.images[0]?.alt ?? null}
                priceInCents={product.variants[0]?.priceInCents ?? null}
              />
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            Рекомендовані товари з&#39;являться незабаром.
          </p>
        )}
      </section>
    </div>
  );
}
