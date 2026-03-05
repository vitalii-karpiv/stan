"use client";

import Image from "next/image";
import { useState } from "react";

type ProductImageGalleryProps = {
  images: { url: string; alt: string | null }[];
  productTitle: string;
};

export function ProductImageGallery({
  images,
  productTitle,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-gradient-to-br from-muted to-muted-foreground/20" />
    );
  }

  const current = images[selectedIndex];

  return (
    <div>
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={current.url}
          alt={current.alt ?? productTitle}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={selectedIndex === 0}
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative h-20 w-16 flex-shrink-0 overflow-hidden border-2 transition-colors ${
                i === selectedIndex
                  ? "border-foreground"
                  : "border-transparent hover:border-border"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt ?? `${productTitle} — ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
