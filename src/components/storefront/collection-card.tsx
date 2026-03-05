import Image from "next/image";
import Link from "next/link";

type CollectionCardProps = {
  name: string;
  slug: string;
  imageUrl: string | null;
  productCount: number;
};

export function CollectionCard({
  name,
  slug,
  imageUrl,
  productCount,
}: CollectionCardProps) {
  return (
    <Link
      href={`/shop?collection=${slug}`}
      className="group relative block aspect-[4/5] overflow-hidden"
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20 transition-opacity duration-500 group-hover:opacity-90" />
      )}

      <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:bg-black/30" />

      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-light text-white">
          {name}
        </h3>
        <p className="mt-1 text-sm text-white/70">
          {productCount}{" "}
          {productCount === 1
            ? "виріб"
            : productCount >= 2 && productCount <= 4
              ? "вироби"
              : "виробів"}
        </p>
      </div>
    </Link>
  );
}
