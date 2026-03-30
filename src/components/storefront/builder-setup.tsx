"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export type BuilderCollectionOption = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
};

export type BuilderCategoryOption = {
  id: string;
  name: string;
  slug: string;
};

type BuilderSetupProps = {
  collections: BuilderCollectionOption[];
  categories: BuilderCategoryOption[];
};

export function BuilderSetup({ collections, categories }: BuilderSetupProps) {
  const [collectionSlug, setCollectionSlug] = useState<string | null>(null);
  const [categorySlug, setCategorySlug] = useState<string | null>(null);

  const canContinue = Boolean(collectionSlug && categorySlug);
  const continueHref =
    collectionSlug && categorySlug
      ? `/builder/edit?collection=${encodeURIComponent(collectionSlug)}&category=${encodeURIComponent(categorySlug)}`
      : "#";

  if (collections.length === 0) {
    return (
      <div className="mt-10 text-center text-sm text-muted-foreground">
        Наразі немає колекцій у конструкторі. Загляньте пізніше.
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-10">
      <section>
        <h2 className="text-center text-sm font-medium text-foreground/80">
          Обери колекцію
        </h2>
        <div className="mt-4 flex snap-x snap-mandatory justify-center gap-3 overflow-x-auto pb-1 sm:gap-4">
          {collections.map((c) => {
            const selected = collectionSlug === c.slug;
            return (
              <div
                key={c.id}
                className="w-[42%] max-w-[200px] shrink-0 snap-start sm:w-[min(200px,40vw)]"
              >
                <button
                  type="button"
                  onClick={() => setCollectionSlug(c.slug)}
                  className={`relative aspect-square w-full overflow-hidden rounded-md border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    selected
                      ? "border-foreground ring-2 ring-foreground/20"
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  {c.imageUrl ? (
                    <Image
                      src={c.imageUrl}
                      alt=""
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/15" />
                  )}
                </button>
                <p
                  className={`mt-2 text-center text-xs ${
                    selected ? "font-medium text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {c.name}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-center text-sm font-medium text-foreground/80">
          Обери вид прикраси
        </h2>
        <div className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-3">
          {categories.map((cat) => {
            const selected = categorySlug === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategorySlug(cat.slug)}
                className={`rounded-md border px-4 py-2.5 text-sm italic text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  selected
                    ? "border-foreground bg-muted/40 text-foreground"
                    : "border-border hover:border-foreground/40"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      <div className="pt-2">
        {canContinue ? (
          <Link
            href={continueHref}
            className="block w-full rounded-md bg-accent py-3.5 text-center text-sm font-medium italic text-accent-foreground transition-opacity hover:opacity-90"
          >
            Продовжити
          </Link>
        ) : (
          <span
            aria-disabled
            className="block w-full cursor-not-allowed rounded-md bg-accent/40 py-3.5 text-center text-sm font-medium italic text-accent-foreground/70"
          >
            Продовжити
          </span>
        )}
      </div>
    </div>
  );
}
