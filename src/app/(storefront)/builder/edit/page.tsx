import Link from "next/link";
import { redirect } from "next/navigation";

import { BuilderEditor } from "@/components/storefront/builder-editor";
import { BUILDER_ASSEMBLY_SLUG } from "@/lib/constants/builder";
import { db } from "@/lib/db";

export const metadata = { title: "Конструктор — збірка" };

const headingClassName =
  "font-[family-name:var(--font-display)] font-[750] uppercase text-brand";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function BuilderEditPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  const collectionSlug =
    typeof raw.collection === "string" ? raw.collection : undefined;
  const categorySlug =
    typeof raw.category === "string" ? raw.category : undefined;

  if (!collectionSlug?.trim() || !categorySlug?.trim()) {
    redirect("/builder");
  }

  const [collection, category, anchorProduct, parts] = await Promise.all([
    db.collection.findFirst({
      where: { slug: collectionSlug, supportsBuilder: true },
      select: { id: true, name: true, slug: true, imageUrl: true },
    }),
    db.category.findFirst({
      where: { slug: categorySlug },
      select: { id: true, name: true, slug: true },
    }),
    db.product.findFirst({
      where: { slug: BUILDER_ASSEMBLY_SLUG },
      select: { id: true },
    }),
    db.builderPart.findMany({
      where: {
        collection: { slug: collectionSlug },
        category: { slug: categorySlug },
      },
      orderBy: [{ kind: "asc" }, { sortOrder: "asc" }, { title: "asc" }],
      select: {
        id: true,
        title: true,
        previewImageUrl: true,
        selectorImageUrl: true,
        price: true,
        kind: true,
      },
    }),
  ]);

  if (!collection || !category) {
    redirect("/builder");
  }

  if (!anchorProduct) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-sm text-muted-foreground">
          <Link href="/builder" className="underline underline-offset-2">
            ← Назад до вибору
          </Link>
        </p>
        <h1 className={`${headingClassName} mt-6 text-3xl tracking-tight md:text-[40px]`}>
          Конструктор
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Конструктор ще не налаштований. Запустіть{" "}
          <code className="rounded bg-muted px-1">npm run db:seed:builder-anchor</code>{" "}
          на сервері з базою даних.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-10 md:max-w-2xl md:px-8 lg:max-w-4xl xl:max-w-6xl">
      <h1
        className={`${headingClassName} text-center text-3xl tracking-tight md:text-[40px]`}
      >
        Конструктор
      </h1>

      <BuilderEditor
        collectionSlug={collection.slug}
        categorySlug={category.slug}
        collectionName={collection.name}
        categoryName={category.name}
        collectionImageUrl={collection.imageUrl}
        anchorProductId={anchorProduct.id}
        parts={parts}
      />
    </div>
  );
}
