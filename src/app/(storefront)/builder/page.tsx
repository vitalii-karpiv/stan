import { db } from "@/lib/db";
import { BuilderSetup } from "@/components/storefront/builder-setup";

export const metadata = { title: "Конструктор" };

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
    <div className="mx-auto max-w-lg px-6 py-10">
      <h1 className="text-center font-[family-name:var(--font-cormorant)] text-4xl font-light lowercase tracking-tight text-foreground">
        Конструктор
      </h1>

      <BuilderSetup collections={collections} categories={categories} />
    </div>
  );
}
