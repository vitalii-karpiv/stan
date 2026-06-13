import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import { ButtonLink } from "@/components/storefront/button";
import { CatalogProducts } from "@/components/storefront/catalog-products";
import { InstructionSteps } from "@/components/storefront/instruction-steps";
import { getCollectionInstruction } from "@/lib/collection-instructions";
import { parseShopSearchParams } from "@/lib/shop-search";

const headingClassName =
  "font-[family-name:var(--font-display)] font-[750] uppercase text-brand";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
  params,
}: Readonly<{ params: Params }>): Promise<Metadata> {
  const { slug } = await params;
  const collection = await db.collection.findFirst({
    where: { slug },
    select: { name: true },
  });
  return { title: collection?.name ?? "Колекція" };
}

export default async function CollectionPage({
  params,
  searchParams,
}: Readonly<{
  params: Params;
  searchParams: SearchParams;
}>) {
  const { slug } = await params;
  const raw = await searchParams;
  const filters = parseShopSearchParams(raw);

  const [collection, categories] = await Promise.all([
    db.collection.findFirst({ where: { slug } }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!collection) notFound();

  const instruction = getCollectionInstruction(slug);

  return (
    <div className="mx-auto max-w-7xl px-6 pt-8 pb-12">
      <h1
        className={`${headingClassName} text-center text-3xl tracking-tight md:text-[40px]`}
      >
        {collection.name}
      </h1>

      {instruction ? (
        <section className="mt-10">
          <InstructionSteps steps={instruction.steps} />

          <div className="mt-10 flex flex-col items-center gap-6">
            <a
              href={instruction.videoUrl}
              className="text-sm text-brand underline underline-offset-4 transition-opacity hover:opacity-70"
            >
              Дивитись відеоінструкцію
            </a>
            <ButtonLink href="/builder">Створити в конструкторі</ButtonLink>
          </div>
        </section>
      ) : null}

      <section className="mt-16">
        <h2 className={`${headingClassName} text-2xl md:text-3xl`}>Товари</h2>

        <CatalogProducts
          filters={filters}
          categories={categories}
          basePath={`/collections/${slug}`}
          collection={{ slug, name: collection.name }}
          collectionFixed
        />
      </section>
    </div>
  );
}
