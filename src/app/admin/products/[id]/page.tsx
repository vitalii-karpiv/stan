import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import { ProductImages } from "@/components/admin/product-images";
import { db } from "@/lib/db";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const [product, categories, collections] = await Promise.all([
    db.product.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        categoryId: true,
        published: true,
        featured: true,
        collections: { select: { collectionId: true } },
        images: { orderBy: { sortOrder: "asc" }, select: { id: true, url: true, alt: true, sortOrder: true } },
      },
    }),
    db.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    db.collection.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Edit Product</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {product.title}
          </p>
        </div>
        <Link
          href="/admin/products"
          className="rounded border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Back to Products
        </Link>
      </div>

      <ProductForm
        categories={categories}
        collections={collections}
        product={product}
        selectedCollectionIds={product.collections.map((c) => c.collectionId)}
      />

      <ProductImages productId={product.id} images={product.images} />
    </div>
  );
}
