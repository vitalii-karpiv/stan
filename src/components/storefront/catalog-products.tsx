import { Suspense } from "react";
import Link from "next/link";
import { X } from "lucide-react";

import { db } from "@/lib/db";
import { ProductCard } from "@/components/storefront/product-card";
import { ShopFilterBar } from "@/components/storefront/shop-filter-bar";
import { materialLabel } from "@/lib/materials";
import { PRODUCT_TYPE_OPTIONS } from "@/lib/product-types";
import { shopHref, type ParsedShopFilters } from "@/lib/shop-search";
import type { Prisma } from "@/generated/prisma";

const productTypeLabel = new Map(
  PRODUCT_TYPE_OPTIONS.map((o) => [o.value, o.label]),
);

type CategoryOption = { id: string; slug: string; name: string };

type CatalogProductsProps = Readonly<{
  filters: ParsedShopFilters;
  categories: CategoryOption[];
  basePath?: string;
  collection?: { slug: string; name: string } | null;
  collectionFixed?: boolean;
}>;

export function CatalogProducts({
  filters,
  categories,
  basePath = "/shop",
  collection = null,
  collectionFixed = false,
}: CatalogProductsProps) {
  // When the collection is fixed by the route, force it into the filters used
  // for querying — even though it never appears in the query string.
  const effectiveFilters: ParsedShopFilters =
    collectionFixed && collection
      ? { ...filters, collection: collection.slug }
      : filters;

  const categoryName = new Map(categories.map((c) => [c.slug, c.name]));

  const showCollectionChip = Boolean(collection) && !collectionFixed;

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.materials.length > 0 ||
    filters.productTypes.length > 0 ||
    showCollectionChip;

  const resultsKey = [
    effectiveFilters.categories.join(","),
    effectiveFilters.collection ?? "",
    effectiveFilters.materials.join(","),
    effectiveFilters.productTypes.join(","),
    effectiveFilters.sort,
  ].join("|");

  return (
    <>
      <ShopFilterBar
        filters={filters}
        categories={categories}
        basePath={basePath}
        showProductType={collectionFixed || Boolean(filters.collection)}
      />

      {hasActiveFilters ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {showCollectionChip && collection ? (
            <FilterChip
              href={shopHref(
                filters,
                { collection: null, productTypes: null },
                basePath,
              )}
              label={collection.name}
            />
          ) : null}
          {filters.categories.map((slug) => (
            <FilterChip
              key={`cat-${slug}`}
              href={shopHref(filters, { toggleCategory: slug }, basePath)}
              label={categoryName.get(slug) ?? slug}
            />
          ))}
          {filters.materials.map((value) => (
            <FilterChip
              key={`mat-${value}`}
              href={shopHref(filters, { toggleMaterial: value }, basePath)}
              label={materialLabel(value)}
            />
          ))}
          {filters.productTypes.map((value) => (
            <FilterChip
              key={`type-${value}`}
              href={shopHref(filters, { toggleProductType: value }, basePath)}
              label={productTypeLabel.get(value) ?? value}
            />
          ))}
          <Link
            href={basePath}
            className="text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Очистити все
          </Link>
        </div>
      ) : null}

      <Suspense key={resultsKey} fallback={<ProductsSkeleton />}>
        <ProductResults filters={effectiveFilters} />
      </Suspense>
    </>
  );
}

async function ProductResults({
  filters,
}: Readonly<{ filters: ParsedShopFilters }>) {
  const andParts: Prisma.ProductWhereInput[] = [{ published: true }];

  if (filters.categories.length > 0) {
    andParts.push({ category: { slug: { in: filters.categories } } });
  }
  if (filters.collection) {
    andParts.push({
      collections: { some: { collection: { slug: filters.collection } } },
    });
  }
  if (filters.materials.length > 0) {
    andParts.push({
      OR: filters.materials.map((m) => ({ materials: { has: m } })),
    });
  }
  if (filters.productTypes.length > 0) {
    andParts.push({ productType: { in: filters.productTypes } });
  }

  const where: Prisma.ProductWhereInput =
    andParts.length === 1 ? andParts[0]! : { AND: andParts };

  const products = await db.product.findMany({
    where,
    orderBy: { price: filters.sort === "desc" ? "desc" : "asc" },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 2 },
    },
  });

  if (products.length === 0) {
    return (
      <p className="mt-12 text-center text-muted-foreground">
        Товарів не знайдено.
      </p>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          title={product.title}
          slug={product.slug}
          imageUrl={product.images[0]?.url ?? null}
          imageAlt={product.images[0]?.alt ?? null}
          secondImageUrl={product.images[1]?.url ?? null}
          secondImageAlt={product.images[1]?.alt ?? null}
          price={product.price}
        />
      ))}
    </div>
  );
}

const SKELETON_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];

function ProductsSkeleton() {
  return (
    <div
      className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
      aria-busy="true"
    >
      {SKELETON_KEYS.map((key) => (
        <div key={key} className="animate-pulse">
          <div className="aspect-3/4 bg-muted" />
          <div className="mt-3 h-4 w-2/3 bg-muted" />
          <div className="mt-2 h-4 w-1/3 bg-muted" />
        </div>
      ))}
    </div>
  );
}

function FilterChip({ href, label }: Readonly<{ href: string; label: string }>) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 border border-border px-2.5 py-1 text-xs leading-tight text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
    >
      <span>{label}</span>
      <X className="h-3 w-3 shrink-0" aria-hidden />
    </Link>
  );
}
