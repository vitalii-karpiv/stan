import Link from "next/link";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

export const metadata = { title: "Конструктор — збірка" };

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

  const [collection, category] = await Promise.all([
    db.collection.findFirst({
      where: { slug: collectionSlug, supportsBuilder: true },
      select: { name: true },
    }),
    db.category.findFirst({
      where: { slug: categorySlug },
      select: { name: true },
    }),
  ]);

  if (!collection || !category) {
    redirect("/builder");
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm text-muted-foreground">
        <Link href="/builder" className="underline underline-offset-2">
          ← Назад до вибору
        </Link>
      </p>

      <h1 className="mt-6 font-[family-name:var(--font-cormorant)] text-4xl font-light">
        Конструктор
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {collection.name} · {category.name}
      </p>

      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>Робоча зона конструктора зараз у розробці.</p>
        <p>
          Незабаром тут можна буде зібрати прикрасу у власній комбінації та
          переглянути доступні елементи.
        </p>
      </div>
    </div>
  );
}
