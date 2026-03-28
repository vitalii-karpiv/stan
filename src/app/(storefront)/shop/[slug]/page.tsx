import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import { ProductImageGallery } from "@/components/storefront/product-image-gallery";
import { OptionPicker } from "@/components/storefront/option-picker";
import { ProductCard } from "@/components/storefront/product-card";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getProduct(slug: string) {
  return db.product.findUnique({
    where: { slug, published: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      options: { orderBy: { type: "asc" } },
      category: true,
      collections: {
        include: { collection: true },
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return {};

  return {
    title: product.title,
    description: product.description ?? `${product.title} — Stan`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const relatedProducts = await db.product.findMany({
    where: {
      published: true,
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
  });

  const collections = product.collections.map((pc) => pc.collection);
  const materialText = product.materialText?.trim() ?? "";
  const jewelryLengthText = product.jewelryLengthText?.trim() ?? "";
  const showMaterialBlock = Boolean(materialText || jewelryLengthText);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
        <Link href="/shop" className="transition-colors hover:text-foreground">
          Магазин
        </Link>
        <span>/</span>
        <Link
          href={`/shop?category=${product.category.slug}`}
          className="transition-colors hover:text-foreground"
        >
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.title}</span>
      </nav>

      {/* Product grid */}
      <div className="grid gap-12 md:grid-cols-2">
        {/* Left — images */}
        <ProductImageGallery
          images={product.images}
          productTitle={product.title}
        />

        {/* Right — info */}
        <div className="space-y-6">
          <h1 className="font-[family-name:var(--font-cormorant)] text-3xl font-light md:text-4xl">
            {product.title}
          </h1>

          {product.description && (
            <p className="leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}

          <OptionPicker
            productId={product.id}
            productTitle={product.title}
            productSlug={product.slug}
            imageUrl={product.images[0]?.url ?? null}
            price={product.price}
            options={product.options}
          />

          {showMaterialBlock && (
            <div className="space-y-3 border-t border-border pt-4">
              {materialText && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Матеріал: </span>
                  <span className="whitespace-pre-line break-words">
                    {materialText.replace(/\\n/g, "\n")}
                  </span>
                </p>
              )}
              {jewelryLengthText && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Довжина прикраси:{" "}
                  </span>
                  <span className="whitespace-pre-line break-words">
                    {jewelryLengthText.replace(/\\n/g, "\n")}
                  </span>
                </p>
              )}
            </div>
          )}

          {collections.length > 0 && (
            <div className="border-t border-border pt-6">
              <p className="mb-2 text-sm font-medium">Колекції</p>
              <div className="flex flex-wrap gap-2">
                {collections.map((c) => (
                  <Link
                    key={c.id}
                    href={`/shop?collection=${c.slug}`}
                    className="border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-light">
            Вам також може сподобатись
          </h2>
          <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                className="w-[62%] shrink-0 snap-start sm:w-[38%] lg:w-[24%]"
              >
                <ProductCard
                  title={p.title}
                  slug={p.slug}
                  imageUrl={p.images[0]?.url ?? null}
                  imageAlt={p.images[0]?.alt ?? null}
                  price={p.price}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
