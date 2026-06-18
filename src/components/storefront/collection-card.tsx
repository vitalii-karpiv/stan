"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { CollectionInstructionModal } from "./collection-instruction-modal";

type CollectionCardProps = Readonly<{
  name: string;
  slug: string;
  imageUrl: string | null;
}>;

export function CollectionCard({
  name,
  slug,
  imageUrl,
}: CollectionCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="group block">
      <Link
        href={`/collections/${encodeURIComponent(slug)}`}
        className="relative block aspect-4/5 overflow-hidden"
        aria-label={name}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-muted to-muted-foreground/20" />
        )}
      </Link>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 block w-full text-center font-[family-name:var(--font-display)] text-sm font-normal text-brand underline underline-offset-4 transition-opacity hover:opacity-70"
      >
        Інструкція
      </button>

      {open ? (
        <CollectionInstructionModal
          slug={slug}
          name={name}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </div>
  );
}
