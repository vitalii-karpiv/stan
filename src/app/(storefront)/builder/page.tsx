import { db } from "@/lib/db";
import { BuilderSetup } from "@/components/storefront/builder-setup";

export const metadata = { title: "Конструктор" };

const headingClassName =
  "font-[family-name:var(--font-display)] font-[750] uppercase text-brand";

export default async function BuilderPage() {
  const [collections, categories] = await Promise.all([
    db.collection.findMany({
      where: { supportsBuilder: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true, imageUrl: true },
    }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1
        className={`${headingClassName} text-center text-3xl tracking-tight md:text-[40px]`}
      >
        Конструктор
      </h1>

      <BuilderSetup collections={collections} categories={categories} />
    </div>
  );
}
