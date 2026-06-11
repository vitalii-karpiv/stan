import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/utils";

const imageSizes =
  "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw";

type ProductCardProps = {
  title: string;
  slug: string;
  imageUrl: string | null;
  imageAlt: string | null;
  price: number;
  secondImageUrl?: string | null;
  secondImageAlt?: string | null;
};

export function ProductCard({
  title,
  slug,
  imageUrl,
  imageAlt,
  price,
  secondImageUrl = null,
  secondImageAlt = null,
}: ProductCardProps) {
  const secondSrc =
    imageUrl && secondImageUrl ? secondImageUrl : null;

  return (
    <Link href={`/shop/${slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden">
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={imageAlt ?? title}
              fill
              sizes={imageSizes}
              className={
                secondSrc
                  ? "object-cover opacity-100 transition-[transform,opacity] duration-500 group-hover:scale-105 group-hover:opacity-0"
                  : "object-cover transition-transform duration-500 group-hover:scale-105"
              }
            />
            {secondSrc ? (
              <Image
                src={secondSrc}
                alt={secondImageAlt ?? title}
                fill
                sizes={imageSizes}
                className="absolute inset-0 z-10 object-cover opacity-0 transition-[transform,opacity] duration-500 group-hover:scale-105 group-hover:opacity-100"
              />
            ) : null}
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20" />
        )}
      </div>

      <div className="mt-2">
        <h3 className="font-sans text-lg font-light leading-tight">
          {title}
        </h3>
        {price > 0 && (
          <p className="mt-1.5 font-sans text-lg font-semibold text-brand">
            {formatPrice(price)}
          </p>
        )}
      </div>
    </Link>
  );
}
