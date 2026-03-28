import Link from "next/link";

import { db } from "@/lib/db";
import { CollectionCard } from "@/components/storefront/collection-card";
import { SizeGuideTabs } from "@/components/storefront/size-guide-tabs";
import { ProductCard } from "@/components/storefront/product-card";

export const revalidate = 60;

const heroCtaClassName =
  "inline-block bg-accent px-8 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90";

export default async function HomePage() {
  const [collections, featuredProducts] = await Promise.all([
    db.collection.findMany({
      where: { products: { some: {} } },
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    db.product.findMany({
      where: { featured: true, published: true },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
      },
    }),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-light tracking-tight md:text-6xl">
          ПРИКРАСИ-КОНСТРУКТОРИ
        </h1>
        <p className="mt-4 max-w-md text-sm text-muted-foreground sm:text-base md:text-lg">
          Коли прикраса перестає бути просто аксесуаром і стає
          маленьким ритуалом щоденного самовираження.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/shop" className={heroCtaClassName}>
            Каталог
          </Link>
          <Link href="/builder" className={heroCtaClassName}>
            Конструктор
          </Link>
        </div>
      </section>

      {/* Колекції */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <h2 className="font-[family-name:var(--font-cormorant)] text-3xl font-light">
          Колекції
        </h2>
        {collections.length > 0 ? (
          <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="w-[78%] shrink-0 snap-start sm:w-auto sm:shrink"
              >
                <CollectionCard
                  name={collection.name}
                  slug={collection.slug}
                  imageUrl={collection.imageUrl}
                  productCount={collection._count.products}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            Нові колекції незабаром.
          </p>
        )}
      </section>

      {/* Обране */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <h2 className="font-[family-name:var(--font-cormorant)] text-3xl font-light">
          Обране
        </h2>
        {featuredProducts.length > 0 ? (
          <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="w-[62%] shrink-0 snap-start sm:w-auto sm:shrink"
              >
                <ProductCard
                  title={product.title}
                  slug={product.slug}
                  imageUrl={product.images[0]?.url ?? null}
                  imageAlt={product.images[0]?.alt ?? null}
                  price={product.price}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            Рекомендовані товари з&#39;являться незабаром.
          </p>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <h2 className="font-[family-name:var(--font-cormorant)] text-3xl font-light">
          Про нас
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          Stan створює сучасні прикраси-конструктори, які легко адаптуються до
          вашого стилю та настрою. Ми поєднуємо мінімалістичний дизайн,
          продумані деталі та турботу про комфорт у щоденному носінні.
        </p>
      </section>

      <section
        id="jewelry-care"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 py-8"
      >
        <h2 className="font-[family-name:var(--font-cormorant)] text-3xl font-light">
          Як доглядати за прикрасами
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          Тут з’явиться короткий гайд з догляду: зберігання, контакт з водою та
          косметикою, чищення та коли краще знімати прикраси. Наразі розділ у
          підготовці.
        </p>
      </section>

      <section
        id="size-guide"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 py-8"
      >
        <h2 className="font-[family-name:var(--font-cormorant)] text-3xl font-light">
          Як дізнатися розмір
        </h2>
        <SizeGuideTabs />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-md border border-border bg-muted p-6 text-center">
          <p className="text-sm text-muted-foreground sm:text-base">
            Виникли запитання? Ми з радістю відповімо на них в Direct
          </p>
          <a
            href="https://www.instagram.com/stan.jewels"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block bg-accent px-8 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            Написати нам
          </a>
        </div>
      </section>
    </div>
  );
}
