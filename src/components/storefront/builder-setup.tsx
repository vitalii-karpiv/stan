"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { CollectionInstructionModal } from "./collection-instruction-modal";

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
  const [instructionFor, setInstructionFor] =
    useState<BuilderCollectionOption | null>(null);

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
    <div className="mt-10 space-y-12">
      <section>
        <h2 className="text-center font-sans text-lg font-medium text-foreground md:text-xl">
          Обери колекцію
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-4 sm:gap-6">
          {collections.map((c) => {
            const selected = collectionSlug === c.slug;
            return (
              <div
                key={c.id}
                className="w-[44%] max-w-[220px] sm:w-[200px]"
              >
                <button
                  type="button"
                  onClick={() => setCollectionSlug(c.slug)}
                  className={`relative block aspect-4/5 w-full overflow-hidden rounded-md border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    selected
                      ? "border-foreground ring-2 ring-foreground/20"
                      : "border-border hover:border-foreground/30"
                  }`}
                  aria-pressed={selected}
                >
                  {c.imageUrl ? (
                    <Image
                      src={c.imageUrl}
                      alt={c.name}
                      fill
                      sizes="(max-width: 640px) 44vw, 200px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-linear-to-br from-muted to-muted-foreground/15" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setInstructionFor(c)}
                  className="mt-3 block w-full text-center text-sm text-brand underline underline-offset-4 transition-opacity hover:opacity-70"
                >
                  Інструкція
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-center font-sans text-lg font-medium text-foreground md:text-xl">
          Обери вид прикраси
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => {
            const selected = categorySlug === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategorySlug(cat.slug)}
                className={`rounded-md border px-4 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  selected
                    ? "border-foreground bg-muted text-foreground"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex justify-center pt-2">
        {canContinue ? (
          <Link
            href={continueHref}
            className="inline-flex items-center justify-center rounded-xl bg-accent px-10 py-3 font-sans text-base font-extrabold text-accent-foreground transition-opacity hover:opacity-90"
          >
            Продовжити
          </Link>
        ) : (
          <span
            aria-disabled
            className="inline-flex cursor-not-allowed items-center justify-center rounded-xl bg-accent/40 px-10 py-3 font-sans text-base font-extrabold text-accent-foreground/70"
          >
            Продовжити
          </span>
        )}
      </div>

      {instructionFor ? (
        <CollectionInstructionModal
          slug={instructionFor.slug}
          name={instructionFor.name}
          onClose={() => setInstructionFor(null)}
        />
      ) : null}
    </div>
  );
}
