import Image from "next/image";
import Link from "next/link";

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
  return (
    <div className="group block">
      <Link
        href={`/shop?collection=${encodeURIComponent(slug)}`}
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

      <Link
        href={`/collections/${encodeURIComponent(slug)}`}
        className="mt-3 block text-center text-sm text-brand underline underline-offset-4 transition-opacity hover:opacity-70"
      >
        Інструкція
      </Link>
    </div>
  );
}
