import Link from "next/link";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/storefront/product-card";
import type { Prisma } from "@/generated/prisma/client";

export const metadata = { title: "Магазин" };

type SearchParams = Promise<{ category?: string; collection?: string }>;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { category, collection } = await searchParams;

  const where: Prisma.ProductWhereInput = { published: true };
  if (category) {
    where.category = { slug: category };
  }
  if (collection) {
    where.collections = { some: { collection: { slug: collection } } };
  }

  const [products, categories, activeCollection] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
      },
    }),
    db.category.findMany({ orderBy: { name: "asc" } }),
    collection
      ? db.collection.findFirst({ where: { slug: collection } })
      : null,
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-light">
        {activeCollection ? activeCollection.name : "Магазин"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {activeCollection
          ? `${products.length} ${pluralProducts(products.length)} у колекції`
          : `${products.length} ${pluralProducts(products.length)}`}
      </p>

      {/* Category filter */}
      <nav className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/shop"
          className={filterClass(!category && !collection)}
        >
          Усі
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className={filterClass(category === cat.slug)}
          >
            {cat.name}
          </Link>
        ))}
      </nav>

      {/* Product grid */}
      {products.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              slug={product.slug}
              imageUrl={product.images[0]?.url ?? null}
              imageAlt={product.images[0]?.alt ?? null}
              price={product.price}
            />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-muted-foreground">
          Товарів не знайдено.
        </p>
      )}
    </div>
  );
}

function filterClass(active: boolean) {
  return active
    ? "border border-foreground bg-foreground px-4 py-1.5 text-sm text-background transition-colors"
    : "border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground";
}

function pluralProducts(count: number) {
  if (count === 1) return "товар";
  if (count >= 2 && count <= 4) return "товари";
  return "товарів";
}
