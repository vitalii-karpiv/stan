import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/utils";

type ProductCardProps = {
  title: string;
  slug: string;
  imageUrl: string | null;
  imageAlt: string | null;
  priceInCents: number | null;
};

export function ProductCard({
  title,
  slug,
  imageUrl,
  imageAlt,
  priceInCents,
}: ProductCardProps) {
  return (
    <Link href={`/shop/${slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt ?? title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20" />
        )}
      </div>

      <div className="mt-3">
        <h3 className="font-[family-name:var(--font-cormorant)] text-lg font-light">
          {title}
        </h3>
        {priceInCents != null && (
          <p className="mt-1 text-sm text-muted-foreground">
            Від {formatPrice(priceInCents)}
          </p>
        )}
      </div>
    </Link>
  );
}
