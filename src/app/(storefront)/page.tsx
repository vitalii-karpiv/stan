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
          Jewelry, Simplified
        </h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">
          Minimalist pieces designed to complement your everyday.
        </p>
        <a
          href="/shop"
          className="mt-8 inline-block bg-foreground px-8 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Shop Now
        </a>
      </section>

      {/* Collections */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-cormorant)] text-3xl font-light">
          Collections
        </h2>
        {collections.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <CollectionCard
                key={collection.id}
                name={collection.name}
                slug={collection.slug}
                season={collection.season}
                imageUrl={collection.imageUrl}
                productCount={collection._count.products}
              />
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            New collections coming soon.
          </p>
        )}
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-cormorant)] text-3xl font-light">
          Featured
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
            Featured products coming soon.
          </p>
        )}
      </section>
    </div>
  );
}
