import Link from "next/link";
import { db } from "@/lib/db";
import { CollapsibleFilterBlock } from "@/components/storefront/collapsible-filter-block";
import { ProductCard } from "@/components/storefront/product-card";
import { ShopFiltersDisclosure } from "@/components/storefront/shop-filters-disclosure";
import { MATERIAL_OPTIONS } from "@/lib/materials";
import { PRODUCT_TYPE_OPTIONS } from "@/lib/product-types";
import { parseShopSearchParams, shopHref } from "@/lib/shop-search";
import type { Prisma } from "@/generated/prisma";

export const metadata = { title: "Магазин" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  const filters = parseShopSearchParams(raw);

  const andParts: Prisma.ProductWhereInput[] = [{ published: true }];

  if (filters.categories.length > 0) {
    andParts.push({
      category: { slug: { in: filters.categories } },
    });
  }
  if (filters.collection) {
    andParts.push({
      collections: {
        some: { collection: { slug: filters.collection } },
      },
    });
  }
  if (filters.materials.length > 0) {
    andParts.push({
      OR: filters.materials.map((m) => ({
        materials: { has: m },
      })),
    });
  }
  if (filters.productTypes.length > 0) {
    andParts.push({
      productType: { in: filters.productTypes },
    });
  }

  const where: Prisma.ProductWhereInput =
    andParts.length === 1 ? andParts[0]! : { AND: andParts };

  const [products, categories, activeCollection] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: { price: filters.sort === "desc" ? "desc" : "asc" },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
      },
    }),
    db.category.findMany({ orderBy: { name: "asc" } }),
    filters.collection
      ? db.collection.findFirst({ where: { slug: filters.collection } })
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

      <ShopFiltersDisclosure>
        <CollapsibleFilterBlock label="Категорія">
          <Link
            href={shopHref(filters, { categories: [] })}
            className={filterClass(
              filters.categories.length === 0 && !filters.collection,
            )}
          >
            Усі
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={shopHref(filters, { toggleCategory: cat.slug })}
              className={filterClass(
                filters.categories.includes(cat.slug),
              )}
            >
              {cat.name}
            </Link>
          ))}
        </CollapsibleFilterBlock>

        <CollapsibleFilterBlock label="Матеріал">
          <Link
            href={shopHref(filters, { materials: [] })}
            className={filterClass(filters.materials.length === 0)}
          >
            Усі
          </Link>
          {MATERIAL_OPTIONS.map((opt) => (
            <Link
              key={opt.value}
              href={shopHref(filters, { toggleMaterial: opt.value })}
              className={filterClass(
                filters.materials.includes(opt.value),
              )}
            >
              {opt.label}
            </Link>
          ))}
        </CollapsibleFilterBlock>

        <CollapsibleFilterBlock label="Тип">
          <Link
            href={shopHref(filters, { productTypes: [] })}
            className={filterClass(filters.productTypes.length === 0)}
          >
            Усі
          </Link>
          {PRODUCT_TYPE_OPTIONS.map((opt) => (
            <Link
              key={opt.value}
              href={shopHref(filters, { toggleProductType: opt.value })}
              className={filterClass(
                filters.productTypes.includes(opt.value),
              )}
            >
              {opt.label}
            </Link>
          ))}
        </CollapsibleFilterBlock>

        <CollapsibleFilterBlock label="Сортування">
          <Link
            href={shopHref(filters, { sort: null })}
            className={filterClass(filters.sort === "asc")}
          >
            Спочатку дешеві
          </Link>
          <Link
            href={shopHref(filters, { sort: "desc" })}
            className={filterClass(filters.sort === "desc")}
          >
            Спочатку дорогі
          </Link>
        </CollapsibleFilterBlock>
      </ShopFiltersDisclosure>

      {products.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
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
